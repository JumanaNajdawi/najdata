import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Database,
  Plus,
  Search,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Trash2,
  Settings,
  FileSpreadsheet,
  Server,
  Plug,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type SourceType = "file" | "postgres" | "mysql" | "api";
type SyncStatus = "synced" | "syncing" | "error";

interface DatabaseItem {
  id: string;
  name: string;
  sourceType: SourceType;
  tables: number;
  rows: number;
  status: SyncStatus;
  lastSync: string;
  createdAt: string;
}

const SAMPLE_DATABASES: DatabaseItem[] = [
  {
    id: "1",
    name: "Sales DB",
    sourceType: "postgres",
    tables: 12,
    rows: 45000,
    status: "synced",
    lastSync: "2 minutes ago",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Inventory",
    sourceType: "file",
    tables: 3,
    rows: 2500,
    status: "synced",
    lastSync: "1 hour ago",
    createdAt: "2024-01-05",
  },
  {
    id: "3",
    name: "CRM Data",
    sourceType: "api",
    tables: 8,
    rows: 12000,
    status: "syncing",
    lastSync: "Syncing now...",
    createdAt: "2024-01-10",
  },
  {
    id: "4",
    name: "Analytics",
    sourceType: "mysql",
    tables: 15,
    rows: 89000,
    status: "error",
    lastSync: "Failed 3 hours ago",
    createdAt: "2024-01-12",
  },
];

const sourceTypeIcons: Record<SourceType, React.ElementType> = {
  file: FileSpreadsheet,
  postgres: Server,
  mysql: Server,
  api: Plug,
};

const sourceTypeLabels: Record<SourceType, string> = {
  file: "File Upload",
  postgres: "PostgreSQL",
  mysql: "MySQL",
  api: "API",
};

const statusConfig: Record<SyncStatus, { icon: React.ElementType; color: string; label: string }> = {
  synced: { icon: CheckCircle2, color: "text-secondary", label: "Synced" },
  syncing: { icon: RefreshCw, color: "text-chart-4 animate-spin", label: "Syncing" },
  error: { icon: AlertCircle, color: "text-destructive", label: "Error" },
};

export const DatabasesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [databases] = useState<DatabaseItem[]>(SAMPLE_DATABASES);

  const filteredDatabases = databases.filter((db) =>
    db.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatRows = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <header className="h-16 bg-card/80 backdrop-blur-sm border-b border-border/60 flex items-center justify-between px-6 sticky top-0 z-40">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Databases</h1>
          <p className="text-sm text-muted-foreground">{databases.length} connected sources</p>
        </div>
        <Button asChild>
          <Link to="/databases/new">
            <Plus className="w-4 h-4 mr-2" />
            Create Database
          </Link>
        </Button>
      </header>

      <div className="p-6">
        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search databases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Database Cards */}
        {filteredDatabases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Database className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {searchQuery ? "No databases found" : "No databases connected"}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-sm">
              {searchQuery
                ? "Try adjusting your search query"
                : "Connect your first data source to start analyzing"}
            </p>
            {!searchQuery && (
              <Button asChild>
                <Link to="/databases/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Database
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-fade-in">
            {filteredDatabases.map((db, index) => {
              const SourceIcon = sourceTypeIcons[db.sourceType];
              const statusInfo = statusConfig[db.status];
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={db.id}
                  className="group bg-card rounded-xl border border-border/60 p-5 hover:border-primary/30 hover:shadow-md transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                        <Database className="w-5 h-5 text-accent-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{db.name}</h3>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <SourceIcon className="w-3 h-3" />
                          {sourceTypeLabels[db.sourceType]}
                        </div>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Sync Now
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-2xl font-semibold text-foreground">{db.tables}</p>
                      <p className="text-xs text-muted-foreground">Tables</p>
                    </div>
                    <div>
                      <p className="text-2xl font-semibold text-foreground">{formatRows(db.rows)}</p>
                      <p className="text-xs text-muted-foreground">Rows</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                    <div className={cn("flex items-center gap-1.5 text-sm", statusInfo.color)}>
                      <StatusIcon className="w-4 h-4" />
                      {statusInfo.label}
                    </div>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {db.lastSync}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
