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
  ChevronRight
} from "lucide-react";
import { AIChatPanel } from "./AIChatPanel";
import { ChartCard } from "./ChartCard";
import { useToast } from "@/hooks/use-toast";

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
];

export const DashboardPage = () => {
  const [charts, setCharts] = useState(INITIAL_CHARTS);
  const [isChatOpen, setIsChatOpen] = useState(true);
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

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Navigation */}
      <aside className="w-16 bg-card border-r border-border flex flex-col items-center py-4 gap-2">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mb-4">
          <BarChart3 className="w-5 h-5 text-primary-foreground" />
        </div>
        
        <nav className="flex-1 flex flex-col items-center gap-1">
          <Button variant="ghost" size="icon" className="w-10 h-10 bg-accent text-accent-foreground">
            <LayoutDashboard className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="w-10 h-10 text-muted-foreground hover:text-foreground">
            <FileSpreadsheet className="w-5 h-5" />
          </Button>
        </nav>

        <div className="flex flex-col items-center gap-1">
          <Button variant="ghost" size="icon" className="w-10 h-10 text-muted-foreground hover:text-foreground">
            <Settings className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="w-10 h-10 text-muted-foreground hover:text-foreground">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 bg-card border-b border-border flex items-center justify-between px-6">
          <div>
            <h1 className="text-lg font-semibold text-foreground">My Dashboard</h1>
            <p className="text-xs text-muted-foreground">Last updated: Just now</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleAddChart}>
              <Plus className="w-4 h-4 mr-1" />
              Add Chart
            </Button>
          </div>
        </header>

        {/* Dashboard Canvas */}
        <div className="flex-1 flex">
          <div className="flex-1 p-6 overflow-y-auto">
            {charts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mb-4">
                  <LayoutDashboard className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">Your dashboard is empty</h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Ask the AI assistant to create visualizations from your data. 
                  Try "Show me monthly revenue trends"
                </p>
                <Button variant="ai" onClick={() => setIsChatOpen(true)}>
                  Start with AI
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {charts.map((chart, index) => (
                  <div 
                    key={chart.id} 
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
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
                  className="min-h-[300px] border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                >
                  <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
                    <Plus className="w-6 h-6" />
                  </div>
                  <span className="font-medium">Add Chart</span>
                  <span className="text-sm">Use AI or create manually</span>
                </button>
              </div>
            )}
          </div>

          {/* AI Chat Panel */}
          <div 
            className={`transition-all duration-300 ease-in-out ${
              isChatOpen ? "w-[380px]" : "w-0"
            }`}
          >
            {isChatOpen && <AIChatPanel onSaveChart={handleSaveChart} />}
          </div>

          {/* Chat Toggle */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-16 bg-card border border-border border-r-0 rounded-l-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            style={{ right: isChatOpen ? "380px" : "0" }}
          >
            {isChatOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </main>
    </div>
  );
};
