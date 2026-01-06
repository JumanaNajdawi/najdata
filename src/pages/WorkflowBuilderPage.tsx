import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Save,
  Play,
  Database,
  Table2,
  Columns,
  Filter,
  Group,
  ArrowDownUp,
  Calculator,
  Hash,
  BarChart2,
  LineChart,
  PieChart,
  Merge,
  FlipVertical2,
  FunctionSquare,
  Calendar,
  AreaChart,
  ScatterChart,
  Radar,
  Target,
  Activity,
  TrendingUp,
  Palette,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Block, WorkflowBlock, BlockConfig, ChartType } from "@/components/workflow/types";
import { BlockPalette } from "@/components/workflow/BlockPalette";
import { WorkflowCanvas } from "@/components/workflow/WorkflowCanvas";
import { BlockConfigPanel } from "@/components/workflow/BlockConfigPanel";
import { PreviewPanel } from "@/components/workflow/PreviewPanel";
import { DataSourceSelector, DataSourceType } from "@/components/visualization/DataSourceSelector";
import { VisualizationStep } from "@/components/visualization/VisualizationStep";
import { VisualizationConfig } from "@/components/sql/SQLVisualizationPanel";

type BuilderStep = "build" | "select-data" | "visualize";

const AVAILABLE_BLOCKS: Block[] = [
  // Data blocks
  { id: "database", type: "database", label: "Database", icon: "Database", category: "data", description: "Select a database connection" },
  { id: "table", type: "table", label: "Table", icon: "Table2", category: "data", description: "Choose a table from the database" },
  { id: "column", type: "column", label: "Columns", icon: "Columns", category: "data", description: "Select specific columns" },
  // Transform blocks
  { id: "filter", type: "filter", label: "Filter", icon: "Filter", category: "transform", description: "Filter rows based on conditions" },
  { id: "group", type: "group", label: "Group By", icon: "Group", category: "transform", description: "Group data by columns" },
  { id: "sort", type: "sort", label: "Sort", icon: "ArrowDownUp", category: "transform", description: "Sort data by column" },
  { id: "calculate", type: "calculate", label: "Aggregate", icon: "Calculator", category: "transform", description: "Apply aggregate functions" },
  { id: "limit", type: "limit", label: "Limit", icon: "Hash", category: "transform", description: "Limit number of rows" },
  { id: "join", type: "join", label: "Join", icon: "Merge", category: "transform", description: "Join with another table" },
  { id: "pivot", type: "pivot", label: "Pivot", icon: "FlipVertical2", category: "transform", description: "Pivot table transformation" },
  { id: "formula", type: "formula", label: "Formula", icon: "FunctionSquare", category: "transform", description: "Create calculated columns" },
  { id: "date", type: "date", label: "Date Ops", icon: "Calendar", category: "transform", description: "Date transformations" },
];

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Database,
  Table2,
  Columns,
  Filter,
  Group,
  ArrowDownUp,
  Calculator,
  Hash,
  BarChart2,
  LineChart,
  PieChart,
  Merge,
  FlipVertical2,
  FunctionSquare,
  Calendar,
  AreaChart,
  ScatterChart,
  Radar,
  Target,
  Activity,
  TrendingUp,
};

const categoryColors = {
  data: "bg-chart-1/10 text-chart-1 border-chart-1/30",
  transform: "bg-chart-4/10 text-chart-4 border-chart-4/30",
  visualize: "bg-secondary/10 text-secondary border-secondary/30",
};

const SAMPLE_SOURCE_DATA = [
  { id: 1, user_id: 101, amount: 1500, status: "completed", created_at: "2024-01-15" },
  { id: 2, user_id: 102, amount: 2300, status: "completed", created_at: "2024-01-20" },
  { id: 3, user_id: 103, amount: 800, status: "pending", created_at: "2024-02-05" },
  { id: 4, user_id: 101, amount: 1200, status: "completed", created_at: "2024-02-15" },
  { id: 5, user_id: 104, amount: 3500, status: "completed", created_at: "2024-03-01" },
];

const SAMPLE_RESULTS_DATA = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 3000 },
  { name: "Mar", value: 5000 },
  { name: "Apr", value: 4500 },
  { name: "May", value: 6000 },
  { name: "Jun", value: 5500 },
];

export const WorkflowBuilderPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [insightName, setInsightName] = useState("Untitled Insight");
  const [currentStep, setCurrentStep] = useState<BuilderStep>("build");
  const [selectedDataSource, setSelectedDataSource] = useState<DataSourceType | null>(null);
  const [hasRun, setHasRun] = useState(false);
  
  const [workflow, setWorkflow] = useState<WorkflowBlock[]>([
    { ...AVAILABLE_BLOCKS[0], instanceId: "1", config: { database: "Sales DB" } },
    { ...AVAILABLE_BLOCKS[1], instanceId: "2", config: { table: "orders" } },
    { ...AVAILABLE_BLOCKS[4], instanceId: "3", config: { groupByColumns: ["month"] } },
    { ...AVAILABLE_BLOCKS[6], instanceId: "4", config: { aggregateFunction: "SUM", aggregateColumn: "revenue" } },
  ]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const selectedBlock = workflow.find((b) => b.instanceId === selectedBlockId);

  const handleAddBlock = (block: Block) => {
    const newBlock: WorkflowBlock = {
      ...block,
      instanceId: Date.now().toString(),
      config: {},
    };
    setWorkflow((prev) => [...prev, newBlock]);
    setSelectedBlockId(newBlock.instanceId);
  };

  const handleRemoveBlock = (instanceId: string) => {
    setWorkflow((prev) => prev.filter((b) => b.instanceId !== instanceId));
    if (selectedBlockId === instanceId) {
      setSelectedBlockId(null);
    }
  };

  const handleUpdateBlockConfig = (instanceId: string, config: BlockConfig) => {
    setWorkflow((prev) =>
      prev.map((b) => (b.instanceId === instanceId ? { ...b, config } : b))
    );
  };

  const handleReorderBlocks = (startIndex: number, endIndex: number) => {
    setWorkflow((prev) => {
      const result = [...prev];
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  const handleDuplicateBlock = (instanceId: string) => {
    const blockToDuplicate = workflow.find((b) => b.instanceId === instanceId);
    if (blockToDuplicate) {
      const newBlock: WorkflowBlock = {
        ...blockToDuplicate,
        instanceId: Date.now().toString(),
        config: { ...blockToDuplicate.config },
      };
      const index = workflow.findIndex((b) => b.instanceId === instanceId);
      setWorkflow((prev) => {
        const result = [...prev];
        result.splice(index + 1, 0, newBlock);
        return result;
      });
      setSelectedBlockId(newBlock.instanceId);
    }
  };

  const handleRunPreview = () => {
    setHasRun(true);
    toast({
      title: "Workflow executed",
      description: "Data processing complete. Ready for visualization.",
    });
  };

  const handleContinueToVisualize = () => {
    if (!hasRun) {
      toast({
        title: "Run the workflow first",
        description: "Execute the workflow to generate data before visualizing.",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep("select-data");
  };

  const handleDataSourceContinue = () => {
    setCurrentStep("visualize");
  };

  const handleVisualizationSave = (config: {
    chartType: ChartType | "table";
    vizConfig: VisualizationConfig;
    dataSource: DataSourceType;
  }) => {
    toast({
      title: "Insight saved",
      description: "Added to your Insights library",
    });
    navigate("/insights");
  };

  const handleSave = () => {
    toast({
      title: "Insight saved",
      description: "Added to your Insights library",
    });
    navigate("/insights");
  };

  const getIcon = (iconName: string) => {
    return ICON_MAP[iconName] || BarChart2;
  };

  const getCurrentData = () => {
    return selectedDataSource === "source" ? SAMPLE_SOURCE_DATA : SAMPLE_RESULTS_DATA;
  };

  const getCurrentColumns = () => {
    return selectedDataSource === "source"
      ? ["id", "user_id", "amount", "status", "created_at"]
      : ["name", "value"];
  };

  // Data Source Selection Step
  if (currentStep === "select-data") {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 bg-card/80 backdrop-blur-sm border-b border-border/60 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setCurrentStep("build")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="h-5 w-px bg-border" />
            <span className="text-sm font-medium text-foreground">{insightName}</span>
          </div>
        </header>
        <DataSourceSelector
          selectedSource={selectedDataSource}
          onSelectSource={setSelectedDataSource}
          onContinue={handleDataSourceContinue}
          sourceRowCount={SAMPLE_SOURCE_DATA.length}
          resultsRowCount={SAMPLE_RESULTS_DATA.length}
          sourceColumns={["id", "user_id", "amount", "status", "created_at"]}
          resultsColumns={["name", "value"]}
        />
      </div>
    );
  }

  // Visualization Step
  if (currentStep === "visualize" && selectedDataSource) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 bg-card/80 backdrop-blur-sm border-b border-border/60 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/insights">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div className="h-5 w-px bg-border" />
            <Input
              value={insightName}
              onChange={(e) => setInsightName(e.target.value)}
              className="h-8 w-56 text-sm font-medium bg-transparent border-transparent hover:border-border focus:border-border"
            />
          </div>
        </header>
        <VisualizationStep
          dataSource={selectedDataSource}
          data={getCurrentData()}
          columns={getCurrentColumns()}
          onBack={() => setCurrentStep("select-data")}
          onSave={handleVisualizationSave}
        />
      </div>
    );
  }

  // Build Step (Default)
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-14 bg-card/80 backdrop-blur-sm border-b border-border/60 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/insights">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div className="h-5 w-px bg-border" />
          <Input
            value={insightName}
            onChange={(e) => setInsightName(e.target.value)}
            className="h-8 w-56 text-sm font-medium bg-transparent border-transparent hover:border-border focus:border-border"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRunPreview}>
            <Play className="w-4 h-4 mr-2" />
            Run Preview
          </Button>
          <Button 
            variant={hasRun ? "default" : "outline"} 
            size="sm" 
            onClick={handleContinueToVisualize}
            disabled={!hasRun}
            className={hasRun ? "bg-gradient-ai shadow-glow-ai hover:opacity-90" : ""}
          >
            <Palette className="w-4 h-4 mr-2" />
            Visualize
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Insight
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Block Palette */}
        <BlockPalette
          blocks={AVAILABLE_BLOCKS}
          onAddBlock={handleAddBlock}
          categoryColors={categoryColors}
          getIcon={getIcon}
        />

        {/* Canvas */}
        <WorkflowCanvas
          workflow={workflow}
          selectedBlockId={selectedBlockId}
          onSelectBlock={setSelectedBlockId}
          onRemoveBlock={handleRemoveBlock}
          onReorderBlocks={handleReorderBlocks}
          onAddBlock={handleAddBlock}
          onDuplicateBlock={handleDuplicateBlock}
          categoryColors={categoryColors}
          getIcon={getIcon}
        />

        {/* Config Panel or Preview Panel */}
        {selectedBlock ? (
          <BlockConfigPanel
            block={selectedBlock}
            onUpdate={handleUpdateBlockConfig}
            onClose={() => setSelectedBlockId(null)}
          />
        ) : (
          <PreviewPanel workflow={workflow} data={SAMPLE_RESULTS_DATA} />
        )}
      </div>
    </div>
  );
};
