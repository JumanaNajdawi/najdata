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
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Block, WorkflowBlock, BlockConfig } from "@/components/workflow/types";
import { BlockPalette } from "@/components/workflow/BlockPalette";
import { WorkflowCanvas } from "@/components/workflow/WorkflowCanvas";
import { BlockConfigPanel } from "@/components/workflow/BlockConfigPanel";
import { PreviewPanel } from "@/components/workflow/PreviewPanel";

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
  // Visualize blocks
  { id: "bar-chart", type: "bar-chart", label: "Bar Chart", icon: "BarChart2", category: "visualize", description: "Vertical bar chart" },
  { id: "line-chart", type: "line-chart", label: "Line Chart", icon: "LineChart", category: "visualize", description: "Line chart for trends" },
  { id: "area-chart", type: "area-chart", label: "Area Chart", icon: "AreaChart", category: "visualize", description: "Filled area chart" },
  { id: "pie-chart", type: "pie-chart", label: "Pie Chart", icon: "PieChart", category: "visualize", description: "Pie or donut chart" },
  { id: "scatter-chart", type: "scatter-chart", label: "Scatter Plot", icon: "ScatterChart", category: "visualize", description: "Scatter plot for correlations" },
  { id: "radar-chart", type: "radar-chart", label: "Radar Chart", icon: "Radar", category: "visualize", description: "Radar/spider chart" },
  { id: "kpi-card", type: "kpi-card", label: "KPI Card", icon: "TrendingUp", category: "visualize", description: "Key performance indicator" },
  { id: "gauge-chart", type: "gauge-chart", label: "Gauge", icon: "Activity", category: "visualize", description: "Gauge/speedometer chart" },
  { id: "funnel-chart", type: "funnel-chart", label: "Funnel", icon: "Target", category: "visualize", description: "Funnel chart" },
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

const SAMPLE_PREVIEW_DATA = [
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
  const [workflow, setWorkflow] = useState<WorkflowBlock[]>([
    { ...AVAILABLE_BLOCKS[0], instanceId: "1", config: { database: "Sales DB" } },
    { ...AVAILABLE_BLOCKS[1], instanceId: "2", config: { table: "orders" } },
    { ...AVAILABLE_BLOCKS[4], instanceId: "3", config: { groupByColumns: ["month"] } },
    { ...AVAILABLE_BLOCKS[6], instanceId: "4", config: { aggregateFunction: "SUM", aggregateColumn: "revenue" } },
    { ...AVAILABLE_BLOCKS[12], instanceId: "5", config: { chartType: "bar", colorScheme: "default", showLegend: true, showGrid: true } },
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

  const handleRunPreview = () => {
    toast({
      title: "Preview updated",
      description: "Workflow executed successfully",
    });
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
          <PreviewPanel workflow={workflow} data={SAMPLE_PREVIEW_DATA} />
        )}
      </div>
    </div>
  );
};
