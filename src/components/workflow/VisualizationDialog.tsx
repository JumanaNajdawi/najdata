import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Database,
  FileOutput,
  CheckCircle2,
  Table2,
  Info,
  ArrowRight,
  Palette,
  Eye,
  Settings2,
  RotateCcw,
  Download,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ChartPreview } from "@/components/workflow/ChartPreview";
import { SQLVisualizationPanel, VisualizationConfig } from "@/components/sql/SQLVisualizationPanel";
import { WorkflowBlock, ChartType } from "@/components/workflow/types";

export type DataSourceType = "source" | "results";

interface VisualizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (config: {
    chartType: ChartType | "table";
    vizConfig: VisualizationConfig;
    dataSource: DataSourceType;
  }) => void;
  sourceData: any[];
  resultsData: any[];
  sourceColumns: string[];
  resultsColumns: string[];
}

type DialogStep = "select" | "configure";

export const VisualizationDialog = ({
  open,
  onOpenChange,
  onSave,
  sourceData,
  resultsData,
  sourceColumns,
  resultsColumns,
}: VisualizationDialogProps) => {
  const [step, setStep] = useState<DialogStep>("select");
  const [selectedSource, setSelectedSource] = useState<DataSourceType | null>(null);
  const [chartType, setChartType] = useState<ChartType | "table">("bar");
  const [vizConfig, setVizConfig] = useState<VisualizationConfig>({
    colorScheme: "default",
    showLegend: true,
    showGrid: true,
    showDataLabels: false,
  });
  const [activeTab, setActiveTab] = useState<"preview" | "settings">("preview");

  const data = selectedSource === "source" ? sourceData : resultsData;
  const columns = selectedSource === "source" ? sourceColumns : resultsColumns;

  const options = [
    {
      type: "source" as DataSourceType,
      title: "Source Data",
      description: "Original dataset from your database",
      icon: Database,
      rowCount: sourceData.length,
      columns: sourceColumns,
    },
    {
      type: "results" as DataSourceType,
      title: "Results Data",
      description: "Transformed data from your workflow",
      icon: FileOutput,
      rowCount: resultsData.length,
      columns: resultsColumns,
      recommended: true,
    },
  ];

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
      },
    },
  ];

  const handleSourceSelect = (source: DataSourceType) => {
    setSelectedSource(source);
  };

  const handleContinue = () => {
    if (selectedSource) {
      setStep("configure");
    }
  };

  const handleBack = () => {
    setStep("select");
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
    if (selectedSource) {
      onSave({
        chartType,
        vizConfig,
        dataSource: selectedSource,
      });
      onOpenChange(false);
      // Reset state
      setStep("select");
      setSelectedSource(null);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setStep("select");
    setSelectedSource(null);
  };

  const renderTable = () => (
    <div className="overflow-auto max-h-[300px] rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30 sticky top-0">
            {columns.map((col) => (
              <th key={col} className="px-4 py-2 text-left font-medium text-muted-foreground">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.slice(0, 5).map((row, i) => (
            <tr key={i} className="border-b border-border/50 last:border-0">
              {columns.map((col) => (
                <td key={col} className="px-4 py-2 text-foreground">
                  {typeof row[col] === "number" ? row[col].toLocaleString() : row[col] || row.name || row.value}
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
      <div className="h-[300px]">
        <ChartPreview workflow={mockWorkflow} data={data} />
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={cn(
        "max-w-4xl p-0 gap-0 overflow-hidden",
        step === "configure" && "max-w-5xl"
      )}>
        {step === "select" ? (
          <>
            <DialogHeader className="p-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Table2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <DialogTitle>Select Data Source</DialogTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Choose which dataset to visualize
                  </p>
                </div>
              </div>
            </DialogHeader>

            <div className="px-6 pb-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {options.map((option) => (
                  <Card
                    key={option.type}
                    className={cn(
                      "relative p-4 cursor-pointer transition-all duration-200 hover:shadow-md",
                      selectedSource === option.type
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => handleSourceSelect(option.type)}
                  >
                    {option.recommended && (
                      <Badge
                        variant="secondary"
                        className="absolute -top-2.5 left-3 text-[10px] bg-secondary text-secondary-foreground"
                      >
                        Recommended
                      </Badge>
                    )}

                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                          selectedSource === option.type
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        <option.icon className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-foreground text-sm">
                            {option.title}
                          </h3>
                          {selectedSource === option.type && (
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {option.description}
                        </p>

                        <div className="flex items-center gap-2 text-xs">
                          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-muted/50 rounded">
                            <Table2 className="w-3 h-3 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {option.rowCount?.toLocaleString()} rows
                            </span>
                          </div>
                          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-muted/50 rounded">
                            <Info className="w-3 h-3 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {option.columns?.length} cols
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <Button disabled={!selectedSource} onClick={handleContinue}>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex h-[500px]">
              {/* Preview Area */}
              <div className="flex-1 flex flex-col">
                <div className="h-14 px-4 border-b border-border/60 flex items-center justify-between bg-card/50">
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" onClick={handleBack}>
                      ← Back
                    </Button>
                    <div className="h-5 w-px bg-border" />
                    <Badge variant="outline" className="text-xs">
                      {selectedSource === "source" ? "Source Data" : "Results Data"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {data.length} rows · {columns.length} columns
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={handleReset}>
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Reset
                    </Button>
                  </div>
                </div>

                <div className="flex-1 p-4 overflow-auto">
                  <Card className="h-full p-4">
                    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "preview" | "settings")}>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-foreground text-sm">
                          {vizConfig.chartTitle || "Chart Preview"}
                        </h3>
                        <TabsList className="h-7">
                          <TabsTrigger value="preview" className="text-xs h-6 px-2">
                            <Eye className="w-3 h-3 mr-1" />
                            Preview
                          </TabsTrigger>
                          <TabsTrigger value="settings" className="text-xs h-6 px-2 lg:hidden">
                            <Settings2 className="w-3 h-3 mr-1" />
                            Settings
                          </TabsTrigger>
                        </TabsList>
                      </div>

                      <TabsContent value="preview" className="mt-0">
                        {renderVisualization()}
                      </TabsContent>

                      <TabsContent value="settings" className="mt-0 lg:hidden">
                        <SQLVisualizationPanel
                          chartType={chartType}
                          onChartTypeChange={setChartType}
                          config={vizConfig}
                          onConfigChange={setVizConfig}
                          columns={columns}
                        />
                      </TabsContent>
                    </Tabs>
                  </Card>
                </div>
              </div>

              {/* Settings Panel */}
              <aside className="hidden lg:flex w-72 border-l border-border/60 bg-card/50 flex-col">
                <div className="h-14 px-4 border-b border-border/60 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-medium text-foreground text-sm">Options</h3>
                </div>
                <div className="flex-1 overflow-auto">
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

            {/* Footer */}
            <div className="h-14 px-4 border-t border-border/60 flex items-center justify-end gap-2 bg-card/50">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Apply Visualization
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};