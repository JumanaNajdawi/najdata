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
  Filter,
  Group,
  ArrowDownUp,
  Calculator,
  BarChart2,
  LineChart,
  PieChart,
  Columns,
  Hash,
  Plus,
  X,
  GripVertical,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart,
  Bar,
  LineChart as RechartsLine,
  Line,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Block {
  id: string;
  type: string;
  label: string;
  icon: React.ElementType;
  category: "data" | "transform" | "visualize";
  config?: Record<string, any>;
}

interface WorkflowBlock extends Block {
  instanceId: string;
}

const AVAILABLE_BLOCKS: Block[] = [
  // Data blocks
  { id: "database", type: "database", label: "Database", icon: Database, category: "data" },
  { id: "table", type: "table", label: "Table", icon: Table2, category: "data" },
  { id: "column", type: "column", label: "Column", icon: Columns, category: "data" },
  // Transform blocks
  { id: "filter", type: "filter", label: "Filter", icon: Filter, category: "transform" },
  { id: "group", type: "group", label: "Group By", icon: Group, category: "transform" },
  { id: "sort", type: "sort", label: "Sort", icon: ArrowDownUp, category: "transform" },
  { id: "calculate", type: "calculate", label: "Calculate", icon: Calculator, category: "transform" },
  { id: "limit", type: "limit", label: "Limit", icon: Hash, category: "transform" },
  // Visualize blocks
  { id: "bar-chart", type: "bar-chart", label: "Bar Chart", icon: BarChart2, category: "visualize" },
  { id: "line-chart", type: "line-chart", label: "Line Chart", icon: LineChart, category: "visualize" },
  { id: "pie-chart", type: "pie-chart", label: "Pie Chart", icon: PieChart, category: "visualize" },
];

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

const PIE_COLORS = ["hsl(230, 84%, 60%)", "hsl(162, 96%, 43%)", "hsl(280, 84%, 60%)", "hsl(35, 92%, 55%)", "hsl(350, 84%, 60%)"];

export const WorkflowBuilderPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [insightName, setInsightName] = useState("Untitled Insight");
  const [workflow, setWorkflow] = useState<WorkflowBlock[]>([
    { ...AVAILABLE_BLOCKS[0], instanceId: "1", config: { selected: "Sales DB" } },
    { ...AVAILABLE_BLOCKS[1], instanceId: "2", config: { selected: "orders" } },
    { ...AVAILABLE_BLOCKS[4], instanceId: "3", config: { column: "month" } },
    { ...AVAILABLE_BLOCKS[6], instanceId: "4", config: { function: "SUM", column: "revenue" } },
    { ...AVAILABLE_BLOCKS[8], instanceId: "5" },
  ]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const handleAddBlock = (block: Block) => {
    const newBlock: WorkflowBlock = {
      ...block,
      instanceId: Date.now().toString(),
    };
    setWorkflow((prev) => [...prev, newBlock]);
  };

  const handleRemoveBlock = (instanceId: string) => {
    setWorkflow((prev) => prev.filter((b) => b.instanceId !== instanceId));
    if (selectedBlockId === instanceId) {
      setSelectedBlockId(null);
    }
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

  const getVisualizationType = () => {
    const vizBlock = workflow.find((b) => b.category === "visualize");
    return vizBlock?.type || "bar-chart";
  };

  const renderPreview = () => {
    const vizType = getVisualizationType();

    return (
      <ResponsiveContainer width="100%" height={280}>
        {vizType === "line-chart" ? (
          <RechartsLine data={SAMPLE_PREVIEW_DATA}>
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Line type="monotone" dataKey="value" stroke="hsl(162, 96%, 43%)" strokeWidth={2} dot={{ fill: "hsl(162, 96%, 43%)" }} />
          </RechartsLine>
        ) : vizType === "pie-chart" ? (
          <RechartsPie data={SAMPLE_PREVIEW_DATA}>
            <Pie data={SAMPLE_PREVIEW_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={100} paddingAngle={2} dataKey="value">
              {SAMPLE_PREVIEW_DATA.map((_, index) => (
                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
          </RechartsPie>
        ) : (
          <BarChart data={SAMPLE_PREVIEW_DATA}>
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="value" fill="hsl(230, 84%, 60%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    );
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
        <aside className="w-56 border-r border-border/60 bg-card/50 p-3 overflow-y-auto shrink-0">
          <div className="space-y-4">
            {/* Data Blocks */}
            <div>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 px-1">
                Data
              </h3>
              <div className="space-y-1">
                {AVAILABLE_BLOCKS.filter((b) => b.category === "data").map((block) => (
                  <button
                    key={block.id}
                    onClick={() => handleAddBlock(block)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors border",
                      categoryColors.data,
                      "hover:opacity-80"
                    )}
                  >
                    <block.icon className="w-4 h-4" />
                    {block.label}
                    <Plus className="w-3 h-3 ml-auto opacity-50" />
                  </button>
                ))}
              </div>
            </div>

            {/* Transform Blocks */}
            <div>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 px-1">
                Transform
              </h3>
              <div className="space-y-1">
                {AVAILABLE_BLOCKS.filter((b) => b.category === "transform").map((block) => (
                  <button
                    key={block.id}
                    onClick={() => handleAddBlock(block)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors border",
                      categoryColors.transform,
                      "hover:opacity-80"
                    )}
                  >
                    <block.icon className="w-4 h-4" />
                    {block.label}
                    <Plus className="w-3 h-3 ml-auto opacity-50" />
                  </button>
                ))}
              </div>
            </div>

            {/* Visualize Blocks */}
            <div>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 px-1">
                Visualize
              </h3>
              <div className="space-y-1">
                {AVAILABLE_BLOCKS.filter((b) => b.category === "visualize").map((block) => (
                  <button
                    key={block.id}
                    onClick={() => handleAddBlock(block)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors border",
                      categoryColors.visualize,
                      "hover:opacity-80"
                    )}
                  >
                    <block.icon className="w-4 h-4" />
                    {block.label}
                    <Plus className="w-3 h-3 ml-auto opacity-50" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Canvas */}
        <main className="flex-1 p-6 overflow-y-auto bg-gradient-surface">
          <div className="max-w-2xl mx-auto">
            {/* Workflow Pipeline */}
            <div className="space-y-3">
              {workflow.map((block, index) => (
                <div key={block.instanceId} className="animate-fade-in">
                  {/* Connector */}
                  {index > 0 && (
                    <div className="flex justify-center py-1">
                      <div className="w-px h-4 bg-border" />
                    </div>
                  )}

                  {/* Block */}
                  <div
                    onClick={() => setSelectedBlockId(block.instanceId)}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-xl border-2 bg-card transition-all cursor-pointer",
                      selectedBlockId === block.instanceId
                        ? "border-primary shadow-md"
                        : "border-border/60 hover:border-border"
                    )}
                  >
                    <div className="cursor-grab text-muted-foreground hover:text-foreground">
                      <GripVertical className="w-4 h-4" />
                    </div>

                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", categoryColors[block.category])}>
                      <block.icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{block.label}</p>
                      {block.config && (
                        <p className="text-sm text-muted-foreground truncate">
                          {Object.values(block.config).join(" • ")}
                        </p>
                      )}
                    </div>

                    <ChevronRight className="w-4 h-4 text-muted-foreground" />

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveBlock(block.instanceId);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Add Block Placeholder */}
              {workflow.length === 0 && (
                <div className="border-2 border-dashed border-border/60 rounded-xl p-8 text-center text-muted-foreground">
                  <p className="font-medium mb-1">Start building your workflow</p>
                  <p className="text-sm">Add blocks from the palette on the left</p>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Preview Panel */}
        <aside className="w-80 border-l border-border/60 bg-card/50 flex flex-col shrink-0">
          <div className="p-4 border-b border-border/60">
            <h3 className="font-medium text-foreground">Preview</h3>
            <p className="text-sm text-muted-foreground">Live output of your workflow</p>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            {workflow.some((b) => b.category === "visualize") ? (
              <div className="bg-background rounded-xl border border-border p-4">
                {renderPreview()}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center text-muted-foreground">
                <div>
                  <BarChart2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Add a visualization block to see preview</p>
                </div>
              </div>
            )}

            {/* Data Preview Table */}
            {workflow.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-foreground mb-2">Data Output</h4>
                <div className="bg-background rounded-lg border border-border overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="px-3 py-2 text-left font-medium text-muted-foreground">Month</th>
                        <th className="px-3 py-2 text-right font-medium text-muted-foreground">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SAMPLE_PREVIEW_DATA.slice(0, 4).map((row, i) => (
                        <tr key={i} className="border-b border-border/50 last:border-0">
                          <td className="px-3 py-2 text-foreground">{row.name}</td>
                          <td className="px-3 py-2 text-right text-foreground">${row.value.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
