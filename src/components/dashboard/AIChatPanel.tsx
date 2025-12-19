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
  Table,
  X
} from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  chart?: {
    type: "bar" | "line" | "pie" | "table";
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

interface AIChatPanelProps {
  onSaveChart?: (chart: any) => void;
}

export const AIChatPanel = ({ onSaveChart }: AIChatPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm your AI data analyst. Ask me anything about your data, like \"Show monthly revenue trends\" or \"What are the top 5 products by sales?\"",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIResponse = (query: string): Message => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes("revenue") || lowerQuery.includes("sales") || lowerQuery.includes("trend")) {
      return {
        id: Date.now().toString(),
        role: "assistant",
        content: "Here's the monthly revenue trend for the past 6 months. Revenue peaked in May at $6,000 and shows an overall upward trend of 37.5%.",
        chart: {
          type: "line",
          data: SAMPLE_DATA,
        },
      };
    }
    
    if (lowerQuery.includes("top") || lowerQuery.includes("product") || lowerQuery.includes("category")) {
      return {
        id: Date.now().toString(),
        role: "assistant",
        content: "Here are the top categories by sales distribution. Electronics leads with 35% of total sales, followed by Clothing at 25%.",
        chart: {
          type: "pie",
          data: PIE_DATA,
        },
      };
    }
    
    if (lowerQuery.includes("compare") || lowerQuery.includes("bar")) {
      return {
        id: Date.now().toString(),
        role: "assistant",
        content: "Here's a comparison of monthly performance. You can see consistent growth with a slight dip in February.",
        chart: {
          type: "bar",
          data: SAMPLE_DATA,
        },
      };
    }

    return {
      id: Date.now().toString(),
      role: "assistant",
      content: "I analyzed your data. Could you be more specific? Try asking about:\n• Revenue trends over time\n• Top products or categories\n• Comparisons between periods",
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

    // Simulate AI thinking
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

  const renderChart = (chart: Message["chart"]) => {
    if (!chart) return null;

    return (
      <div className="mt-4 p-4 bg-background rounded-xl border border-border">
        <ResponsiveContainer width="100%" height={200}>
          {chart.type === "bar" ? (
            <BarChart data={chart.data}>
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(230, 84%, 60%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : chart.type === "line" ? (
            <LineChart data={chart.data}>
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip />
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
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chart.data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          )}
        </ResponsiveContainer>

        <Button 
          variant="ai" 
          size="sm" 
          className="mt-3 w-full"
          onClick={() => onSaveChart?.(chart)}
        >
          <Save className="w-4 h-4 mr-2" />
          Save to Dashboard
        </Button>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-ai/10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-ai" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">AI Analyst</h2>
          <p className="text-xs text-muted-foreground">Ask questions about your data</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-slide-up`}
          >
            <div
              className={`max-w-[90%] ${
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
                <div className="w-2 h-2 bg-ai rounded-full animate-typing" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-ai rounded-full animate-typing" style={{ animationDelay: "200ms" }} />
                <div className="w-2 h-2 bg-ai rounded-full animate-typing" style={{ animationDelay: "400ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-t border-border">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { icon: LineChartIcon, label: "Revenue trends" },
            { icon: PieChartIcon, label: "Top categories" },
            { icon: BarChart2, label: "Compare months" },
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
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your data..."
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={!input.trim() || isTyping}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
