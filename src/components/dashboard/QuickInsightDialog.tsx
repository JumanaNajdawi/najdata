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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Database,
  Table,
  Columns3,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  BarChart3,
  Check,
  ArrowRight,
  Palette,
  Type,
  Wand2,
  Filter,
  ArrowUpDown,
  Calculator,
  Sigma,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ChartPreview } from "@/components/workflow/ChartPreview";
import { SQLVisualizationPanel, VisualizationConfig } from "@/components/sql/SQLVisualizationPanel";
import { ChartType, WorkflowBlock } from "@/components/workflow/types";

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

interface SelectedColumn {
  databaseId: string;
  databaseName: string;
  tableId: string;
  tableName: string;
  columnId: string;
  columnName: string;
  columnType: "string" | "number" | "date";
}

interface TransformConfig {
  filterEnabled: boolean;
  filterColumn: string;
  filterOperator: string;
  filterValue: string;
  sortEnabled: boolean;
  sortColumn: string;
  sortDirection: "asc" | "desc";
  aggregateEnabled: boolean;
  aggregateFunction: string;
  aggregateColumn: string;
  groupByEnabled: boolean;
  groupByColumn: string;
  limitEnabled: boolean;
  limitValue: number;
}

interface QuickInsightDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (insight: {
    title: string;
    database: string;
    table: string;
    columns: string[];
    chartType: string;
    data: any[];
    config?: VisualizationConfig;
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

type Step = "select-data" | "visualize";

export const QuickInsightDialog = ({
  open,
  onOpenChange,
  onSave,
}: QuickInsightDialogProps) => {
  const [step, setStep] = useState<Step>("select-data");
  const [selectedColumns, setSelectedColumns] = useState<SelectedColumn[]>([]);
  const [chartType, setChartType] = useState<ChartType | "table">("bar");
  const [insightTitle, setInsightTitle] = useState("");
  const [expandedDatabases, setExpandedDatabases] = useState<string[]>([]);
  const [expandedTables, setExpandedTables] = useState<string[]>([]);
  const [vizConfig, setVizConfig] = useState<VisualizationConfig>({
    colorScheme: "default",
    showLegend: true,
    showGrid: true,
    showDataLabels: false,
  });
  const [transformConfig, setTransformConfig] = useState<TransformConfig>({
    filterEnabled: false,
    filterColumn: "",
    filterOperator: "equals",
    filterValue: "",
    sortEnabled: false,
    sortColumn: "",
    sortDirection: "asc",
    aggregateEnabled: false,
    aggregateFunction: "sum",
    aggregateColumn: "",
    groupByEnabled: false,
    groupByColumn: "",
    limitEnabled: false,
    limitValue: 100,
  });

  const steps: { key: Step; label: string; icon: React.ElementType }[] = [
    { key: "select-data", label: "Select Data", icon: Columns3 },
    { key: "visualize", label: "Visualize", icon: BarChart3 },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  const resetState = () => {
    setStep("select-data");
    setSelectedColumns([]);
    setChartType("bar");
    setInsightTitle("");
    setExpandedDatabases([]);
    setExpandedTables([]);
    setVizConfig({
      colorScheme: "default",
      showLegend: true,
      showGrid: true,
      showDataLabels: false,
    });
    setTransformConfig({
      filterEnabled: false,
      filterColumn: "",
      filterOperator: "equals",
      filterValue: "",
      sortEnabled: false,
      sortColumn: "",
      sortDirection: "asc",
      aggregateEnabled: false,
      aggregateFunction: "sum",
      aggregateColumn: "",
      groupByEnabled: false,
      groupByColumn: "",
      limitEnabled: false,
      limitValue: 100,
    });
  };

  const handleClose = () => {
    resetState();
    onOpenChange(false);
  };

  const toggleDatabase = (dbId: string) => {
    setExpandedDatabases((prev) =>
      prev.includes(dbId) ? prev.filter((id) => id !== dbId) : [...prev, dbId]
    );
  };

  const toggleTable = (tableId: string) => {
    setExpandedTables((prev) =>
      prev.includes(tableId)
        ? prev.filter((id) => id !== tableId)
        : [...prev, tableId]
    );
  };

  const toggleColumn = (
    db: DatabaseOption,
    table: TableOption,
    column: ColumnOption
  ) => {
    const existing = selectedColumns.find(
      (sc) => sc.columnId === column.id && sc.tableId === table.id
    );
    if (existing) {
      setSelectedColumns((prev) =>
        prev.filter(
          (sc) => !(sc.columnId === column.id && sc.tableId === table.id)
        )
      );
    } else {
      setSelectedColumns((prev) => [
        ...prev,
        {
          databaseId: db.id,
          databaseName: db.name,
          tableId: table.id,
          tableName: table.name,
          columnId: column.id,
          columnName: column.name,
          columnType: column.type,
        },
      ]);
    }
  };

  const isColumnSelected = (tableId: string, columnId: string) => {
    return selectedColumns.some(
      (sc) => sc.columnId === columnId && sc.tableId === tableId
    );
  };

  const handleContinueToVisualize = () => {
    if (selectedColumns.length > 0) {
      // Auto-generate a title if not set
      if (!insightTitle) {
        const tables = [...new Set(selectedColumns.map((sc) => sc.tableName))];
        setInsightTitle(`${tables.join(" & ")} Analysis`);
      }
      setStep("visualize");
    }
  };

  const handleBack = () => {
    if (step === "visualize") {
      setStep("select-data");
    }
  };

  // Get all selected column names for visualization panel
  const columnNames = useMemo(() => {
    return selectedColumns.map((sc) => sc.columnName);
  }, [selectedColumns]);

  // Generate sample chart data based on selected columns
  const chartData = useMemo(() => {
    if (selectedColumns.length === 0) return [];

    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return labels.map((label) => {
      const dataPoint: any = { name: label };
      selectedColumns.forEach((sc) => {
        if (sc.columnType === "number") {
          dataPoint[sc.columnName] = Math.floor(Math.random() * 1000) + 100;
        } else {
          dataPoint.value = Math.floor(Math.random() * 1000) + 100;
        }
      });
      return dataPoint;
    });
  }, [selectedColumns]);

  // Create mock workflow for ChartPreview
  const mockWorkflow: WorkflowBlock[] = useMemo(() => {
    return [
      {
        id: "viz-1",
        instanceId: "viz-instance-1",
        type: `${chartType}-chart`,
        label: "Chart",
        icon: "BarChart2",
        category: "visualize",
        position: { x: 0, y: 0 },
        config: {
          chartType: chartType === "table" ? "bar" : chartType,
          colorScheme: vizConfig.colorScheme,
          showLegend: vizConfig.showLegend,
          showGrid: vizConfig.showGrid,
          showDataLabels: vizConfig.showDataLabels,
        },
      },
    ];
  }, [chartType, vizConfig]);

  const handleSave = () => {
    if (onSave && selectedColumns.length > 0) {
      const databases = [...new Set(selectedColumns.map((sc) => sc.databaseName))];
      const tables = [...new Set(selectedColumns.map((sc) => sc.tableName))];
      onSave({
        title: insightTitle || `${tables.join(" & ")} Analysis`,
        database: databases.join(", "),
        table: tables.join(", "),
        columns: columnNames,
        chartType: chartType === "table" ? "bar" : chartType,
        data: chartData,
        config: vizConfig,
      });
    }
    handleClose();
  };

  const updateTransformConfig = (updates: Partial<TransformConfig>) => {
    setTransformConfig((prev) => ({ ...prev, ...updates }));
  };

  // Group selected columns by database and table for display
  const groupedSelections = useMemo(() => {
    const groups: Record<string, Record<string, SelectedColumn[]>> = {};
    selectedColumns.forEach((sc) => {
      if (!groups[sc.databaseName]) {
        groups[sc.databaseName] = {};
      }
      if (!groups[sc.databaseName][sc.tableName]) {
        groups[sc.databaseName][sc.tableName] = [];
      }
      groups[sc.databaseName][sc.tableName].push(sc);
    });
    return groups;
  }, [selectedColumns]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl p-0 gap-0 max-h-[90vh] overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl">Quick Insight</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Select columns from any database to create a visualization
          </p>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-center gap-8">
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
        <div className="flex-1 overflow-hidden">
          {step === "visualize" ? (
            <div className="flex h-[500px]">
              {/* Preview Area */}
              <div className="flex-1 p-6 overflow-auto">
                {/* Title Input */}
                <div className="mb-4 space-y-2">
                  <Label className="text-sm flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    Insight Title
                  </Label>
                  <Input
                    placeholder="Enter insight title..."
                    value={insightTitle}
                    onChange={(e) => setInsightTitle(e.target.value)}
                    className="max-w-md"
                  />
                </div>

                {/* Chart Preview */}
                <div className="border rounded-lg p-4 bg-muted/30">
                  <p className="text-sm text-muted-foreground mb-3">Preview</p>
                  <div className="h-[280px]">
                    <ChartPreview workflow={mockWorkflow} data={chartData} />
                  </div>
                </div>
              </div>

              {/* Settings Panel */}
              <aside className="w-80 border-l border-border/60 bg-card/50 flex flex-col overflow-hidden">
                <ScrollArea className="flex-1">
                  {/* Visualization Options - without chart title */}
                  <div className="border-b border-border/60">
                    <SQLVisualizationPanel
                      chartType={chartType}
                      onChartTypeChange={setChartType}
                      config={{ ...vizConfig, chartTitle: undefined }}
                      onConfigChange={(newConfig) =>
                        setVizConfig({ ...newConfig, chartTitle: undefined })
                      }
                      columns={columnNames}
                      hideChartTitle
                    />
                  </div>

                  {/* Transform Data Section */}
                  <div className="p-3 space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Wand2 className="w-4 h-4 text-muted-foreground" />
                      <h3 className="text-sm font-semibold text-foreground">Transform Data</h3>
                    </div>

                    {/* Filter */}
                    <Collapsible>
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted/50 text-sm">
                        <div className="flex items-center gap-2">
                          <Filter className="w-4 h-4 text-muted-foreground" />
                          <span>Filter</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={transformConfig.filterEnabled}
                            onCheckedChange={(checked) =>
                              updateTransformConfig({ filterEnabled: checked })
                            }
                            onClick={(e) => e.stopPropagation()}
                          />
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-6 pr-2 pt-2 space-y-2">
                        <Select
                          value={transformConfig.filterColumn}
                          onValueChange={(v) =>
                            updateTransformConfig({ filterColumn: v })
                          }
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Select column" />
                          </SelectTrigger>
                          <SelectContent>
                            {columnNames.map((col) => (
                              <SelectItem key={col} value={col}>
                                {col}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex gap-2">
                          <Select
                            value={transformConfig.filterOperator}
                            onValueChange={(v) =>
                              updateTransformConfig({ filterOperator: v })
                            }
                          >
                            <SelectTrigger className="h-8 text-xs w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="equals">=</SelectItem>
                              <SelectItem value="not_equals">≠</SelectItem>
                              <SelectItem value="greater">&gt;</SelectItem>
                              <SelectItem value="less">&lt;</SelectItem>
                              <SelectItem value="contains">Contains</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="Value"
                            className="h-8 text-xs"
                            value={transformConfig.filterValue}
                            onChange={(e) =>
                              updateTransformConfig({ filterValue: e.target.value })
                            }
                          />
                        </div>
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Sort */}
                    <Collapsible>
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted/50 text-sm">
                        <div className="flex items-center gap-2">
                          <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                          <span>Sort</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={transformConfig.sortEnabled}
                            onCheckedChange={(checked) =>
                              updateTransformConfig({ sortEnabled: checked })
                            }
                            onClick={(e) => e.stopPropagation()}
                          />
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-6 pr-2 pt-2 space-y-2">
                        <Select
                          value={transformConfig.sortColumn}
                          onValueChange={(v) =>
                            updateTransformConfig({ sortColumn: v })
                          }
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Select column" />
                          </SelectTrigger>
                          <SelectContent>
                            {columnNames.map((col) => (
                              <SelectItem key={col} value={col}>
                                {col}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          value={transformConfig.sortDirection}
                          onValueChange={(v: "asc" | "desc") =>
                            updateTransformConfig({ sortDirection: v })
                          }
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="asc">Ascending</SelectItem>
                            <SelectItem value="desc">Descending</SelectItem>
                          </SelectContent>
                        </Select>
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Aggregate */}
                    <Collapsible>
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted/50 text-sm">
                        <div className="flex items-center gap-2">
                          <Calculator className="w-4 h-4 text-muted-foreground" />
                          <span>Aggregate</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={transformConfig.aggregateEnabled}
                            onCheckedChange={(checked) =>
                              updateTransformConfig({ aggregateEnabled: checked })
                            }
                            onClick={(e) => e.stopPropagation()}
                          />
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-6 pr-2 pt-2 space-y-2">
                        <Select
                          value={transformConfig.aggregateFunction}
                          onValueChange={(v) =>
                            updateTransformConfig({ aggregateFunction: v })
                          }
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sum">SUM</SelectItem>
                            <SelectItem value="avg">AVG</SelectItem>
                            <SelectItem value="count">COUNT</SelectItem>
                            <SelectItem value="min">MIN</SelectItem>
                            <SelectItem value="max">MAX</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                          value={transformConfig.aggregateColumn}
                          onValueChange={(v) =>
                            updateTransformConfig({ aggregateColumn: v })
                          }
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Select column" />
                          </SelectTrigger>
                          <SelectContent>
                            {columnNames.map((col) => (
                              <SelectItem key={col} value={col}>
                                {col}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Group By */}
                    <Collapsible>
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted/50 text-sm">
                        <div className="flex items-center gap-2">
                          <Sigma className="w-4 h-4 text-muted-foreground" />
                          <span>Group By</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={transformConfig.groupByEnabled}
                            onCheckedChange={(checked) =>
                              updateTransformConfig({ groupByEnabled: checked })
                            }
                            onClick={(e) => e.stopPropagation()}
                          />
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-6 pr-2 pt-2 space-y-2">
                        <Select
                          value={transformConfig.groupByColumn}
                          onValueChange={(v) =>
                            updateTransformConfig({ groupByColumn: v })
                          }
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Select column" />
                          </SelectTrigger>
                          <SelectContent>
                            {columnNames.map((col) => (
                              <SelectItem key={col} value={col}>
                                {col}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Limit */}
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Limit rows</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          className="h-7 w-20 text-xs"
                          value={transformConfig.limitValue}
                          onChange={(e) =>
                            updateTransformConfig({
                              limitValue: parseInt(e.target.value) || 100,
                            })
                          }
                        />
                        <Switch
                          checked={transformConfig.limitEnabled}
                          onCheckedChange={(checked) =>
                            updateTransformConfig({ limitEnabled: checked })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </aside>
            </div>
          ) : (
            <div className="flex h-[450px]">
              {/* Database/Table Tree */}
              <div className="flex-1 p-6 overflow-hidden flex flex-col">
                <p className="text-sm text-muted-foreground mb-4">
                  Browse databases and select columns from any table
                </p>
                <ScrollArea className="flex-1">
                  <div className="space-y-2 pr-4">
                    {DATABASES.map((db) => (
                      <Collapsible
                        key={db.id}
                        open={expandedDatabases.includes(db.id)}
                        onOpenChange={() => toggleDatabase(db.id)}
                      >
                        <CollapsibleTrigger className="w-full p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-all text-left flex items-center gap-3">
                          <ChevronRight
                            className={cn(
                              "w-4 h-4 text-muted-foreground transition-transform",
                              expandedDatabases.includes(db.id) && "rotate-90"
                            )}
                          />
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Database className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{db.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {db.tables.length} tables
                            </p>
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pl-8 pt-2 space-y-2">
                          {db.tables.map((table) => (
                            <Collapsible
                              key={table.id}
                              open={expandedTables.includes(table.id)}
                              onOpenChange={() => toggleTable(table.id)}
                            >
                              <CollapsibleTrigger className="w-full p-2.5 rounded-lg border border-border/60 hover:border-primary/30 hover:bg-accent/30 transition-all text-left flex items-center gap-3">
                                <ChevronRight
                                  className={cn(
                                    "w-3.5 h-3.5 text-muted-foreground transition-transform",
                                    expandedTables.includes(table.id) && "rotate-90"
                                  )}
                                />
                                <div className="w-6 h-6 rounded bg-chart-2/10 flex items-center justify-center">
                                  <Table className="w-3.5 h-3.5 text-chart-2" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{table.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {table.columns.length} columns
                                  </p>
                                </div>
                              </CollapsibleTrigger>
                              <CollapsibleContent className="pl-10 pt-2 space-y-1">
                                {table.columns.map((column) => (
                                  <label
                                    key={column.id}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 cursor-pointer transition-all"
                                  >
                                    <Checkbox
                                      checked={isColumnSelected(table.id, column.id)}
                                      onCheckedChange={() =>
                                        toggleColumn(db, table, column)
                                      }
                                    />
                                    <Columns3 className="w-3.5 h-3.5 text-muted-foreground" />
                                    <div className="flex-1">
                                      <p className="text-sm">{column.name}</p>
                                      <p className="text-xs text-muted-foreground capitalize">
                                        {column.type}
                                      </p>
                                    </div>
                                  </label>
                                ))}
                              </CollapsibleContent>
                            </Collapsible>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Selected Columns Panel */}
              <aside className="w-72 border-l border-border/60 bg-card/50 flex flex-col">
                <div className="h-12 px-4 border-b border-border/60 flex items-center gap-2 shrink-0">
                  <Check className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-medium text-foreground text-sm">
                    Selected ({selectedColumns.length})
                  </h3>
                </div>
                <ScrollArea className="flex-1 p-3">
                  {selectedColumns.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Select columns from the tree to include in your insight
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {Object.entries(groupedSelections).map(
                        ([dbName, tables]) => (
                          <div key={dbName}>
                            <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                              <Database className="w-3 h-3" />
                              {dbName}
                            </p>
                            {Object.entries(tables).map(([tableName, cols]) => (
                              <div key={tableName} className="ml-3 mb-2">
                                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
                                  <Table className="w-3 h-3" />
                                  {tableName}
                                </p>
                                <div className="ml-3 space-y-1">
                                  {cols.map((col) => (
                                    <div
                                      key={`${col.tableId}-${col.columnId}`}
                                      className="flex items-center justify-between p-1.5 rounded bg-muted/50 text-xs"
                                    >
                                      <span>{col.columnName}</span>
                                      <button
                                        onClick={() => {
                                          const db = DATABASES.find(
                                            (d) => d.id === col.databaseId
                                          );
                                          const table = db?.tables.find(
                                            (t) => t.id === col.tableId
                                          );
                                          const column = table?.columns.find(
                                            (c) => c.id === col.columnId
                                          );
                                          if (db && table && column) {
                                            toggleColumn(db, table, column);
                                          }
                                        }}
                                        className="text-muted-foreground hover:text-destructive"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </ScrollArea>
              </aside>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex items-center justify-between border-t mt-0 pt-4">
          <Button
            variant="ghost"
            onClick={step === "select-data" ? handleClose : handleBack}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {step === "select-data" ? "Cancel" : "Back"}
          </Button>

          {step === "select-data" && (
            <Button
              onClick={handleContinueToVisualize}
              disabled={selectedColumns.length === 0}
            >
              Continue
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}

          {step === "visualize" && (
            <Button onClick={handleSave} disabled={!insightTitle.trim()}>
              <Check className="w-4 h-4 mr-1" />
              Create Insight
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
