import { useState } from "react";
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
import { WorkflowBlock, BlockConfig, COLOR_SCHEMES } from "./types";

interface BlockConfigPanelProps {
  block: WorkflowBlock;
  onUpdate: (instanceId: string, config: BlockConfig) => void;
  onClose: () => void;
}

const SAMPLE_DATABASES = ["Sales DB", "Marketing DB", "Finance DB", "HR DB"];
const SAMPLE_TABLES = ["orders", "customers", "products", "transactions", "users"];
const SAMPLE_COLUMNS = ["id", "name", "amount", "date", "category", "region", "revenue", "quantity"];

export const BlockConfigPanel = ({ block, onUpdate, onClose }: BlockConfigPanelProps) => {
  const [config, setConfig] = useState<BlockConfig>(block.config || {});

  const handleChange = (key: keyof BlockConfig, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onUpdate(block.instanceId, newConfig);
  };

  const renderDataConfig = () => {
    switch (block.type) {
      case "database":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Database</Label>
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
          </div>
        );
      
      case "table":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Table</Label>
              <Select
                value={config.table}
                onValueChange={(v) => handleChange("table", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose table..." />
                </SelectTrigger>
                <SelectContent>
                  {SAMPLE_TABLES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "column":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Columns</Label>
              <div className="grid grid-cols-2 gap-2">
                {SAMPLE_COLUMNS.map((col) => (
                  <label key={col} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.columns?.includes(col) || false}
                      onChange={(e) => {
                        const current = config.columns || [];
                        const newCols = e.target.checked
                          ? [...current, col]
                          : current.filter((c) => c !== col);
                        handleChange("columns", newCols);
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

      default:
        return null;
    }
  };

  const renderTransformConfig = () => {
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
                  {SAMPLE_COLUMNS.map((c) => (
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
                {SAMPLE_COLUMNS.map((col) => (
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
                  {SAMPLE_COLUMNS.map((c) => (
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
                  {SAMPLE_COLUMNS.map((c) => (
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
              <Label>Join Table</Label>
              <Select
                value={config.joinTable}
                onValueChange={(v) => handleChange("joinTable", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select table..." />
                </SelectTrigger>
                <SelectContent>
                  {SAMPLE_TABLES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
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
                  {SAMPLE_COLUMNS.map((c) => (
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
                  {SAMPLE_COLUMNS.map((c) => (
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
                  {SAMPLE_COLUMNS.map((c) => (
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
                  {SAMPLE_COLUMNS.map((c) => (
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
                  {SAMPLE_COLUMNS.map((c) => (
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
                  {SAMPLE_COLUMNS.map((c) => (
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
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Chart Type</Label>
          <Select
            value={config.chartType || block.type.replace("-chart", "")}
            onValueChange={(v) => handleChange("chartType", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="line">Line Chart</SelectItem>
              <SelectItem value="area">Area Chart</SelectItem>
              <SelectItem value="pie">Pie Chart</SelectItem>
              <SelectItem value="donut">Donut Chart</SelectItem>
              <SelectItem value="scatter">Scatter Plot</SelectItem>
              <SelectItem value="radar">Radar Chart</SelectItem>
              <SelectItem value="funnel">Funnel Chart</SelectItem>
              <SelectItem value="kpi">KPI Card</SelectItem>
              <SelectItem value="gauge">Gauge Chart</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>X-Axis Column</Label>
          <Select
            value={config.xAxis}
            onValueChange={(v) => handleChange("xAxis", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select column..." />
            </SelectTrigger>
            <SelectContent>
              {SAMPLE_COLUMNS.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Y-Axis Column</Label>
          <Select
            value={config.yAxis}
            onValueChange={(v) => handleChange("yAxis", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select column..." />
            </SelectTrigger>
            <SelectContent>
              {SAMPLE_COLUMNS.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
              {Object.keys(COLOR_SCHEMES).map((scheme) => (
                <SelectItem key={scheme} value={scheme}>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {COLOR_SCHEMES[scheme as keyof typeof COLOR_SCHEMES].slice(0, 4).map((color, i) => (
                        <div
                          key={i}
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className="capitalize">{scheme}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Chart Title</Label>
          <Input
            value={config.chartTitle || ""}
            onChange={(e) => handleChange("chartTitle", e.target.value)}
            placeholder="Enter title..."
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <Label>Show Legend</Label>
          <Switch
            checked={config.showLegend ?? true}
            onCheckedChange={(v) => handleChange("showLegend", v)}
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <Label>Show Grid</Label>
          <Switch
            checked={config.showGrid ?? true}
            onCheckedChange={(v) => handleChange("showGrid", v)}
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <Label>Show Data Labels</Label>
          <Switch
            checked={config.showDataLabels ?? false}
            onCheckedChange={(v) => handleChange("showDataLabels", v)}
          />
        </div>

        {(config.chartType === "bar" || block.type === "bar-chart") && (
          <div className="space-y-2">
            <Label>Bar Radius: {config.barRadius ?? 4}px</Label>
            <Slider
              value={[config.barRadius ?? 4]}
              onValueChange={(v) => handleChange("barRadius", v[0])}
              min={0}
              max={20}
              step={1}
            />
          </div>
        )}

        {(config.chartType === "line" || config.chartType === "area" || block.type === "line-chart") && (
          <div className="space-y-2">
            <Label>Line Width: {config.lineStrokeWidth ?? 2}px</Label>
            <Slider
              value={[config.lineStrokeWidth ?? 2]}
              onValueChange={(v) => handleChange("lineStrokeWidth", v[0])}
              min={1}
              max={6}
              step={0.5}
            />
          </div>
        )}

        {config.chartType === "area" && (
          <div className="space-y-2">
            <Label>Area Opacity: {((config.areaOpacity ?? 0.3) * 100).toFixed(0)}%</Label>
            <Slider
              value={[config.areaOpacity ?? 0.3]}
              onValueChange={(v) => handleChange("areaOpacity", v[0])}
              min={0.1}
              max={1}
              step={0.1}
            />
          </div>
        )}

        {(config.chartType === "pie" || config.chartType === "donut" || block.type === "pie-chart") && (
          <>
            <div className="space-y-2">
              <Label>Inner Radius: {config.innerRadius ?? (config.chartType === "donut" ? 50 : 0)}</Label>
              <Slider
                value={[config.innerRadius ?? (config.chartType === "donut" ? 50 : 0)]}
                onValueChange={(v) => handleChange("innerRadius", v[0])}
                min={0}
                max={80}
                step={5}
              />
            </div>
            <div className="space-y-2">
              <Label>Outer Radius: {config.outerRadius ?? 90}</Label>
              <Slider
                value={[config.outerRadius ?? 90]}
                onValueChange={(v) => handleChange("outerRadius", v[0])}
                min={50}
                max={120}
                step={5}
              />
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="w-80 border-l border-border/60 bg-card/50 flex flex-col animate-slide-in-right">
      <div className="p-4 border-b border-border/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-medium text-foreground">Configure {block.label}</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        {block.category === "data" && renderDataConfig()}
        {block.category === "transform" && renderTransformConfig()}
        {block.category === "visualize" && renderVisualizeConfig()}
      </ScrollArea>
    </div>
  );
};
