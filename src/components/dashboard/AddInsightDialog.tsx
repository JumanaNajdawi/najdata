import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  Table,
  Plus,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface Insight {
  id: string;
  name: string;
  type: "bar" | "line" | "pie" | "area" | "table" | "kpi";
  description?: string;
  lastUpdated: string;
}

const SAMPLE_INSIGHTS: Insight[] = [
  {
    id: "1",
    name: "Monthly Revenue Trend",
    type: "line",
    description: "Revenue over the past 12 months",
    lastUpdated: "2 hours ago",
  },
  {
    id: "2",
    name: "Sales by Category",
    type: "pie",
    description: "Distribution of sales across categories",
    lastUpdated: "1 day ago",
  },
  {
    id: "3",
    name: "Quarterly Performance",
    type: "bar",
    description: "Quarterly revenue comparison",
    lastUpdated: "3 days ago",
  },
  {
    id: "4",
    name: "Customer Growth",
    type: "area",
    description: "Customer acquisition over time",
    lastUpdated: "1 week ago",
  },
  {
    id: "5",
    name: "Top Products",
    type: "table",
    description: "Best selling products this month",
    lastUpdated: "Just now",
  },
  {
    id: "6",
    name: "Total Revenue",
    type: "kpi",
    description: "Current month revenue",
    lastUpdated: "Live",
  },
];

const CHART_ICONS: Record<Insight["type"], React.ElementType> = {
  bar: BarChart3,
  line: LineChart,
  pie: PieChart,
  area: TrendingUp,
  table: Table,
  kpi: TrendingUp,
};

interface AddInsightDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddInsight: (insight: Insight) => void;
}

export const AddInsightDialog = ({
  open,
  onOpenChange,
  onAddInsight,
}: AddInsightDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInsights, setSelectedInsights] = useState<string[]>([]);

  const filteredInsights = SAMPLE_INSIGHTS.filter(
    (insight) =>
      insight.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insight.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleInsight = (id: string) => {
    setSelectedInsights((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAddSelected = () => {
    selectedInsights.forEach((id) => {
      const insight = SAMPLE_INSIGHTS.find((i) => i.id === id);
      if (insight) {
        onAddInsight(insight);
      }
    });
    setSelectedInsights([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Add Insights to Dashboard</DialogTitle>
          <DialogDescription>
            Select existing insights or create new ones
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="library" className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="library">From Library</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="mt-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search insights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Insights Grid */}
            <div className="grid gap-2 max-h-[300px] overflow-y-auto pr-2">
              {filteredInsights.map((insight) => {
                const Icon = CHART_ICONS[insight.type];
                const isSelected = selectedInsights.includes(insight.id);
                return (
                  <button
                    key={insight.id}
                    onClick={() => toggleInsight(insight.id)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border text-left transition-all",
                      isSelected
                        ? "border-primary bg-accent"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                        isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{insight.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {insight.description}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {insight.lastUpdated}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Add Selected Button */}
            {selectedInsights.length > 0 && (
              <Button onClick={handleAddSelected} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add {selectedInsights.length} Insight
                {selectedInsights.length > 1 ? "s" : ""}
              </Button>
            )}
          </TabsContent>

          <TabsContent value="create" className="mt-4">
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/insights/new/workflow"
                className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all text-center"
                onClick={() => onOpenChange(false)}
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-muted flex items-center justify-center">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h4 className="font-medium">Workflow Builder</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Visual drag-and-drop
                </p>
              </Link>

              <Link
                to="/insights/new/sql"
                className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all text-center"
                onClick={() => onOpenChange(false)}
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-muted flex items-center justify-center">
                  <Table className="w-6 h-6" />
                </div>
                <h4 className="font-medium">SQL Editor</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Write custom queries
                </p>
              </Link>

              <Link
                to="/ai-agent"
                className="col-span-2 p-4 rounded-lg border border-primary/30 bg-gradient-to-r from-primary/5 to-chart-3/5 hover:from-primary/10 hover:to-chart-3/10 transition-all text-center"
                onClick={() => onOpenChange(false)}
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-ai flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-medium">AI Agent</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Describe what you want in natural language
                </p>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
