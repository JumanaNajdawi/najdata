import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Plus,
  Settings,
  Share2,
  MoreHorizontal,
  Filter,
  Calendar,
  Sparkles,
  Trash2,
  LayoutDashboard,
  RefreshCw,
  Zap,
} from "lucide-react";
import { EnhancedChartCard } from "@/components/dashboard/EnhancedChartCard";
import { AIChatPanel } from "@/components/dashboard/AIChatPanel";
import { AddInsightDialog } from "@/components/dashboard/AddInsightDialog";
import { DashboardSettingsDialog } from "@/components/dashboard/DashboardSettingsDialog";
import { ShareDashboardDialog } from "@/components/dashboard/ShareDashboardDialog";
import { QuickInsightDialog } from "@/components/dashboard/QuickInsightDialog";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChartType } from "@/components/workflow/types";

interface DashboardChart {
  id: string;
  title: string;
  type: ChartType;
  data: any[];
  colorScheme?: string;
}

const INITIAL_CHARTS: DashboardChart[] = [
  {
    id: "1",
    title: "Monthly Revenue",
    type: "line",
    data: [
      { name: "Jan", value: 4000 },
      { name: "Feb", value: 3000 },
      { name: "Mar", value: 5000 },
      { name: "Apr", value: 4500 },
      { name: "May", value: 6000 },
      { name: "Jun", value: 5500 },
    ],
  },
  {
    id: "2",
    title: "Sales by Category",
    type: "donut",
    data: [
      { name: "Electronics", value: 35 },
      { name: "Clothing", value: 25 },
      { name: "Food", value: 20 },
      { name: "Books", value: 12 },
      { name: "Other", value: 8 },
    ],
  },
  {
    id: "3",
    title: "Quarterly Comparison",
    type: "bar",
    data: [
      { name: "Q1", value: 12000 },
      { name: "Q2", value: 15000 },
      { name: "Q3", value: 18000 },
      { name: "Q4", value: 22000 },
    ],
  },
  {
    id: "4",
    title: "Total Revenue",
    type: "kpi",
    data: [{ value: 67000, change: 12.5 }],
  },
];

const dashboardNames: Record<string, string> = {
  main: "Main Dashboard",
  sales: "Sales Overview",
  marketing: "Marketing Analytics",
  product: "Product Metrics",
};

export const DashboardViewPage = () => {
  const { id } = useParams();
  const [charts, setCharts] = useState<DashboardChart[]>(INITIAL_CHARTS);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [addInsightOpen, setAddInsightOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [quickInsightOpen, setQuickInsightOpen] = useState(false);
  const [expandedCharts, setExpandedCharts] = useState<Set<string>>(new Set());
  const [isPublic, setIsPublic] = useState(false);
  const { toast } = useToast();

  const dashboardName = dashboardNames[id || "main"] || "Dashboard";

  const [settings, setSettings] = useState<{
    name: string;
    description?: string;
    visibility: "private" | "public";
    color: string;
    autoRefresh: boolean;
    refreshInterval: number;
    layout: "grid" | "masonry" | "freeform";
  }>({
    name: dashboardName,
    description: "Dashboard description",
    visibility: "private",
    color: "blue",
    autoRefresh: false,
    refreshInterval: 60,
    layout: "grid",
  });

  const handleSaveChart = (chart: any) => {
    const newChart: DashboardChart = {
      id: Date.now().toString(),
      title: chart.type === "pie" ? "Category Distribution" : "New Insight",
      type: chart.type,
      data: chart.data,
    };
    setCharts((prev) => [...prev, newChart]);
    toast({ title: "Chart added", description: "Insight saved to dashboard" });
  };

  const handleDeleteChart = (chartId: string) => {
    setCharts((prev) => prev.filter((c) => c.id !== chartId));
    toast({ title: "Chart removed" });
  };

  const handleUpdateChart = (chartId: string, updates: Partial<DashboardChart>) => {
    setCharts((prev) =>
      prev.map((c) => (c.id === chartId ? { ...c, ...updates } : c))
    );
  };

  const handleToggleExpand = (chartId: string) => {
    setExpandedCharts((prev) => {
      const next = new Set(prev);
      if (next.has(chartId)) next.delete(chartId);
      else next.add(chartId);
      return next;
    });
  };

  const handleAddInsight = (insight: any) => {
    const newChart: DashboardChart = {
      id: Date.now().toString(),
      title: insight.name,
      type: insight.type,
      data: [
        { name: "A", value: 100 },
        { name: "B", value: 200 },
        { name: "C", value: 150 },
      ],
    };
    setCharts((prev) => [...prev, newChart]);
    toast({ title: "Insight added" });
  };

  const handleQuickInsightSave = (insight: any) => {
    const newChart: DashboardChart = {
      id: Date.now().toString(),
      title: insight.title,
      type: insight.chartType as ChartType,
      data: insight.data,
      colorScheme: insight.config?.colorScheme,
    };
    setCharts((prev) => [...prev, newChart]);
    toast({ title: "Quick insight created", description: `"${insight.title}" added to dashboard` });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-card/80 backdrop-blur-sm border-b border-border/60 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboards">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          <div className="h-6 w-px bg-border" />
          <div>
            <h1 className="text-xl font-semibold text-foreground">{settings.name}</h1>
            <p className="text-sm text-muted-foreground">{charts.length} insights</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setQuickInsightOpen(true)}>
            <Zap className="w-4 h-4 mr-2" />
            Quick Insight
          </Button>
          <Button variant="outline" size="sm" onClick={() => setAddInsightOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Insight
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShareOpen(true)}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button
            variant={isChatOpen ? "secondary" : "default"}
            size="sm"
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={isChatOpen ? "" : "bg-gradient-ai shadow-glow-ai hover:opacity-90"}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Agent
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setSettingsOpen(true)}>
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Dashboard Canvas */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-6 overflow-y-auto scrollbar-thin">
          {charts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in">
              <div className="w-24 h-24 bg-muted rounded-3xl flex items-center justify-center mb-6">
                <LayoutDashboard className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-3">
                This dashboard is empty
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md text-lg">
                Add insights from your library or create new ones with the AI Agent.
              </p>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => setAddInsightOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Insight
                </Button>
                <Button onClick={() => setIsChatOpen(true)} className="bg-gradient-ai shadow-glow-ai hover:opacity-90">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create with AI
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {charts.map((chart, index) => (
                <div
                  key={chart.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <EnhancedChartCard
                    id={chart.id}
                    title={chart.title}
                    type={chart.type}
                    data={chart.data}
                    colorScheme={chart.colorScheme}
                    onDelete={handleDeleteChart}
                    onUpdate={handleUpdateChart}
                    isExpanded={expandedCharts.has(chart.id)}
                    onToggleExpand={handleToggleExpand}
                  />
                </div>
              ))}

              {/* Add Insight Placeholder */}
              <button
                onClick={() => setAddInsightOpen(true)}
                className="min-h-[320px] border-2 border-dashed border-border/60 rounded-2xl flex flex-col items-center justify-center gap-4 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-accent/30 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-muted rounded-xl flex items-center justify-center">
                  <Plus className="w-7 h-7" />
                </div>
                <div className="text-center">
                  <span className="font-semibold block">Add Insight</span>
                  <span className="text-sm">From library or create new</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* AI Chat Panel */}
        {isChatOpen && (
          <div className="w-[400px] shrink-0 animate-slide-in-right">
            <AIChatPanel onSaveChart={handleSaveChart} />
          </div>
        )}
      </div>

      {/* Dialogs */}
      <AddInsightDialog
        open={addInsightOpen}
        onOpenChange={setAddInsightOpen}
        onAddInsight={handleAddInsight}
      />

      <DashboardSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={settings}
        onSave={setSettings}
        onDelete={() => toast({ title: "Dashboard deleted" })}
      />

      <ShareDashboardDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        dashboardName={settings.name}
        isPublic={isPublic}
        onVisibilityChange={setIsPublic}
      />

      <QuickInsightDialog
        open={quickInsightOpen}
        onOpenChange={setQuickInsightOpen}
        onSave={handleQuickInsightSave}
      />
    </div>
  );
};
