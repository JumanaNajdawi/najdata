import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Palette,
  Settings2,
  Eye,
  Download,
  Maximize2,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ChartPreview } from "@/components/workflow/ChartPreview";
import { SQLVisualizationPanel, VisualizationConfig } from "@/components/sql/SQLVisualizationPanel";
import { WorkflowBlock, ChartType } from "@/components/workflow/types";
import { DataSourceType } from "./DataSourceSelector";

interface VisualizationStepProps {
  dataSource: DataSourceType;
  data: any[];
  columns: string[];
  onBack: () => void;
  onSave: (config: {
    chartType: ChartType | "table";
    vizConfig: VisualizationConfig;
    dataSource: DataSourceType;
  }) => void;
}

export const VisualizationStep = ({
  dataSource,
  data,
  columns,
  onBack,
  onSave,
}: VisualizationStepProps) => {
  const [chartType, setChartType] = useState<ChartType | "table">("bar");
  const [vizConfig, setVizConfig] = useState<VisualizationConfig>({
    colorScheme: "default",
    showLegend: true,
    showGrid: true,
    showDataLabels: false,
  });
  const [activeTab, setActiveTab] = useState<"preview" | "settings">("preview");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Create mock workflow for ChartPreview
  const mockWorkflow: WorkflowBlock[] = [
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
        chartTitle: vizConfig.chartTitle,
        innerRadius: vizConfig.innerRadius,
        outerRadius: vizConfig.outerRadius,
        barRadius: vizConfig.barRadius,
        lineStrokeWidth: vizConfig.lineStrokeWidth,
        areaOpacity: vizConfig.areaOpacity,
      },
    },
  ];

  const renderTable = () => (
    <div className="overflow-auto max-h-[400px]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30 sticky top-0">
            {columns.map((col) => (
              <th
                key={col}
                className="px-4 py-2 text-left font-medium text-muted-foreground"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b border-border/50 last:border-0">
              {columns.map((col) => (
                <td key={col} className="px-4 py-2 text-foreground">
                  {typeof row[col] === "number"
                    ? row[col].toLocaleString()
                    : row[col] || row.name || row.value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderVisualization = () => {
    if (chartType === "table") {
      return renderTable();
    }
    return (
      <div className="h-[400px]">
        <ChartPreview workflow={mockWorkflow} data={data} />
      </div>
    );
  };

  const handleReset = () => {
    setChartType("bar");
    setVizConfig({
      colorScheme: "default",
      showLegend: true,
      showGrid: true,
      showDataLabels: false,
    });
  };

  const handleSave = () => {
    onSave({
      chartType,
      vizConfig,
      dataSource,
    });
  };

  return (
    <div className={cn(
      "flex h-full",
      isFullscreen && "fixed inset-0 z-50 bg-background"
    )}>
      {/* Main Preview Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-14 px-4 border-b border-border/60 flex items-center justify-between bg-card/50 shrink-0">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="h-5 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {dataSource === "source" ? "Source Data" : "Results Data"}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {data.length} rows · {columns.length} columns
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button variant="ghost" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
            <Button size="sm" onClick={handleSave}>
              Apply Visualization
            </Button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 p-6 overflow-auto bg-gradient-surface">
          <Card className="h-full p-6 bg-card">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "preview" | "settings")}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">
                  {vizConfig.chartTitle || "Chart Preview"}
                </h3>
                <TabsList className="h-8">
                  <TabsTrigger value="preview" className="text-xs h-7 px-3">
                    <Eye className="w-3 h-3 mr-1.5" />
                    Preview
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="text-xs h-7 px-3 lg:hidden">
                    <Settings2 className="w-3 h-3 mr-1.5" />
                    Settings
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="preview" className="mt-0">
                {renderVisualization()}
              </TabsContent>

              <TabsContent value="settings" className="mt-0 lg:hidden">
                <div className="max-w-md mx-auto">
                  <SQLVisualizationPanel
                    chartType={chartType}
                    onChartTypeChange={setChartType}
                    config={vizConfig}
                    onConfigChange={setVizConfig}
                    columns={columns}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>

      {/* Right Panel - Visualization Options (Desktop) */}
      <aside className="hidden lg:flex w-80 border-l border-border/60 bg-card/50 flex-col shrink-0">
        <div className="h-14 px-4 border-b border-border/60 flex items-center gap-2 shrink-0">
          <Palette className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Visualization Options</h3>
        </div>
        <div className="flex-1 overflow-hidden">
          <SQLVisualizationPanel
            chartType={chartType}
            onChartTypeChange={setChartType}
            config={vizConfig}
            onConfigChange={setVizConfig}
            columns={columns}
          />
        </div>
      </aside>
    </div>
  );
};
