import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Database,
  Table,
  Columns3,
  ChevronRight,
  ChevronLeft,
  BarChart3,
  Check,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
interface DatabaseOption {
  id: string;
  name: string;
  tables: TableOption[];
}

interface TableOption {
  id: string;
  name: string;
  columns: ColumnOption[];
}

interface ColumnOption {
  id: string;
  name: string;
  type: "string" | "number" | "date";
}

interface QuickInsightDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (insight: {
    database: string;
    table: string;
    columns: string[];
    chartType: string;
    data: any[];
  }) => void;
}

// Sample data
const DATABASES: DatabaseOption[] = [
  {
    id: "1",
    name: "Sales DB",
    tables: [
      {
        id: "1-1",
        name: "orders",
        columns: [
          { id: "c1", name: "order_id", type: "string" },
          { id: "c2", name: "customer_name", type: "string" },
          { id: "c3", name: "amount", type: "number" },
          { id: "c4", name: "date", type: "date" },
          { id: "c5", name: "region", type: "string" },
        ],
      },
      {
        id: "1-2",
        name: "products",
        columns: [
          { id: "c6", name: "product_id", type: "string" },
          { id: "c7", name: "name", type: "string" },
          { id: "c8", name: "category", type: "string" },
          { id: "c9", name: "price", type: "number" },
          { id: "c10", name: "stock", type: "number" },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Analytics",
    tables: [
      {
        id: "2-1",
        name: "page_views",
        columns: [
          { id: "c11", name: "page_url", type: "string" },
          { id: "c12", name: "views", type: "number" },
          { id: "c13", name: "unique_visitors", type: "number" },
          { id: "c14", name: "date", type: "date" },
        ],
      },
      {
        id: "2-2",
        name: "events",
        columns: [
          { id: "c15", name: "event_name", type: "string" },
          { id: "c16", name: "count", type: "number" },
          { id: "c17", name: "category", type: "string" },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "CRM Data",
    tables: [
      {
        id: "3-1",
        name: "customers",
        columns: [
          { id: "c18", name: "customer_id", type: "string" },
          { id: "c19", name: "name", type: "string" },
          { id: "c20", name: "email", type: "string" },
          { id: "c21", name: "lifetime_value", type: "number" },
          { id: "c22", name: "segment", type: "string" },
        ],
      },
    ],
  },
];

const CHART_TYPES = [
  { id: "bar", label: "Bar Chart", icon: BarChart3 },
  { id: "line", label: "Line Chart", icon: BarChart3 },
  { id: "pie", label: "Pie Chart", icon: BarChart3 },
  { id: "area", label: "Area Chart", icon: BarChart3 },
];

type Step = "database" | "table" | "columns" | "visualize";

export const QuickInsightDialog = ({
  open,
  onOpenChange,
  onSave,
}: QuickInsightDialogProps) => {
  const [step, setStep] = useState<Step>("database");
  const [selectedDatabase, setSelectedDatabase] = useState<DatabaseOption | null>(null);
  const [selectedTable, setSelectedTable] = useState<TableOption | null>(null);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [chartType, setChartType] = useState("bar");

  const steps: { key: Step; label: string; icon: React.ElementType }[] = [
    { key: "database", label: "Database", icon: Database },
    { key: "table", label: "Table", icon: Table },
    { key: "columns", label: "Columns", icon: Columns3 },
    { key: "visualize", label: "Visualize", icon: BarChart3 },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  const resetState = () => {
    setStep("database");
    setSelectedDatabase(null);
    setSelectedTable(null);
    setSelectedColumns([]);
    setChartType("bar");
  };

  const handleClose = () => {
    resetState();
    onOpenChange(false);
  };

  const handleSelectDatabase = (db: DatabaseOption) => {
    setSelectedDatabase(db);
    setSelectedTable(null);
    setSelectedColumns([]);
    setStep("table");
  };

  const handleSelectTable = (table: TableOption) => {
    setSelectedTable(table);
    setSelectedColumns([]);
    setStep("columns");
  };

  const toggleColumn = (columnName: string) => {
    setSelectedColumns((prev) =>
      prev.includes(columnName)
        ? prev.filter((c) => c !== columnName)
        : [...prev, columnName]
    );
  };

  const handleContinueToVisualize = () => {
    if (selectedColumns.length > 0) {
      setStep("visualize");
    }
  };

  const handleBack = () => {
    if (step === "table") {
      setStep("database");
      setSelectedDatabase(null);
    } else if (step === "columns") {
      setStep("table");
      setSelectedTable(null);
    } else if (step === "visualize") {
      setStep("columns");
    }
  };

  // Generate sample chart data based on selected columns
  const chartData = useMemo(() => {
    if (!selectedTable || selectedColumns.length === 0) return [];

    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return labels.map((label) => {
      const dataPoint: any = { name: label };
      selectedColumns.forEach((col) => {
        const column = selectedTable.columns.find((c) => c.name === col);
        if (column?.type === "number") {
          dataPoint[col] = Math.floor(Math.random() * 1000) + 100;
        } else {
          dataPoint.value = Math.floor(Math.random() * 1000) + 100;
        }
      });
      return dataPoint;
    });
  }, [selectedTable, selectedColumns]);

  const handleSave = () => {
    if (onSave && selectedDatabase && selectedTable) {
      onSave({
        database: selectedDatabase.name,
        table: selectedTable.name,
        columns: selectedColumns,
        chartType,
        data: chartData,
      });
    }
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl">Quick Insight</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Select your data and create a visualization in seconds
          </p>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => {
              const Icon = s.icon;
              const isActive = s.key === step;
              const isCompleted = index < currentStepIndex;

              return (
                <div key={s.key} className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                        isActive && "bg-primary text-primary-foreground",
                        isCompleted && "bg-primary/20 text-primary",
                        !isActive && !isCompleted && "bg-muted text-muted-foreground"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-sm font-medium",
                        isActive && "text-foreground",
                        !isActive && "text-muted-foreground"
                      )}
                    >
                      {s.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="w-4 h-4 mx-4 text-muted-foreground/50" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[300px]">
          {step === "database" && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground mb-4">
                Choose a database to start
              </p>
              {DATABASES.map((db) => (
                <button
                  key={db.id}
                  onClick={() => handleSelectDatabase(db)}
                  className="w-full p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-all text-left flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Database className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{db.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {db.tables.length} tables
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>
              ))}
            </div>
          )}

          {step === "table" && selectedDatabase && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground mb-4">
                Select a table from <span className="font-medium text-foreground">{selectedDatabase.name}</span>
              </p>
              {selectedDatabase.tables.map((table) => (
                <button
                  key={table.id}
                  onClick={() => handleSelectTable(table)}
                  className="w-full p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-all text-left flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-chart-2/10 flex items-center justify-center">
                    <Table className="w-5 h-5 text-chart-2" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{table.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {table.columns.length} columns
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>
              ))}
            </div>
          )}

          {step === "columns" && selectedTable && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Select columns to visualize from <span className="font-medium text-foreground">{selectedTable.name}</span>
              </p>
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {selectedTable.columns.map((column) => (
                    <label
                      key={column.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-all"
                    >
                      <Checkbox
                        checked={selectedColumns.includes(column.name)}
                        onCheckedChange={() => toggleColumn(column.name)}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{column.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {column.type}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </ScrollArea>
              <div className="pt-2">
                <p className="text-sm text-muted-foreground">
                  {selectedColumns.length} columns selected
                </p>
              </div>
            </div>
          )}

          {step === "visualize" && (
            <div className="space-y-4">
              {/* Chart Type Selection */}
              <div>
                <p className="text-sm text-muted-foreground mb-3">Chart Type</p>
                <div className="flex gap-2">
                  {CHART_TYPES.map((type) => (
                    <Button
                      key={type.id}
                      variant={chartType === type.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setChartType(type.id)}
                      className="flex-1"
                    >
                      {type.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="border rounded-lg p-4 bg-muted/30">
                <p className="text-sm text-muted-foreground mb-3">Preview</p>
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === "bar" ? (
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip />
                        <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    ) : chartType === "line" ? (
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} />
                      </LineChart>
                    ) : chartType === "area" ? (
                      <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip />
                        <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                      </AreaChart>
                    ) : (
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          outerRadius={70}
                          dataKey="value"
                        >
                          {chartData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={step === "database" ? handleClose : handleBack}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {step === "database" ? "Cancel" : "Back"}
          </Button>

          {step === "columns" && (
            <Button
              onClick={handleContinueToVisualize}
              disabled={selectedColumns.length === 0}
            >
              Continue
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}

          {step === "visualize" && (
            <Button onClick={handleSave}>
              <Check className="w-4 h-4 mr-1" />
              Create Insight
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
