import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  Send,
  Save,
  BarChart2,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Edit,
  Code2,
  Workflow,
  LayoutDashboard,
  Palette,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useToast } from "@/hooks/use-toast";
import { VisualizationDialog } from "@/components/workflow/VisualizationDialog";
import { AddToDashboardDialog } from "@/components/dashboard/AddToDashboardDialog";

interface Dashboard {
  id: string;
  name: string;
  description?: string;
  insightCount: number;
  visibility: "private" | "public";
  isMain?: boolean;
  starred?: boolean;
}

const DASHBOARDS: Dashboard[] = [
  {
    id: "main",
    name: "Main Dashboard",
    description: "Your primary workspace for all insights",
    insightCount: 8,
    visibility: "private",
    isMain: true,
    starred: true,
  },
  {
    id: "sales",
    name: "Sales Overview",
    description: "Revenue and sales performance metrics",
    insightCount: 5,
    visibility: "public",
    starred: true,
  },
  {
    id: "marketing",
    name: "Marketing Analytics",
    description: "Campaign performance and user acquisition",
    insightCount: 4,
    visibility: "private",
  },
  {
    id: "product",
    name: "Product Metrics",
    description: "User engagement and feature adoption",
    insightCount: 6,
    visibility: "private",
  },
];

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  chart?: {
    type: "bar" | "line" | "pie";
    data: any[];
  };
}

const SAMPLE_DATA = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 3000 },
  { name: "Mar", value: 5000 },
  { name: "Apr", value: 4500 },
  { name: "May", value: 6000 },
  { name: "Jun", value: 5500 },
];

const PIE_DATA = [
  { name: "Electronics", value: 35 },
  { name: "Clothing", value: 25 },
  { name: "Food", value: 20 },
  { name: "Books", value: 12 },
  { name: "Other", value: 8 },
];

const CHART_COLORS = [
  "hsl(230, 84%, 60%)",
  "hsl(162, 96%, 43%)",
  "hsl(280, 84%, 60%)",
  "hsl(35, 92%, 55%)",
  "hsl(350, 84%, 60%)",
];

const suggestedQueries = [
  "Show monthly revenue trends",
  "What are the top 5 products by sales?",
  "Compare Q1 vs Q2 performance",
  "Show customer distribution by segment",
  "What's the average order value?",
];

export const AIAgentPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm your AI data analyst. I can help you explore your data, create visualizations, and answer questions. Try asking me something like:\n\n• \"Show monthly revenue trends\"\n• \"What are the top products by sales?\"\n• \"Compare this quarter to last quarter\"",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [visualizationOpen, setVisualizationOpen] = useState(false);
  const [selectedChartData, setSelectedChartData] = useState<any[]>([]);
  const [dashboardDialogOpen, setDashboardDialogOpen] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIResponse = (query: string): Message => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes("revenue") || lowerQuery.includes("trend")) {
      return {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "Here's the monthly revenue trend for the past 6 months. Revenue peaked in May at $6,000 and shows an overall upward trend of 37.5%.",
        chart: {
          type: "line",
          data: SAMPLE_DATA,
        },
      };
    }

    if (
      lowerQuery.includes("top") ||
      lowerQuery.includes("product") ||
      lowerQuery.includes("category") ||
      lowerQuery.includes("distribution") ||
      lowerQuery.includes("segment")
    ) {
      return {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "Here's the breakdown by category. Electronics leads with 35% of total sales, followed by Clothing at 25%.",
        chart: {
          type: "pie",
          data: PIE_DATA,
        },
      };
    }

    if (lowerQuery.includes("compare") || lowerQuery.includes("q1") || lowerQuery.includes("q2")) {
      return {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "Here's a quarterly comparison. You can see consistent growth with Q2 outperforming Q1 by 25%.",
        chart: {
          type: "bar",
          data: [
            { name: "Q1", value: 12000 },
            { name: "Q2", value: 15000 },
            { name: "Q3", value: 18000 },
            { name: "Q4", value: 22000 },
          ],
        },
      };
    }

    return {
      id: Date.now().toString(),
      role: "assistant",
      content:
        "I analyzed your data but need a bit more context. Try asking about:\n\n• Revenue trends over time\n• Top products or categories\n• Comparisons between periods\n• Customer segments",
    };
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const aiResponse = simulateAIResponse(input);
    setMessages((prev) => [...prev, aiResponse]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSaveToLibrary = () => {
    toast({
      title: "Insight saved",
      description: "Added to your Insights library",
    });
  };

  const handleAddToDashboard = () => {
    setDashboardDialogOpen(true);
  };

  const handleDashboardSelect = (dashboard: Dashboard) => {
    toast({
      title: "Added to Dashboard",
      description: `Insight added to "${dashboard.name}"`,
    });
  };

  const handleCustomizeChart = (chartData: any[]) => {
    setSelectedChartData(chartData);
    setVisualizationOpen(true);
  };

  const renderChart = (chart: Message["chart"]) => {
    if (!chart) return null;

    return (
      <div className="mt-4 p-4 bg-background rounded-xl border border-border">
        <ResponsiveContainer width="100%" height={240}>
          {chart.type === "bar" ? (
            <BarChart data={chart.data}>
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
          ) : chart.type === "line" ? (
            <LineChart data={chart.data}>
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(162, 96%, 43%)"
                strokeWidth={2}
                dot={{ fill: "hsl(162, 96%, 43%)", strokeWidth: 2 }}
              />
            </LineChart>
          ) : (
            <PieChart>
              <Pie
                data={chart.data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {chart.data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          )}
        </ResponsiveContainer>

        {/* Chart Actions */}
        <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => handleCustomizeChart(chart.data)}>
            <Palette className="w-4 h-4 mr-2" />
            Customize
          </Button>
          <Button variant="outline" size="sm" onClick={handleSaveToLibrary}>
            <Save className="w-4 h-4 mr-2" />
            Save to Library
          </Button>
          <Button variant="outline" size="sm" onClick={handleAddToDashboard}>
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Add to Dashboard
          </Button>
          <Button variant="outline" size="sm">
            <Workflow className="w-4 h-4 mr-2" />
            Edit in Workflow
          </Button>
          <Button variant="outline" size="sm">
            <Code2 className="w-4 h-4 mr-2" />
            Edit SQL
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-card/80 backdrop-blur-sm border-b border-border/60 flex items-center px-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-ai flex items-center justify-center shadow-glow-ai">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">AI Agent</h1>
            <p className="text-sm text-muted-foreground">Ask questions about your data</p>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                } animate-slide-up`}
              >
                <div
                  className={`max-w-[85%] ${
                    message.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.chart && renderChart(message.chart)}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="chat-bubble-ai">
                  <div className="flex items-center gap-1">
                    <div
                      className="w-2 h-2 bg-secondary rounded-full animate-typing"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-secondary rounded-full animate-typing"
                      style={{ animationDelay: "200ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-secondary rounded-full animate-typing"
                      style={{ animationDelay: "400ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Suggestions Sidebar */}
        <div className="w-72 border-l border-border/60 bg-card/50 p-4 hidden lg:block overflow-y-auto">
          <h3 className="text-sm font-medium text-foreground mb-3">Suggested Questions</h3>
          <div className="space-y-2">
            {suggestedQueries.map((query, i) => (
              <button
                key={i}
                onClick={() => setInput(query)}
                className="w-full text-left p-3 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border/60 bg-card/80 backdrop-blur-sm p-4 shrink-0">
        <div className="max-w-3xl mx-auto">
          {/* Quick Actions */}
          <div className="flex gap-2 mb-3 overflow-x-auto pb-2 lg:hidden">
            {[
              { icon: LineChartIcon, label: "Revenue trends" },
              { icon: PieChartIcon, label: "Top categories" },
              { icon: BarChart2, label: "Compare periods" },
            ].map((action, i) => (
              <button
                key={i}
                onClick={() => setInput(action.label)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-accent rounded-full text-xs font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
              >
                <action.icon className="w-3.5 h-3.5" />
                {action.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask anything about your data..."
              className="flex-1 h-12"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="h-12 px-6 bg-gradient-ai shadow-glow-ai hover:opacity-90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Visualization Dialog */}
      <VisualizationDialog
        open={visualizationOpen}
        onOpenChange={setVisualizationOpen}
        initialDataSource="results"
        resultsData={selectedChartData}
        resultsColumns={selectedChartData.length > 0 ? Object.keys(selectedChartData[0]) : []}
      />

      {/* Add to Dashboard Dialog */}
      <AddToDashboardDialog
        open={dashboardDialogOpen}
        onOpenChange={setDashboardDialogOpen}
        onSelect={handleDashboardSelect}
        dashboards={DASHBOARDS}
      />
    </div>
  );
};
