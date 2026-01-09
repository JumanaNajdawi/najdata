import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Plus, 
  LayoutDashboard,
  FileSpreadsheet,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap
} from "lucide-react";
import { AIChatPanel } from "./AIChatPanel";
import { ChartCard } from "./ChartCard";
import { QuickInsightDialog } from "./QuickInsightDialog";
import { useToast } from "@/hooks/use-toast";

interface ChartData {
  id: string;
  title: string;
  type: "line" | "bar" | "pie";
  data: { name: string; value: number }[];
}

const INITIAL_CHARTS: ChartData[] = [
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
    type: "pie",
    data: [
      { name: "Electronics", value: 35 },
      { name: "Clothing", value: 25 },
      { name: "Food", value: 20 },
      { name: "Books", value: 12 },
      { name: "Other", value: 8 },
    ],
  },
];

export const DashboardPage = () => {
  const [charts, setCharts] = useState(INITIAL_CHARTS);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [quickInsightOpen, setQuickInsightOpen] = useState(false);
  const { toast } = useToast();

  const handleSaveChart = (chart: any) => {
    const newChart = {
      id: Date.now().toString(),
      title: chart.type === "pie" ? "Category Distribution" : chart.type === "line" ? "Trend Analysis" : "Comparison Chart",
      type: chart.type,
      data: chart.data,
    };
    setCharts((prev) => [...prev, newChart]);
    toast({
      title: "Chart saved to dashboard",
      description: "Your visualization has been added",
    });
  };

  const handleDeleteChart = (id: string) => {
    setCharts((prev) => prev.filter((c) => c.id !== id));
    toast({
      title: "Chart removed",
      description: "The chart has been deleted from your dashboard",
    });
  };

  const handleAddChart = () => {
    toast({
      title: "Use AI to create charts",
      description: "Ask the AI assistant to generate visualizations from your data",
    });
  };

  const handleQuickInsightSave = (insight: {
    database: string;
    table: string;
    columns: string[];
    chartType: string;
    data: any[];
  }) => {
    const newChart = {
      id: Date.now().toString(),
      title: `${insight.table} - ${insight.columns.join(", ")}`,
      type: insight.chartType as "line" | "bar" | "pie",
      data: insight.data,
    };
    setCharts((prev) => [...prev, newChart]);
    toast({
      title: "Chart added",
      description: "Your quick insight has been added to the dashboard",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-surface flex">
      {/* Sidebar Navigation */}
      <aside className="w-[72px] bg-card border-r border-border/60 flex flex-col items-center py-5 gap-3">
        <div className="w-11 h-11 bg-gradient-primary rounded-xl flex items-center justify-center mb-6 shadow-glow">
          <BarChart3 className="w-6 h-6 text-primary-foreground" />
        </div>
        
        <nav className="flex-1 flex flex-col items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-11 h-11 bg-accent text-accent-foreground rounded-xl"
          >
            <LayoutDashboard className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-11 h-11 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl"
          >
            <FileSpreadsheet className="w-5 h-5" />
          </Button>
        </nav>

        <div className="flex flex-col items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-11 h-11 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl"
          >
            <Settings className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-11 h-11 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-card/80 backdrop-blur-sm border-b border-border/60 flex items-center justify-between px-6 sticky top-0 z-40">
          <div>
            <h1 className="text-xl font-semibold text-foreground">My Dashboard</h1>
            <p className="text-sm text-muted-foreground">Last updated: Just now</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setQuickInsightOpen(true)} className="h-9">
              <Zap className="w-4 h-4 mr-2" />
              Quick Insight
            </Button>
            <Button variant="outline" size="sm" onClick={handleAddChart} className="h-9">
              <Plus className="w-4 h-4 mr-2" />
              Add Chart
            </Button>
          </div>
        </header>

        <QuickInsightDialog
          open={quickInsightOpen}
          onOpenChange={setQuickInsightOpen}
          onSave={handleQuickInsightSave}
        />

        {/* Dashboard Canvas */}
        <div className="flex-1 flex relative">
          <div className="flex-1 p-6 overflow-y-auto scrollbar-thin">
            {charts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in">
                <div className="w-24 h-24 bg-muted rounded-3xl flex items-center justify-center mb-6">
                  <LayoutDashboard className="w-12 h-12 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-3">Your dashboard is empty</h2>
                <p className="text-muted-foreground mb-8 max-w-md text-lg">
                  Ask the AI assistant to create visualizations from your data.
                </p>
                <Button 
                  onClick={() => setIsChatOpen(true)} 
                  className="bg-gradient-ai shadow-glow-ai hover:opacity-90 h-12 px-6 text-base font-semibold"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start with AI
                </Button>
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
                
                {/* Add Chart Placeholder */}
                <button
                  onClick={handleAddChart}
                  className="min-h-[320px] border-2 border-dashed border-border/60 rounded-2xl flex flex-col items-center justify-center gap-4 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-accent/30 transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-muted rounded-xl flex items-center justify-center">
                    <Plus className="w-7 h-7" />
                  </div>
                  <div className="text-center">
                    <span className="font-semibold block">Add Chart</span>
                    <span className="text-sm">Use AI or create manually</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* AI Chat Panel */}
          <div 
            className={`transition-all duration-300 ease-out ${
              isChatOpen ? "w-[400px]" : "w-0"
            }`}
          >
            {isChatOpen && <AIChatPanel onSaveChart={handleSaveChart} />}
          </div>

          {/* Chat Toggle */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`fixed top-1/2 -translate-y-1/2 w-7 h-20 bg-card border border-border/60 rounded-l-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-300 shadow-soft z-50 ${
              isChatOpen ? "right-[400px]" : "right-0"
            }`}
          >
            {isChatOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </main>
    </div>
  );
};
