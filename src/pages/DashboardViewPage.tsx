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
  ChevronRight,
  Sparkles,
  Trash2,
  Move,
  LayoutDashboard,
} from "lucide-react";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { AIChatPanel } from "@/components/dashboard/AIChatPanel";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const INITIAL_CHARTS = [
  {
    id: "1",
    title: "Monthly Revenue",
    type: "line" as const,
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
    type: "pie" as const,
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
    type: "bar" as const,
    data: [
      { name: "Q1", value: 12000 },
      { name: "Q2", value: 15000 },
      { name: "Q3", value: 18000 },
      { name: "Q4", value: 22000 },
    ],
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
  const [charts, setCharts] = useState(INITIAL_CHARTS);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { toast } = useToast();

  const dashboardName = dashboardNames[id || "main"] || "Dashboard";

  const handleSaveChart = (chart: any) => {
    const newChart = {
      id: Date.now().toString(),
      title:
        chart.type === "pie"
          ? "Category Distribution"
          : chart.type === "line"
          ? "Trend Analysis"
          : "Comparison Chart",
      type: chart.type,
      data: chart.data,
    };
    setCharts((prev) => [...prev, newChart]);
    toast({
      title: "Chart saved to dashboard",
      description: "Your visualization has been added",
    });
  };

  const handleDeleteChart = (chartId: string) => {
    setCharts((prev) => prev.filter((c) => c.id !== chartId));
    toast({
      title: "Chart removed",
      description: "The chart has been deleted from your dashboard",
    });
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
            <h1 className="text-xl font-semibold text-foreground">{dashboardName}</h1>
            <p className="text-sm text-muted-foreground">{charts.length} insights</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
          <Button variant="outline" size="sm">
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Dashboard Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Dashboard
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                <Button variant="outline" asChild>
                  <Link to="/insights">
                    <Plus className="w-4 h-4 mr-2" />
                    Add from Library
                  </Link>
                </Button>
                <Button
                  onClick={() => setIsChatOpen(true)}
                  className="bg-gradient-ai shadow-glow-ai hover:opacity-90"
                >
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
                  <ChartCard
                    id={chart.id}
                    title={chart.title}
                    type={chart.type}
                    data={chart.data}
                    onDelete={handleDeleteChart}
                  />
                </div>
              ))}

              {/* Add Insight Placeholder */}
              <Link
                to="/insights"
                className="min-h-[320px] border-2 border-dashed border-border/60 rounded-2xl flex flex-col items-center justify-center gap-4 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-accent/30 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-muted rounded-xl flex items-center justify-center">
                  <Plus className="w-7 h-7" />
                </div>
                <div className="text-center">
                  <span className="font-semibold block">Add Insight</span>
                  <span className="text-sm">From library or create new</span>
                </div>
              </Link>
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
    </div>
  );
};
