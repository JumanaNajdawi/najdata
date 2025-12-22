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
  Clock,
  ChevronRight,
  BarChart2,
  LineChart,
  PieChart,
  Copy,
  Check,
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

const SAMPLE_QUERY = `SELECT 
  DATE_TRUNC('month', created_at) as month,
  SUM(amount) as revenue
FROM orders
WHERE status = 'completed'
GROUP BY month
ORDER BY month DESC
LIMIT 6;`;

const SAMPLE_RESULTS = [
  { month: "Jun 2024", revenue: 5500 },
  { month: "May 2024", revenue: 6000 },
  { month: "Apr 2024", revenue: 4500 },
  { month: "Mar 2024", revenue: 5000 },
  { month: "Feb 2024", revenue: 3000 },
  { month: "Jan 2024", revenue: 4000 },
];

const CHART_DATA = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 3000 },
  { name: "Mar", value: 5000 },
  { name: "Apr", value: 4500 },
  { name: "May", value: 6000 },
  { name: "Jun", value: 5500 },
];

const PIE_COLORS = ["hsl(230, 84%, 60%)", "hsl(162, 96%, 43%)", "hsl(280, 84%, 60%)", "hsl(35, 92%, 55%)", "hsl(350, 84%, 60%)"];

const QUERY_HISTORY = [
  { id: "1", query: "SELECT * FROM orders LIMIT 10", time: "2 min ago" },
  { id: "2", query: "SELECT COUNT(*) FROM users", time: "15 min ago" },
  { id: "3", query: "SELECT product_name, SUM(quantity) FROM order_items GROUP BY product_name", time: "1 hour ago" },
];

const TABLES = [
  { name: "orders", columns: ["id", "user_id", "amount", "status", "created_at"] },
  { name: "users", columns: ["id", "email", "name", "created_at"] },
  { name: "products", columns: ["id", "name", "price", "category"] },
  { name: "order_items", columns: ["id", "order_id", "product_id", "quantity"] },
];

type ChartType = "bar" | "line" | "pie" | "table";

export const SQLEditorPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [insightName, setInsightName] = useState("Untitled SQL Insight");
  const [query, setQuery] = useState(SAMPLE_QUERY);
  const [hasRun, setHasRun] = useState(true);
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [copied, setCopied] = useState(false);
  const [selectedDb] = useState("Sales DB");

  const handleRun = () => {
    setHasRun(true);
    toast({
      title: "Query executed",
      description: `${SAMPLE_RESULTS.length} rows returned in 0.12s`,
    });
  };

  const handleSave = () => {
    toast({
      title: "Insight saved",
      description: "Added to your Insights library",
    });
    navigate("/insights");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(query);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderChart = () => {
    if (chartType === "table") {
      return (
        <div className="overflow-auto max-h-64">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-2 text-left font-medium text-muted-foreground">Month</th>
                <th className="px-4 py-2 text-right font-medium text-muted-foreground">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_RESULTS.map((row, i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-2 text-foreground">{row.month}</td>
                  <td className="px-4 py-2 text-right text-foreground">${row.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={240}>
        {chartType === "line" ? (
          <RechartsLine data={CHART_DATA}>
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
        ) : chartType === "pie" ? (
          <RechartsPie data={CHART_DATA}>
            <Pie data={CHART_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={2} dataKey="value">
              {CHART_DATA.map((_, index) => (
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
          <BarChart data={CHART_DATA}>
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
          <Button variant="outline" size="sm" onClick={handleRun}>
            <Play className="w-4 h-4 mr-2" />
            Run Query
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Insight
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Schema Sidebar */}
        <aside className="w-56 border-r border-border/60 bg-card/50 flex flex-col shrink-0">
          {/* Database Selector */}
          <div className="p-3 border-b border-border/60">
            <div className="flex items-center gap-2 px-2 py-1.5 bg-accent/50 rounded-lg">
              <Database className="w-4 h-4 text-accent-foreground" />
              <span className="text-sm font-medium text-foreground">{selectedDb}</span>
            </div>
          </div>

          {/* Tables */}
          <div className="flex-1 overflow-y-auto p-3">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 px-1">
              Tables
            </h3>
            <div className="space-y-1">
              {TABLES.map((table) => (
                <details key={table.name} className="group">
                  <summary className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm cursor-pointer hover:bg-muted/50 list-none">
                    <ChevronRight className="w-3 h-3 text-muted-foreground group-open:rotate-90 transition-transform" />
                    <Table2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{table.name}</span>
                  </summary>
                  <div className="ml-6 mt-1 space-y-0.5">
                    {table.columns.map((col) => (
                      <button
                        key={col}
                        onClick={() => setQuery((q) => q + ` ${col}`)}
                        className="w-full text-left px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded"
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Query History */}
          <div className="border-t border-border/60 p-3">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 px-1">
              History
            </h3>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {QUERY_HISTORY.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setQuery(item.query)}
                  className="w-full text-left px-2 py-1.5 rounded-lg text-xs hover:bg-muted/50 group"
                >
                  <p className="text-foreground truncate group-hover:text-primary">{item.query}</p>
                  <p className="text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {item.time}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Editor Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* SQL Editor */}
          <div className="flex-1 p-4 bg-gradient-surface">
            <div className="h-full bg-card rounded-xl border border-border/60 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-4 py-2 border-b border-border/60 bg-muted/30">
                <span className="text-xs font-medium text-muted-foreground">SQL Query</span>
                <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 px-2">
                  {copied ? <Check className="w-3.5 h-3.5 text-secondary" /> : <Copy className="w-3.5 h-3.5" />}
                </Button>
              </div>
              <textarea
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setHasRun(false);
                }}
                className="flex-1 w-full p-4 font-mono text-sm bg-transparent text-foreground resize-none focus:outline-none"
                placeholder="Write your SQL query here..."
                spellCheck={false}
              />
            </div>
          </div>

          {/* Results Panel */}
          {hasRun && (
            <div className="h-80 border-t border-border/60 bg-card flex flex-col shrink-0">
              <div className="flex items-center justify-between px-4 py-2 border-b border-border/60">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-foreground">Results</span>
                  <span className="text-xs text-muted-foreground">{SAMPLE_RESULTS.length} rows</span>
                </div>
                <div className="flex items-center gap-1 border border-border rounded-lg p-0.5">
                  {[
                    { type: "bar" as const, icon: BarChart2 },
                    { type: "line" as const, icon: LineChart },
                    { type: "pie" as const, icon: PieChart },
                    { type: "table" as const, icon: Table2 },
                  ].map((opt) => (
                    <Button
                      key={opt.type}
                      variant={chartType === opt.type ? "secondary" : "ghost"}
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => setChartType(opt.type)}
                    >
                      <opt.icon className="w-4 h-4" />
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex-1 p-4 overflow-auto">{renderChart()}</div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
