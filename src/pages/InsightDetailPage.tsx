import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Copy,
  Download,
  MoreHorizontal,
  Database,
  Clock,
  Workflow,
  Code2,
  Sparkles,
  RefreshCw,
  Maximize2,
  Share2,
  Settings,
  Play,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ChartPreview } from "@/components/workflow/ChartPreview";
import { WorkflowBlock, ChartType } from "@/components/workflow/types";

type CreationMethod = "workflow" | "sql" | "ai";

interface InsightData {
  id: string;
  name: string;
  description?: string;
  chartType: ChartType;
  createdAt: string;
  updatedAt: string;
  database: string;
  creationMethod: CreationMethod;
  query?: string;
  config: {
    xAxis?: string;
    yAxis?: string;
    colorScheme?: string;
    showLegend?: boolean;
    showGrid?: boolean;
    showDataLabels?: boolean;
  };
}

const SAMPLE_INSIGHTS: Record<string, InsightData> = {
  "1": {
    id: "1",
    name: "Monthly Revenue Trend",
    description: "Revenue performance over the last 12 months showing growth patterns and seasonal trends",
    chartType: "line",
    createdAt: "2024-01-15",
    updatedAt: "2 hours ago",
    database: "Sales DB",
    creationMethod: "ai",
    query: `SELECT 
  DATE_TRUNC('month', created_at) as month,
  SUM(amount) as revenue
FROM orders
WHERE status = 'completed'
GROUP BY month
ORDER BY month DESC`,
    config: {
      xAxis: "month",
      yAxis: "revenue",
      colorScheme: "default",
      showLegend: true,
      showGrid: true,
    },
  },
  "2": {
    id: "2",
    name: "Top Products by Sales",
    description: "Best performing products this quarter",
    chartType: "bar",
    createdAt: "2024-01-12",
    updatedAt: "Yesterday",
    database: "Inventory",
    creationMethod: "workflow",
    config: {
      xAxis: "product",
      yAxis: "sales",
      colorScheme: "ocean",
      showLegend: false,
      showGrid: true,
    },
  },
  "3": {
    id: "3",
    name: "Customer Segments",
    description: "Distribution of customer types",
    chartType: "pie",
    createdAt: "2024-01-10",
    updatedAt: "3 days ago",
    database: "CRM Data",
    creationMethod: "sql",
    query: "SELECT segment, COUNT(*) as count FROM customers GROUP BY segment",
    config: {
      colorScheme: "sunset",
      showLegend: true,
    },
  },
};

const SAMPLE_DATA = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 3000 },
  { name: "Mar", value: 5000 },
  { name: "Apr", value: 4500 },
  { name: "May", value: 6000 },
  { name: "Jun", value: 5500 },
];

const methodIcons: Record<CreationMethod, React.ElementType> = {
  workflow: Workflow,
  sql: Code2,
  ai: Sparkles,
};

const methodLabels: Record<CreationMethod, string> = {
  workflow: "Workflow",
  sql: "SQL",
  ai: "AI Agent",
};

const methodColors: Record<CreationMethod, string> = {
  workflow: "bg-chart-4/10 text-chart-4",
  sql: "bg-chart-3/10 text-chart-3",
  ai: "bg-secondary/10 text-secondary",
};

export const InsightDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const insight = SAMPLE_INSIGHTS[id || "1"] || SAMPLE_INSIGHTS["1"];
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(insight.name);
  const [editedDescription, setEditedDescription] = useState(insight.description || "");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const MethodIcon = methodIcons[insight.creationMethod];

  // Create a mock workflow block for ChartPreview
  const mockWorkflow: WorkflowBlock[] = [
    {
      id: "viz-1",
      instanceId: "viz-instance-1",
      type: `${insight.chartType}-chart`,
      label: insight.name,
      icon: "BarChart2",
      category: "visualize",
      config: {
        chartType: insight.chartType,
        ...insight.config,
      },
    },
  ];

  const handleSaveEdit = () => {
    setIsEditing(false);
    toast({
      title: "Insight updated",
      description: "Changes have been saved",
    });
  };

  const handleDelete = () => {
    setDeleteDialogOpen(false);
    toast({
      title: "Insight deleted",
      description: "The insight has been removed",
    });
    navigate("/insights");
  };

  const handleDuplicate = () => {
    toast({
      title: "Insight duplicated",
      description: "A copy has been created",
    });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Data refreshed",
        description: "Chart has been updated with latest data",
      });
    }, 1500);
  };

  const handleExport = (format: "png" | "csv") => {
    toast({
      title: `Exported as ${format.toUpperCase()}`,
      description: "File download started",
    });
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <header className="h-16 bg-card/80 backdrop-blur-sm border-b border-border/60 flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/insights">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div className="h-5 w-px bg-border" />
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="h-8 w-64 text-lg font-semibold"
                autoFocus
              />
              <Button size="sm" onClick={handleSaveEdit}>
                Save
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <div>
              <h1 className="text-xl font-semibold text-foreground">{insight.name}</h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  {insight.database}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Updated {insight.updatedAt}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsFullscreen(true)}>
            <Maximize2 className="w-4 h-4 mr-2" />
            Fullscreen
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDuplicate}>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleExport("png")}>
                <Download className="w-4 h-4 mr-2" />
                Export as PNG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("csv")}>
                <Download className="w-4 h-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Creation Method Badge */}
        <div className="flex items-center gap-3">
          <Badge
            variant="secondary"
            className={cn("text-sm px-3 py-1", methodColors[insight.creationMethod])}
          >
            <MethodIcon className="w-4 h-4 mr-1.5" />
            Created with {methodLabels[insight.creationMethod]}
          </Badge>
        </div>

        {/* Description */}
        {(insight.description || isEditing) && (
          <div className="bg-card rounded-xl border border-border/60 p-4">
            {isEditing ? (
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="w-full min-h-[60px] bg-transparent text-foreground resize-none focus:outline-none"
                placeholder="Add a description..."
              />
            ) : (
              <p className="text-muted-foreground">{insight.description}</p>
            )}
          </div>
        )}

        {/* Main Chart */}
        <div className="bg-card rounded-xl border border-border/60 overflow-hidden">
          <div className="p-4 border-b border-border/60 flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Visualization</h2>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {insight.chartType.charAt(0).toUpperCase() + insight.chartType.slice(1)} Chart
              </Badge>
            </div>
          </div>
          <div className="p-6">
            <ChartPreview workflow={mockWorkflow} data={SAMPLE_DATA} />
          </div>
        </div>

        {/* Tabs for Details */}
        <Tabs defaultValue="config" className="w-full">
          <TabsList className="w-full justify-start bg-muted/30 p-1 rounded-lg">
            <TabsTrigger value="config" className="gap-2">
              <Settings className="w-4 h-4" />
              Configuration
            </TabsTrigger>
            {insight.query && (
              <TabsTrigger value="query" className="gap-2">
                <Code2 className="w-4 h-4" />
                Query
              </TabsTrigger>
            )}
            <TabsTrigger value="data" className="gap-2">
              <Database className="w-4 h-4" />
              Data Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="mt-4">
            <div className="bg-card rounded-xl border border-border/60 p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">X-Axis</p>
                  <p className="text-sm font-medium text-foreground">
                    {insight.config.xAxis || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Y-Axis</p>
                  <p className="text-sm font-medium text-foreground">
                    {insight.config.yAxis || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Color Scheme</p>
                  <p className="text-sm font-medium text-foreground capitalize">
                    {insight.config.colorScheme || "Default"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Legend</p>
                  <p className="text-sm font-medium text-foreground">
                    {insight.config.showLegend ? "Visible" : "Hidden"}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {insight.query && (
            <TabsContent value="query" className="mt-4">
              <div className="bg-card rounded-xl border border-border/60 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-border/60 bg-muted/30">
                  <span className="text-xs font-medium text-muted-foreground">SQL Query</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(insight.query || "");
                      toast({ title: "Query copied to clipboard" });
                    }}
                  >
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    Copy
                  </Button>
                </div>
                <pre className="p-4 font-mono text-sm text-foreground overflow-x-auto whitespace-pre-wrap">
                  {insight.query}
                </pre>
              </div>
            </TabsContent>
          )}

          <TabsContent value="data" className="mt-4">
            <div className="bg-card rounded-xl border border-border/60 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-border/60 bg-muted/30">
                <span className="text-xs font-medium text-muted-foreground">
                  Sample Data ({SAMPLE_DATA.length} rows)
                </span>
                <Button variant="ghost" size="sm" onClick={() => handleExport("csv")}>
                  <Download className="w-3.5 h-3.5 mr-1" />
                  Export
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                        Name
                      </th>
                      <th className="px-4 py-2 text-right font-medium text-muted-foreground">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {SAMPLE_DATA.map((row, i) => (
                      <tr key={i} className="border-b border-border/50 last:border-0">
                        <td className="px-4 py-2 text-foreground">{row.name}</td>
                        <td className="px-4 py-2 text-right text-foreground">
                          {row.value.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Insight</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{insight.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Fullscreen Dialog */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-5xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>{insight.name}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 h-full min-h-[400px]">
            <ChartPreview workflow={mockWorkflow} data={SAMPLE_DATA} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
