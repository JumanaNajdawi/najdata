import { useState, useEffect } from "react";
import { X, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { WorkflowBlock, BlockConfig, COLOR_SCHEMES } from "./types";

interface BlockConfigPanelProps {
  block: WorkflowBlock;
  onUpdate: (instanceId: string, config: BlockConfig) => void;
  onClose: () => void;
}

// Mock data - in real app this would come from API
const SAMPLE_DATABASES = ["Sales DB", "Marketing DB", "Finance DB", "HR DB"];

const DATABASE_TABLES: Record<string, string[]> = {
  "Sales DB": ["orders", "customers", "products", "transactions"],
  "Marketing DB": ["campaigns", "leads", "conversions", "channels"],
  "Finance DB": ["invoices", "payments", "accounts", "budgets"],
  "HR DB": ["employees", "departments", "salaries", "attendance"],
};

const TABLE_COLUMNS: Record<string, string[]> = {
  orders: ["id", "customer_id", "amount", "status", "created_at", "region"],
  customers: ["id", "name", "email", "phone", "address", "segment"],
  products: ["id", "name", "price", "category", "stock", "sku"],
  transactions: ["id", "order_id", "amount", "type", "date", "method"],
  campaigns: ["id", "name", "budget", "start_date", "end_date", "status"],
  leads: ["id", "name", "email", "source", "score", "created_at"],
  conversions: ["id", "lead_id", "campaign_id", "value", "date"],
  channels: ["id", "name", "type", "cost", "impressions", "clicks"],
  invoices: ["id", "customer_id", "amount", "due_date", "status", "paid_at"],
  payments: ["id", "invoice_id", "amount", "method", "date", "reference"],
  accounts: ["id", "name", "type", "balance", "currency", "created_at"],
  budgets: ["id", "department", "year", "amount", "spent", "remaining"],
  employees: ["id", "name", "email", "department", "position", "hire_date"],
  departments: ["id", "name", "manager_id", "budget", "headcount"],
  salaries: ["id", "employee_id", "amount", "currency", "effective_date"],
  attendance: ["id", "employee_id", "date", "check_in", "check_out", "hours"],
};

export const BlockConfigPanel = ({ block, onUpdate, onClose }: BlockConfigPanelProps) => {
  const [config, setConfig] = useState<BlockConfig>(block.config || {});

  // Reset dependent fields when parent changes
  useEffect(() => {
    setConfig(block.config || {});
  }, [block.instanceId]);

  const handleChange = (key: keyof BlockConfig, value: any) => {
    const newConfig = { ...config, [key]: value };
    
    // Clear dependent fields when parent changes
    if (key === "database") {
      newConfig.table = undefined;
      newConfig.columns = undefined;
    }
    if (key === "table") {
      newConfig.columns = undefined;
    }
    
    setConfig(newConfig);
    onUpdate(block.instanceId, newConfig);
  };

  const getTablesForDatabase = () => {
    return config.database ? DATABASE_TABLES[config.database] || [] : [];
  };

  const getColumnsForTable = () => {
    return config.table ? TABLE_COLUMNS[config.table] || [] : [];
  };

  const handleColumnToggle = (column: string, checked: boolean) => {
    const currentColumns = config.columns || [];
    const newColumns = checked
      ? [...currentColumns, column]
      : currentColumns.filter((c) => c !== column);
    handleChange("columns", newColumns);
  };

  const handleSelectAllColumns = () => {
    const allColumns = getColumnsForTable();
    handleChange("columns", allColumns);
  };

  const handleClearColumns = () => {
    handleChange("columns", []);
  };

  const renderDatabaseConfig = () => {
    const tables = getTablesForDatabase();
    const columns = getColumnsForTable();
    const selectedColumns = config.columns || [];

    return (
      <div className="space-y-5">
        {/* Database Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">1. Select Database</Label>
          <Select
            value={config.database}
            onValueChange={(v) => handleChange("database", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose database..." />
            </SelectTrigger>
            <SelectContent>
              {SAMPLE_DATABASES.map((db) => (
                <SelectItem key={db} value={db}>{db}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table Selection - only show if database is selected */}
        {config.database && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">2. Select Table</Label>
            <Select
              value={config.table}
              onValueChange={(v) => handleChange("table", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose table..." />
              </SelectTrigger>
              <SelectContent>
                {tables.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Columns Multi-select - only show if table is selected */}
        {config.table && columns.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">3. Select Columns</Label>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={handleSelectAllColumns}
                >
                  All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={handleClearColumns}
                >
                  Clear
                </Button>
              </div>
            </div>
            <div className="border rounded-lg p-3 space-y-2 max-h-[200px] overflow-y-auto">
              {columns.map((col) => (
                <div key={col} className="flex items-center space-x-2">
                  <Checkbox
                    id={`col-${col}`}
                    checked={selectedColumns.includes(col)}
                    onCheckedChange={(checked) => handleColumnToggle(col, checked as boolean)}
                  />
                  <label
                    htmlFor={`col-${col}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {col}
                  </label>
                </div>
              ))}
            </div>
            {selectedColumns.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {selectedColumns.length} column{selectedColumns.length !== 1 ? "s" : ""} selected
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderTransformConfig = () => {
    const availableColumns = config.columns || getColumnsForTable() || [];
    
    switch (block.type) {
      case "filter":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Filter Column</Label>
              <Select
                value={config.filterColumn}
                onValueChange={(v) => handleChange("filterColumn", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select column..." />
                </SelectTrigger>
                <SelectContent>
                  {availableColumns.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Operator</Label>
              <Select
                value={config.filterOperator}
                onValueChange={(v) => handleChange("filterOperator", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select operator..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">Equals</SelectItem>
                  <SelectItem value="contains">Contains</SelectItem>
                  <SelectItem value="greater">Greater than</SelectItem>
                  <SelectItem value="less">Less than</SelectItem>
                  <SelectItem value="between">Between</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Value</Label>
              <Input
                value={config.filterValue || ""}
                onChange={(e) => handleChange("filterValue", e.target.value)}
                placeholder="Enter value..."
              />
            </div>
            {config.filterOperator === "between" && (
              <div className="space-y-2">
                <Label>End Value</Label>
                <Input
                  value={config.filterValue2 || ""}
                  onChange={(e) => handleChange("filterValue2", e.target.value)}
                  placeholder="Enter end value..."
                />
              </div>
            )}
          </div>
        );

      case "group":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Group By Columns</Label>
              <div className="grid grid-cols-2 gap-2">
                {availableColumns.map((col) => (
                  <label key={col} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.groupByColumns?.includes(col) || false}
                      onChange={(e) => {
                        const current = config.groupByColumns || [];
                        const newCols = e.target.checked
                          ? [...current, col]
                          : current.filter((c) => c !== col);
                        handleChange("groupByColumns", newCols);
                      }}
                      className="rounded border-border"
                    />
                    {col}
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case "sort":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Sort Column</Label>
              <Select
                value={config.sortColumn}
                onValueChange={(v) => handleChange("sortColumn", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select column..." />
                </SelectTrigger>
                <SelectContent>
                  {availableColumns.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Direction</Label>
              <Select
                value={config.sortDirection || "asc"}
                onValueChange={(v) => handleChange("sortDirection", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "calculate":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Aggregate Function</Label>
              <Select
                value={config.aggregateFunction}
                onValueChange={(v) => handleChange("aggregateFunction", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select function..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUM">SUM</SelectItem>
                  <SelectItem value="AVG">AVG</SelectItem>
                  <SelectItem value="COUNT">COUNT</SelectItem>
                  <SelectItem value="MIN">MIN</SelectItem>
                  <SelectItem value="MAX">MAX</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Column</Label>
              <Select
                value={config.aggregateColumn}
                onValueChange={(v) => handleChange("aggregateColumn", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select column..." />
                </SelectTrigger>
                <SelectContent>
                  {availableColumns.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "limit":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Number of Rows: {config.limitRows || 100}</Label>
              <Slider
                value={[config.limitRows || 100]}
                onValueChange={(v) => handleChange("limitRows", v[0])}
                min={1}
                max={1000}
                step={1}
              />
            </div>
          </div>
        );

      case "join":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Join Type</Label>
              <Select
                value={config.joinType || "inner"}
                onValueChange={(v) => handleChange("joinType", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inner">Inner Join</SelectItem>
                  <SelectItem value="left">Left Join</SelectItem>
                  <SelectItem value="right">Right Join</SelectItem>
                  <SelectItem value="full">Full Outer Join</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Left Column</Label>
              <Select
                value={config.joinOnLeft}
                onValueChange={(v) => handleChange("joinOnLeft", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select column..." />
                </SelectTrigger>
                <SelectContent>
                  {availableColumns.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Right Column</Label>
              <Select
                value={config.joinOnRight}
                onValueChange={(v) => handleChange("joinOnRight", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select column..." />
                </SelectTrigger>
                <SelectContent>
                  {availableColumns.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "pivot":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Row Column</Label>
              <Select
                value={config.pivotRowColumn}
                onValueChange={(v) => handleChange("pivotRowColumn", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select column..." />
                </SelectTrigger>
                <SelectContent>
                  {availableColumns.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Pivot Column</Label>
              <Select
                value={config.pivotColumnColumn}
                onValueChange={(v) => handleChange("pivotColumnColumn", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select column..." />
                </SelectTrigger>
                <SelectContent>
                  {availableColumns.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Value Column</Label>
              <Select
                value={config.pivotValueColumn}
                onValueChange={(v) => handleChange("pivotValueColumn", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select column..." />
                </SelectTrigger>
                <SelectContent>
                  {availableColumns.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "formula":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Formula Expression</Label>
              <Input
                value={config.formulaExpression || ""}
                onChange={(e) => handleChange("formulaExpression", e.target.value)}
                placeholder="e.g., revenue * 0.1"
              />
              <p className="text-xs text-muted-foreground">
                Use column names and operators (+, -, *, /)
              </p>
            </div>
            <div className="space-y-2">
              <Label>Result Column Name</Label>
              <Input
                value={config.formulaResultColumn || ""}
                onChange={(e) => handleChange("formulaResultColumn", e.target.value)}
                placeholder="e.g., tax_amount"
              />
            </div>
          </div>
        );

      case "date":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Date Column</Label>
              <Select
                value={config.dateColumn}
                onValueChange={(v) => handleChange("dateColumn", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select column..." />
                </SelectTrigger>
                <SelectContent>
                  {availableColumns.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Operation</Label>
              <Select
                value={config.dateOperation}
                onValueChange={(v) => handleChange("dateOperation", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select operation..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="extract_year">Extract Year</SelectItem>
                  <SelectItem value="extract_month">Extract Month</SelectItem>
                  <SelectItem value="extract_day">Extract Day</SelectItem>
                  <SelectItem value="date_diff">Date Difference</SelectItem>
                  <SelectItem value="date_add">Date Add</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderVisualizeConfig = () => {
    switch (block.type) {
      case "chart":
      case "bar-chart":
      case "line-chart":
      case "pie-chart":
      case "area-chart":
      case "scatter-chart":
      case "radar-chart":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Chart Type</Label>
              <Select
                value={config.chartType || "bar"}
                onValueChange={(v) => handleChange("chartType", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                  <SelectItem value="area">Area Chart</SelectItem>
                  <SelectItem value="scatter">Scatter Chart</SelectItem>
                  <SelectItem value="radar">Radar Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Chart Title</Label>
              <Input
                value={config.chartTitle || ""}
                onChange={(e) => handleChange("chartTitle", e.target.value)}
                placeholder="Enter chart title..."
              />
            </div>

            <div className="space-y-2">
              <Label>Color Scheme</Label>
              <Select
                value={config.colorScheme || "default"}
                onValueChange={(v) => handleChange("colorScheme", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COLOR_SCHEMES.map((scheme) => (
                    <SelectItem key={scheme.id} value={scheme.id}>
                      {scheme.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Show Legend</Label>
                <Switch
                  checked={config.showLegend ?? true}
                  onCheckedChange={(v) => handleChange("showLegend", v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Show Grid</Label>
                <Switch
                  checked={config.showGrid ?? true}
                  onCheckedChange={(v) => handleChange("showGrid", v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Show Data Labels</Label>
                <Switch
                  checked={config.showDataLabels ?? false}
                  onCheckedChange={(v) => handleChange("showDataLabels", v)}
                />
              </div>
            </div>
          </div>
        );

      case "kpi":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>KPI Title</Label>
              <Input
                value={config.kpiTitle || ""}
                onChange={(e) => handleChange("kpiTitle", e.target.value)}
                placeholder="e.g., Total Revenue"
              />
            </div>
            <div className="space-y-2">
              <Label>KPI Column</Label>
              <Select
                value={config.kpiColumn}
                onValueChange={(v) => handleChange("kpiColumn", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select column..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">revenue</SelectItem>
                  <SelectItem value="amount">amount</SelectItem>
                  <SelectItem value="quantity">quantity</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label>Show Comparison</Label>
              <Switch
                checked={config.showComparison ?? false}
                onCheckedChange={(v) => handleChange("showComparison", v)}
              />
            </div>
          </div>
        );

      case "table_viz":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Rows per Page</Label>
              <Slider
                value={[config.rowsPerPage || 10]}
                onValueChange={(v) => handleChange("rowsPerPage", v[0])}
                min={5}
                max={50}
                step={5}
              />
              <span className="text-xs text-muted-foreground">
                {config.rowsPerPage || 10} rows
              </span>
            </div>
            <div className="flex items-center justify-between">
              <Label>Show Pagination</Label>
              <Switch
                checked={config.showPagination ?? true}
                onCheckedChange={(v) => handleChange("showPagination", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Enable Sorting</Label>
              <Switch
                checked={config.enableSorting ?? true}
                onCheckedChange={(v) => handleChange("enableSorting", v)}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderConfig = () => {
    if (block.type === "database") {
      return renderDatabaseConfig();
    }
    if (block.category === "transform") {
      return renderTransformConfig();
    }
    if (block.category === "visualize") {
      return renderVisualizeConfig();
    }
    return null;
  };

  return (
    <aside className="w-80 border-l border-border/60 bg-card/50 flex flex-col shrink-0">
      <div className="h-14 px-4 border-b border-border/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-medium text-foreground text-sm">Configure Block</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="text-xs text-muted-foreground mb-1">Block Type</div>
            <div className="font-medium text-foreground">{block.label}</div>
          </div>
          {renderConfig()}
        </div>
      </ScrollArea>
    </aside>
  );
};
