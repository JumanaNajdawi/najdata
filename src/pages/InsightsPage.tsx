import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Lightbulb,
  Plus,
  Search,
  Grid3X3,
  List,
  Filter,
  MoreHorizontal,
  Sparkles,
  Code2,
  Workflow,
  Clock,
  Database,
  Trash2,
  Copy,
  Edit,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { QuickInsightDialog } from "@/components/dashboard/QuickInsightDialog";
import { useToast } from "@/hooks/use-toast";

type ViewMode = "grid" | "list";
type CreationMethod = "workflow" | "sql" | "ai";

interface Insight {
  id: string;
  name: string;
  description?: string;
  type: "line" | "bar" | "pie" | "table" | "kpi";
  createdAt: string;
  updatedAt: string;
  database: string;
  creationMethod: CreationMethod;
}

const SAMPLE_INSIGHTS: Insight[] = [
  {
    id: "1",
    name: "Monthly Revenue Trend",
    description: "Revenue performance over the last 12 months",
    type: "line",
    createdAt: "2024-01-15",
    updatedAt: "2 hours ago",
    database: "Sales DB",
    creationMethod: "ai",
  },
  {
    id: "2",
    name: "Top Products by Sales",
    description: "Best performing products this quarter",
    type: "bar",
    createdAt: "2024-01-12",
    updatedAt: "Yesterday",
    database: "Inventory",
    creationMethod: "workflow",
  },
  {
    id: "3",
    name: "Customer Segments",
    description: "Distribution of customer types",
    type: "pie",
    createdAt: "2024-01-10",
    updatedAt: "3 days ago",
    database: "CRM Data",
    creationMethod: "sql",
  },
  {
    id: "4",
    name: "Daily Active Users",
    description: "User engagement metrics",
    type: "line",
    createdAt: "2024-01-08",
    updatedAt: "5 days ago",
    database: "Analytics",
    creationMethod: "ai",
  },
  {
    id: "5",
    name: "Conversion Funnel",
    description: "User journey from signup to purchase",
    type: "bar",
    createdAt: "2024-01-05",
    updatedAt: "1 week ago",
    database: "Analytics",
    creationMethod: "workflow",
  },
  {
    id: "6",
    name: "Revenue KPI",
    description: "Key revenue indicators",
    type: "kpi",
    createdAt: "2024-01-03",
    updatedAt: "1 week ago",
    database: "Sales DB",
    creationMethod: "sql",
  },
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

export const InsightsPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [insights, setInsights] = useState<Insight[]>(SAMPLE_INSIGHTS);
  const [quickInsightOpen, setQuickInsightOpen] = useState(false);
  const { toast } = useToast();

  const filteredInsights = insights.filter((insight) =>
    insight.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleQuickInsightSave = (insight: {
    database: string;
    table: string;
    columns: string[];
    chartType: string;
    data: any[];
  }) => {
    const newInsight: Insight = {
      id: Date.now().toString(),
      name: `${insight.table} - ${insight.columns.join(", ")}`,
      description: `Quick insight from ${insight.database}`,
      type: insight.chartType as Insight["type"],
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: "Just now",
      database: insight.database,
      creationMethod: "workflow",
    };
    setInsights((prev) => [newInsight, ...prev]);
    toast({
      title: "Insight created",
      description: "Your quick insight has been added",
    });
  };

  const InsightCard = ({ insight }: { insight: Insight }) => {
    const MethodIcon = methodIcons[insight.creationMethod];

    return (
      <div className="group bg-card rounded-xl border border-border/60 p-5 hover:border-primary/30 hover:shadow-md transition-all duration-300">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-accent-foreground" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content */}
        <Link to={`/insights/${insight.id}`}>
          <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
            {insight.name}
          </h3>
          {insight.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {insight.description}
            </p>
          )}
        </Link>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Database className="w-3 h-3" />
            {insight.database}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {insight.updatedAt}
          </span>
        </div>

        {/* Creation Method Badge */}
        <div className="mt-3 pt-3 border-t border-border/60">
          <Badge
            variant="secondary"
            className={cn("text-xs", methodColors[insight.creationMethod])}
          >
            <MethodIcon className="w-3 h-3 mr-1" />
            {methodLabels[insight.creationMethod]}
          </Badge>
        </div>
      </div>
    );
  };

  const InsightRow = ({ insight }: { insight: Insight }) => {
    const MethodIcon = methodIcons[insight.creationMethod];

    return (
      <Link
        to={`/insights/${insight.id}`}
        className="group flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors border-b border-border/60 last:border-b-0"
      >
        <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
          <Lightbulb className="w-5 h-5 text-accent-foreground" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
            {insight.name}
          </p>
          {insight.description && (
            <p className="text-sm text-muted-foreground truncate">
              {insight.description}
            </p>
          )}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Badge
            variant="secondary"
            className={cn("text-xs", methodColors[insight.creationMethod])}
          >
            <MethodIcon className="w-3 h-3 mr-1" />
            {methodLabels[insight.creationMethod]}
          </Badge>
        </div>

        <div className="hidden lg:flex items-center gap-1 text-sm text-muted-foreground">
          <Database className="w-3.5 h-3.5" />
          {insight.database}
        </div>

        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          {insight.updatedAt}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={(e) => e.preventDefault()}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Link>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <header className="h-16 bg-card/80 backdrop-blur-sm border-b border-border/60 flex items-center justify-between px-6 sticky top-0 z-40">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Insights</h1>
          <p className="text-sm text-muted-foreground">
            {insights.length} insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setQuickInsightOpen(true)}>
            <Zap className="w-4 h-4 mr-2" />
            Quick Insight
          </Button>
          <Button asChild>
            <Link to="/insights/new">
              <Plus className="w-4 h-4 mr-2" />
              Create Insight
            </Link>
          </Button>
        </div>
      </header>

      <QuickInsightDialog
        open={quickInsightOpen}
        onOpenChange={setQuickInsightOpen}
        onSave={handleQuickInsightSave}
      />

      <div className="p-6">
        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search insights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>

          <div className="flex items-center border border-border rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        {filteredInsights.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Lightbulb className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {searchQuery ? "No insights found" : "No insights yet"}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-sm">
              {searchQuery
                ? "Try adjusting your search query"
                : "Create your first insight to visualize your data"}
            </p>
            {!searchQuery && (
              <Button asChild>
                <Link to="/insights/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Insight
                </Link>
              </Button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-fade-in">
            {filteredInsights.map((insight, index) => (
              <div
                key={insight.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <InsightCard insight={insight} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border/60 animate-fade-in">
            {filteredInsights.map((insight) => (
              <InsightRow key={insight.id} insight={insight} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
