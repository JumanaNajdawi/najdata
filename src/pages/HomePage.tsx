import { Button } from "@/components/ui/button";
import { 
  Database, 
  Lightbulb, 
  LayoutDashboard, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";

const quickActions = [
  {
    icon: Database,
    title: "Connect Data",
    description: "Add a new database or upload files",
    path: "/databases/new",
    color: "bg-chart-1/10 text-primary",
  },
  {
    icon: Lightbulb,
    title: "Create Insight",
    description: "Build visualizations from your data",
    path: "/insights/new",
    color: "bg-chart-2/10 text-secondary",
  },
  {
    icon: Sparkles,
    title: "Ask AI",
    description: "Query data with natural language",
    path: "/ai-agent",
    color: "bg-ai-accent-light text-secondary",
  },
];

const recentInsights = [
  { id: "1", name: "Monthly Revenue Trend", type: "line", database: "Sales DB", updated: "2 hours ago" },
  { id: "2", name: "Top Products", type: "bar", database: "Inventory", updated: "Yesterday" },
  { id: "3", name: "Customer Segments", type: "pie", database: "CRM Data", updated: "3 days ago" },
];

const stats = [
  { label: "Databases", value: "4", icon: Database, change: "+1 this week" },
  { label: "Insights", value: "12", icon: Lightbulb, change: "+3 this week" },
  { label: "Dashboards", value: "3", icon: LayoutDashboard, change: "Active" },
];

export const HomePage = () => {
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <header className="h-16 bg-card/80 backdrop-blur-sm border-b border-border/60 flex items-center px-6 sticky top-0 z-40">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Here's what's happening with your data</p>
        </div>
      </header>

      <div className="p-6 space-y-8">
        {/* Quick Actions */}
        <section className="animate-fade-in">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.path}
                to={action.path}
                className="group bg-card rounded-2xl border border-border/60 p-5 hover:border-primary/30 hover:shadow-md transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-4`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all mt-3" />
              </Link>
            ))}
          </div>
        </section>

        {/* Stats Overview */}
        <section className="animate-fade-in" style={{ animationDelay: "100ms" }}>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
            Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-card rounded-xl border border-border/60 p-5 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
                <div className="ml-auto">
                  <span className="text-xs text-secondary font-medium flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Insights */}
        <section className="animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Recent Insights
            </h2>
            <Link
              to="/insights"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="bg-card rounded-xl border border-border/60 divide-y divide-border/60">
            {recentInsights.map((insight) => (
              <Link
                key={insight.id}
                to={`/insights/${insight.id}`}
                className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors first:rounded-t-xl last:rounded-b-xl"
              >
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-accent-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{insight.name}</p>
                  <p className="text-sm text-muted-foreground">{insight.database}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {insight.updated}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* AI Prompt Suggestion */}
        <section className="animate-fade-in" style={{ animationDelay: "300ms" }}>
          <div className="bg-gradient-to-r from-ai-accent-light to-accent/50 rounded-2xl border border-secondary/20 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-ai flex items-center justify-center shadow-glow-ai">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">
                  Try asking the AI Agent
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  "Show me the top 5 products by revenue this month" or "Compare sales between Q1 and Q2"
                </p>
                <Button asChild className="bg-gradient-ai shadow-glow-ai hover:opacity-90">
                  <Link to="/ai-agent">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Open AI Agent
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
