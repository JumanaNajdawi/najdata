import { Button } from "@/components/ui/button";
import {
  Workflow,
  Code2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  MousePointerClick,
  Terminal,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface CreationMethod {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  path: string;
  recommended?: boolean;
  color: string;
  bgColor: string;
}

const methods: CreationMethod[] = [
  {
    id: "workflow",
    title: "Workflow Builder",
    description: "Drag-and-drop visual editor for building insights without code",
    icon: Workflow,
    features: [
      "Visual block-based interface",
      "Pre-built transformation blocks",
      "Real-time preview",
      "No coding required",
    ],
    path: "/insights/new/workflow",
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
  },
  {
    id: "sql",
    title: "SQL Editor",
    description: "Write custom SQL queries for advanced data analysis",
    icon: Code2,
    features: [
      "Full SQL support",
      "Auto-complete suggestions",
      "Query history",
      "Best for complex queries",
    ],
    path: "/insights/new/sql",
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
  {
    id: "ai",
    title: "AI Agent",
    description: "Describe what you want in natural language and let AI create it",
    icon: Sparkles,
    features: [
      "Natural language input",
      "Automatic chart generation",
      "Smart suggestions",
      "Fastest way to insights",
    ],
    path: "/ai-agent",
    recommended: true,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
];

export const CreateInsightPage = () => {
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <header className="h-16 bg-card/80 backdrop-blur-sm border-b border-border/60 flex items-center px-6 sticky top-0 z-40">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link to="/insights">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Create Insight</h1>
          <p className="text-sm text-muted-foreground">Choose how you want to build your insight</p>
        </div>
      </header>

      <div className="p-6 max-w-4xl mx-auto">
        {/* Method Selection */}
        <div className="grid grid-cols-1 gap-6 animate-fade-in">
          {methods.map((method, index) => (
            <Link
              key={method.id}
              to={method.path}
              className={cn(
                "group relative bg-card rounded-2xl border-2 p-6 transition-all duration-300",
                method.recommended
                  ? "border-secondary/40 hover:border-secondary hover:shadow-glow-ai"
                  : "border-border/60 hover:border-primary/40 hover:shadow-md",
                "animate-slide-up"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {method.recommended && (
                <div className="absolute -top-3 left-6">
                  <span className="bg-gradient-ai text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full shadow-glow-ai">
                    Recommended
                  </span>
                </div>
              )}

              <div className="flex items-start gap-5">
                {/* Icon */}
                <div
                  className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center shrink-0",
                    method.bgColor
                  )}
                >
                  <method.icon className={cn("w-7 h-7", method.color)} />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {method.title}
                    </h3>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-muted-foreground mb-4">{method.description}</p>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-2">
                    {method.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Help Section */}
        <div
          className="mt-8 bg-muted/30 rounded-xl border border-border/60 p-6 animate-fade-in"
          style={{ animationDelay: "400ms" }}
        >
          <h4 className="font-semibold text-foreground mb-4">Not sure which to choose?</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-chart-4/10 flex items-center justify-center shrink-0">
                <MousePointerClick className="w-4 h-4 text-chart-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Workflow Builder</p>
                <p className="text-xs text-muted-foreground">
                  Best for non-technical users who prefer visual interfaces
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-chart-3/10 flex items-center justify-center shrink-0">
                <Terminal className="w-4 h-4 text-chart-3" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">SQL Editor</p>
                <p className="text-xs text-muted-foreground">
                  Best for data analysts familiar with SQL
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">AI Agent</p>
                <p className="text-xs text-muted-foreground">
                  Best for quick exploration and natural language queries
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
