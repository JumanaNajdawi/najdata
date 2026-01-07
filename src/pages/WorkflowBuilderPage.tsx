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
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Block, WorkflowBlock, BlockConfig, ChartType, Connection, Position } from "@/components/workflow/types";
import { BlockPalette } from "@/components/workflow/BlockPalette";
import { WorkflowCanvas } from "@/components/workflow/WorkflowCanvas";
import { BlockConfigPanel } from "@/components/workflow/BlockConfigPanel";
import { PreviewPanel } from "@/components/workflow/PreviewPanel";
import { VisualizationDialog, DataSourceType } from "@/components/workflow/VisualizationDialog";
import { VisualizationConfig } from "@/components/sql/SQLVisualizationPanel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  { id: "join", type: "join", label: "Join", icon: "Merge", category: "transform", description: "Join with another table", inputs: 2 },
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
  const [hasRun, setHasRun] = useState(false);
  const [vizDialogOpen, setVizDialogOpen] = useState(false);
  const [selectedDataSource, setSelectedDataSource] = useState<DataSourceType | null>(null);
  
  // Workflow state with positions
  const [workflow, setWorkflow] = useState<WorkflowBlock[]>([
    { ...AVAILABLE_BLOCKS[0], instanceId: "1", position: { x: 100, y: 100 }, config: { database: "Sales DB" } },
    { ...AVAILABLE_BLOCKS[1], instanceId: "2", position: { x: 100, y: 220 }, config: { table: "orders" } },
    { ...AVAILABLE_BLOCKS[4], instanceId: "3", position: { x: 100, y: 340 }, config: { groupByColumns: ["month"] } },
    { ...AVAILABLE_BLOCKS[6], instanceId: "4", position: { x: 100, y: 460 }, config: { aggregateFunction: "SUM", aggregateColumn: "revenue" } },
  ]);
  
  // Connections between blocks
  const [connections, setConnections] = useState<Connection[]>([
    { id: "conn-1", sourceId: "1", targetId: "2" },
    { id: "conn-2", sourceId: "2", targetId: "3" },
    { id: "conn-3", sourceId: "3", targetId: "4" },
  ]);
  
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const selectedBlock = workflow.find((b) => b.instanceId === selectedBlockId);

  const handleAddBlock = (block: Block, position?: Position) => {
    const newBlock: WorkflowBlock = {
      ...block,
      instanceId: Date.now().toString(),
      position: position || { x: 100 + workflow.length * 20, y: 100 + workflow.length * 120 },
      config: {},
    };
    setWorkflow((prev) => [...prev, newBlock]);
    setSelectedBlockId(newBlock.instanceId);
  };

  const handleRemoveBlock = (instanceId: string) => {
    setWorkflow((prev) => prev.filter((b) => b.instanceId !== instanceId));
    setConnections((prev) => prev.filter((c) => c.sourceId !== instanceId && c.targetId !== instanceId));
    if (selectedBlockId === instanceId) {
      setSelectedBlockId(null);
    }
  };

  const handleUpdateBlockConfig = (instanceId: string, config: BlockConfig) => {
    setWorkflow((prev) =>
      prev.map((b) => (b.instanceId === instanceId ? { ...b, config } : b))
    );
  };

  const handleUpdateBlockPosition = (instanceId: string, position: Position) => {
    setWorkflow((prev) =>
      prev.map((b) => (b.instanceId === instanceId ? { ...b, position } : b))
    );
  };

  const handleAddConnection = (sourceId: string, targetId: string) => {
    const newConnection: Connection = {
      id: `conn-${Date.now()}`,
      sourceId,
      targetId,
    };
    setConnections((prev) => [...prev, newConnection]);
  };

  const handleRemoveConnection = (connectionId: string) => {
    setConnections((prev) => prev.filter((c) => c.id !== connectionId));
  };

  const handleDuplicateBlock = (instanceId: string) => {
    const blockToDuplicate = workflow.find((b) => b.instanceId === instanceId);
    if (blockToDuplicate) {
      const newBlock: WorkflowBlock = {
        ...blockToDuplicate,
        instanceId: Date.now().toString(),
        position: { 
          x: blockToDuplicate.position.x + 40, 
          y: blockToDuplicate.position.y + 40 
        },
        config: { ...blockToDuplicate.config },
      };
      setWorkflow((prev) => [...prev, newBlock]);
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

const handleOpenVisualize = (source: DataSourceType) => {
    if (!hasRun) {
      toast({
        title: "Run the workflow first",
        description: "Please run the workflow before visualizing.",
        variant: "destructive",
      });
      return;
    }
    setSelectedDataSource(source);
    setVizDialogOpen(true);
  };

  const handleVizDialogClose = (open: boolean) => {
    setVizDialogOpen(open);
    if (!open) {
      setSelectedDataSource(null);
    }
  };

  const handleSaveVisualization = (config: any) => {
    toast({
      title: "Insight saved",
      description: `"${insightName}" has been saved successfully.`,
    });
    navigate("/insights");
  };

  const getIcon = (iconName: string) => {
    return ICON_MAP[iconName] || Database;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-14 border-b border-border/60 bg-card/50 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/insights">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Cancel
            </Link>
          </Button>
          <div className="h-4 w-px bg-border" />
          <Input
            value={insightName}
            onChange={(e) => setInsightName(e.target.value)}
            className="text-lg font-semibold border-0 bg-transparent focus-visible:ring-0 px-0 w-auto max-w-xs"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRunPreview}>
            <Play className="w-4 h-4 mr-2" />
            Run
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button disabled={!hasRun}>
                <BarChart2 className="w-4 h-4 mr-2" />
                Visualize
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleOpenVisualize("source")}>
                <Database className="w-4 h-4 mr-2" />
                Source Data
                <span className="ml-auto text-xs text-muted-foreground">
                  {SAMPLE_SOURCE_DATA.length} rows
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleOpenVisualize("results")}>
                <Table2 className="w-4 h-4 mr-2" />
                Results Data
                <span className="ml-auto text-xs text-muted-foreground">
                  {SAMPLE_RESULTS_DATA.length} rows
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Block Palette */}
        <BlockPalette
          blocks={AVAILABLE_BLOCKS}
          onAddBlock={(block) => handleAddBlock(block)}
          categoryColors={categoryColors}
          getIcon={getIcon}
        />

        {/* Canvas */}
        <WorkflowCanvas
          workflow={workflow}
          connections={connections}
          selectedBlockId={selectedBlockId}
          onSelectBlock={setSelectedBlockId}
          onRemoveBlock={handleRemoveBlock}
          onUpdateBlockPosition={handleUpdateBlockPosition}
          onAddBlock={handleAddBlock}
          onAddConnection={handleAddConnection}
          onRemoveConnection={handleRemoveConnection}
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

      {/* Visualization Dialog */}
      <VisualizationDialog
        open={vizDialogOpen}
        onOpenChange={handleVizDialogClose}
        onSave={handleSaveVisualization}
        sourceData={SAMPLE_SOURCE_DATA}
        resultsData={SAMPLE_RESULTS_DATA}
        sourceColumns={Object.keys(SAMPLE_SOURCE_DATA[0])}
        resultsColumns={Object.keys(SAMPLE_RESULTS_DATA[0])}
        initialDataSource={selectedDataSource || undefined}
      />
    </div>
  );
};
