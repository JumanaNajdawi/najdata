import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  RefreshCw,
  Settings,
  Table,
  Search,
  ChevronRight,
  Database,
  Clock,
  CheckCircle2,
  Hash,
  Type,
  Calendar,
  DollarSign,
  MoreHorizontal,
  Play,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface TableInfo {
  name: string;
  rows: number;
  columns: number;
  lastUpdated: string;
}

interface ColumnInfo {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey?: boolean;
}

const SAMPLE_TABLES: TableInfo[] = [
  { name: "orders", rows: 15420, columns: 12, lastUpdated: "2 min ago" },
  { name: "products", rows: 856, columns: 8, lastUpdated: "2 min ago" },
  { name: "customers", rows: 4230, columns: 10, lastUpdated: "2 min ago" },
  { name: "order_items", rows: 45600, columns: 6, lastUpdated: "2 min ago" },
  { name: "categories", rows: 24, columns: 4, lastUpdated: "2 min ago" },
];

const SAMPLE_COLUMNS: ColumnInfo[] = [
  { name: "id", type: "integer", nullable: false, primaryKey: true },
  { name: "customer_id", type: "integer", nullable: false },
  { name: "order_date", type: "timestamp", nullable: false },
  { name: "total_amount", type: "decimal", nullable: false },
  { name: "status", type: "varchar(50)", nullable: false },
  { name: "shipping_address", type: "text", nullable: true },
  { name: "created_at", type: "timestamp", nullable: false },
  { name: "updated_at", type: "timestamp", nullable: true },
];

const SAMPLE_DATA = [
  { id: 1, customer_id: 101, order_date: "2024-01-15", total_amount: 299.99, status: "completed" },
  { id: 2, customer_id: 102, order_date: "2024-01-15", total_amount: 149.50, status: "pending" },
  { id: 3, customer_id: 103, order_date: "2024-01-14", total_amount: 499.00, status: "completed" },
  { id: 4, customer_id: 101, order_date: "2024-01-14", total_amount: 75.25, status: "shipped" },
  { id: 5, customer_id: 104, order_date: "2024-01-13", total_amount: 1250.00, status: "completed" },
];

const typeIcons: Record<string, React.ElementType> = {
  integer: Hash,
  varchar: Type,
  text: Type,
  timestamp: Calendar,
  decimal: DollarSign,
};

export const DatabaseDetailPage = () => {
  const { id } = useParams();
  const [selectedTable, setSelectedTable] = useState<string>("orders");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const handleSync = async () => {
    setIsSyncing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSyncing(false);
    toast({
      title: "Sync complete",
      description: "Database refreshed successfully",
    });
  };

  const filteredTables = SAMPLE_TABLES.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-card/80 backdrop-blur-sm border-b border-border/60 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/databases">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
              <Database className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Sales DB</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />
                <span>Synced 2 min ago</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            disabled={isSyncing}
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", isSyncing && "animate-spin")} />
            {isSyncing ? "Syncing..." : "Sync Now"}
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Tables Sidebar */}
        <aside className="w-64 border-r border-border/60 bg-card/50 flex flex-col shrink-0">
          <div className="p-4 border-b border-border/60">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tables..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2 mb-2">
              Tables ({filteredTables.length})
            </p>
            <div className="space-y-1">
              {filteredTables.map((table) => (
                <button
                  key={table.name}
                  onClick={() => setSelectedTable(table.name)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                    selectedTable === table.name
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <Table className="w-4 h-4 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{table.name}</p>
                    <p className="text-xs opacity-70">
                      {formatNumber(table.rows)} rows
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Table Detail */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Table Header */}
          <div className="p-4 border-b border-border/60 flex items-center justify-between bg-card/30">
            <div className="flex items-center gap-3">
              <Table className="w-5 h-5 text-muted-foreground" />
              <div>
                <h2 className="font-semibold text-foreground">{selectedTable}</h2>
                <p className="text-sm text-muted-foreground">
                  {SAMPLE_TABLES.find((t) => t.name === selectedTable)?.rows.toLocaleString()} rows
                  {" · "}
                  {SAMPLE_COLUMNS.length} columns
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/ai-agent">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Query with AI
                </Link>
              </Button>
              <Button variant="outline" size="sm">
                <Play className="w-4 h-4 mr-2" />
                Run SQL
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-border/60 px-4">
            <div className="flex gap-6">
              <button className="py-3 text-sm font-medium text-primary border-b-2 border-primary">
                Schema
              </button>
              <button className="py-3 text-sm font-medium text-muted-foreground hover:text-foreground">
                Data Preview
              </button>
            </div>
          </div>

          {/* Schema */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="bg-card rounded-xl border border-border/60 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Column
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Nullable
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Key
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {SAMPLE_COLUMNS.map((col) => {
                    const TypeIcon = typeIcons[col.type.split("(")[0]] || Type;
                    return (
                      <tr
                        key={col.name}
                        className="border-b border-border/40 hover:bg-muted/20"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <TypeIcon className="w-4 h-4 text-muted-foreground" />
                            <span className="font-mono text-foreground">{col.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary" className="font-mono text-xs">
                            {col.type}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={cn(
                              "text-sm",
                              col.nullable ? "text-muted-foreground" : "text-foreground"
                            )}
                          >
                            {col.nullable ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {col.primaryKey && (
                            <Badge className="bg-chart-4/10 text-chart-4 text-xs">
                              Primary
                            </Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Sample Data Preview */}
            <div className="mt-6">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                Sample Data (first 5 rows)
              </h3>
              <div className="bg-card rounded-xl border border-border/60 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/30">
                      {Object.keys(SAMPLE_DATA[0]).map((key) => (
                        <th
                          key={key}
                          className="text-left py-3 px-4 font-medium text-muted-foreground whitespace-nowrap"
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SAMPLE_DATA.map((row, i) => (
                      <tr key={i} className="border-b border-border/40">
                        {Object.values(row).map((value, j) => (
                          <td
                            key={j}
                            className="py-3 px-4 text-foreground whitespace-nowrap"
                          >
                            {typeof value === "number" ? (
                              <span className="font-mono">{value}</span>
                            ) : (
                              value
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
