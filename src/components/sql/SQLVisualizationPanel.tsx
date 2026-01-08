import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart2,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Activity,
  TrendingUp,
  Circle,
  Radar,
  Filter,
  Gauge,
  Table2,
  Palette,
  Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ChartType, COLOR_SCHEMES } from "@/components/workflow/types";

interface SQLVisualizationPanelProps {
  chartType: ChartType | "table";
  onChartTypeChange: (type: ChartType | "table") => void;
  config: VisualizationConfig;
  onConfigChange: (config: VisualizationConfig) => void;
  columns?: string[];
}

export interface VisualizationConfig {
  xAxis?: string;
  yAxis?: string;
  colorScheme: string;
  showLegend: boolean;
  showGrid: boolean;
  showDataLabels: boolean;
  chartTitle?: string;
  innerRadius?: number;
  outerRadius?: number;
  barRadius?: number;
  lineStrokeWidth?: number;
  areaOpacity?: number;
}

const CHART_TYPES: { type: ChartType | "table"; icon: React.ElementType; label: string }[] = [
  { type: "bar", icon: BarChart2, label: "Bar" },
  { type: "line", icon: LineChartIcon, label: "Line" },
  { type: "area", icon: Activity, label: "Area" },
  { type: "pie", icon: PieChartIcon, label: "Pie" },
  { type: "donut", icon: Circle, label: "Donut" },
  { type: "scatter", icon: TrendingUp, label: "Scatter" },
  { type: "radar", icon: Radar, label: "Radar" },
  { type: "funnel", icon: Filter, label: "Funnel" },
  { type: "kpi", icon: TrendingUp, label: "KPI" },
  { type: "gauge", icon: Gauge, label: "Gauge" },
  { type: "table", icon: Table2, label: "Table" },
];

export const SQLVisualizationPanel = ({
  chartType,
  onChartTypeChange,
  config,
  onConfigChange,
  columns = [],
}: SQLVisualizationPanelProps) => {
  const updateConfig = (updates: Partial<VisualizationConfig>) => {
    onConfigChange({ ...config, ...updates });
  };

  const showAxisConfig = !["pie", "donut", "kpi", "gauge", "table", "radar", "funnel"].includes(
    chartType
  );
  const showPieConfig = ["pie", "donut"].includes(chartType);
  const showBarConfig = chartType === "bar";
  const showLineConfig = ["line", "area"].includes(chartType);

  return (
    <div className="flex flex-col h-full">
      {/* Chart Type Selection */}
      <div className="p-3 border-b border-border/60">
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Visualization</h3>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {CHART_TYPES.map((chart) => (
            <Button
              key={chart.type}
              variant={chartType === chart.type ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "h-auto py-2 flex flex-col gap-1",
                chartType === chart.type && "border border-primary/30"
              )}
              onClick={() => onChartTypeChange(chart.type)}
            >
              <chart.icon className="w-4 h-4" />
              <span className="text-[10px]">{chart.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Configuration Options */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Chart Title */}
        <div className="space-y-2">
          <Label className="text-xs">Chart Title</Label>
          <Input
            placeholder="Enter chart title..."
            value={config.chartTitle || ""}
            onChange={(e) => updateConfig({ chartTitle: e.target.value })}
            className="h-8 text-sm"
          />
        </div>

        {/* Axis Configuration */}
        {showAxisConfig && columns.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Settings2 className="w-3.5 h-3.5" />
              Data Mapping
            </div>
            <div className="space-y-2">
              <Label className="text-xs">X-Axis Column</Label>
              <Select
                value={config.xAxis}
                onValueChange={(value) => updateConfig({ xAxis: value })}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((col) => (
                    <SelectItem key={col} value={col}>
                      {col}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Y-Axis Column</Label>
              <Select
                value={config.yAxis}
                onValueChange={(value) => updateConfig({ yAxis: value })}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((col) => (
                    <SelectItem key={col} value={col}>
                      {col}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Color Scheme */}
        <div className="space-y-2">
          <Label className="text-xs">Color Scheme</Label>
          <Select
            value={config.colorScheme}
            onValueChange={(value) => updateConfig({ colorScheme: value })}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COLOR_SCHEMES.map((scheme) => (
                <SelectItem key={scheme.id} value={scheme.id}>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {scheme.colors.slice(0, 4).map((color, i) => (
                        <div
                          key={i}
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span>{scheme.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Display Options */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Settings2 className="w-3.5 h-3.5" />
            Display Options
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-xs cursor-pointer" htmlFor="show-legend">
              Show Legend
            </Label>
            <Switch
              id="show-legend"
              checked={config.showLegend}
              onCheckedChange={(checked) => updateConfig({ showLegend: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-xs cursor-pointer" htmlFor="show-grid">
              Show Grid
            </Label>
            <Switch
              id="show-grid"
              checked={config.showGrid}
              onCheckedChange={(checked) => updateConfig({ showGrid: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-xs cursor-pointer" htmlFor="show-labels">
              Show Data Labels
            </Label>
            <Switch
              id="show-labels"
              checked={config.showDataLabels}
              onCheckedChange={(checked) => updateConfig({ showDataLabels: checked })}
            />
          </div>
        </div>

        {/* Pie/Donut Specific */}
        {showPieConfig && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <PieChartIcon className="w-3.5 h-3.5" />
              Pie Settings
            </div>

            {chartType === "donut" && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <Label>Inner Radius</Label>
                  <span className="text-muted-foreground">{config.innerRadius || 50}%</span>
                </div>
                <Slider
                  value={[config.innerRadius || 50]}
                  onValueChange={([value]) => updateConfig({ innerRadius: value })}
                  min={20}
                  max={80}
                  step={5}
                />
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <Label>Outer Radius</Label>
                <span className="text-muted-foreground">{config.outerRadius || 90}%</span>
              </div>
              <Slider
                value={[config.outerRadius || 90]}
                onValueChange={([value]) => updateConfig({ outerRadius: value })}
                min={50}
                max={100}
                step={5}
              />
            </div>
          </div>
        )}

        {/* Bar Specific */}
        {showBarConfig && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <BarChart2 className="w-3.5 h-3.5" />
              Bar Settings
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <Label>Corner Radius</Label>
                <span className="text-muted-foreground">{config.barRadius || 4}px</span>
              </div>
              <Slider
                value={[config.barRadius || 4]}
                onValueChange={([value]) => updateConfig({ barRadius: value })}
                min={0}
                max={20}
                step={1}
              />
            </div>
          </div>
        )}

        {/* Line/Area Specific */}
        {showLineConfig && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <LineChartIcon className="w-3.5 h-3.5" />
              Line Settings
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <Label>Stroke Width</Label>
                <span className="text-muted-foreground">{config.lineStrokeWidth || 2}px</span>
              </div>
              <Slider
                value={[config.lineStrokeWidth || 2]}
                onValueChange={([value]) => updateConfig({ lineStrokeWidth: value })}
                min={1}
                max={6}
                step={1}
              />
            </div>

            {chartType === "area" && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <Label>Fill Opacity</Label>
                  <span className="text-muted-foreground">{Math.round((config.areaOpacity || 0.3) * 100)}%</span>
                </div>
                <Slider
                  value={[(config.areaOpacity || 0.3) * 100]}
                  onValueChange={([value]) => updateConfig({ areaOpacity: value / 100 })}
                  min={10}
                  max={80}
                  step={5}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
