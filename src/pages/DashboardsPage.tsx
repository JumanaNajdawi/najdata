import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LayoutDashboard,
  Plus,
  Search,
  Grid3X3,
  List,
  MoreHorizontal,
  Lock,
  Globe,
  Clock,
  Star,
  Trash2,
  Copy,
  Edit,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "list";

interface Dashboard {
  id: string;
  name: string;
  description?: string;
  insightCount: number;
  visibility: "private" | "public";
  isMain?: boolean;
  starred?: boolean;
  updatedAt: string;
  createdAt: string;
}

const SAMPLE_DASHBOARDS: Dashboard[] = [
  {
    id: "main",
    name: "Main Dashboard",
    description: "Your primary workspace for all insights",
    insightCount: 8,
    visibility: "private",
    isMain: true,
    starred: true,
    updatedAt: "Just now",
    createdAt: "2024-01-01",
  },
  {
    id: "sales",
    name: "Sales Overview",
    description: "Revenue and sales performance metrics",
    insightCount: 5,
    visibility: "public",
    starred: true,
    updatedAt: "2 hours ago",
    createdAt: "2024-01-10",
  },
  {
    id: "marketing",
    name: "Marketing Analytics",
    description: "Campaign performance and user acquisition",
    insightCount: 4,
    visibility: "private",
    updatedAt: "Yesterday",
    createdAt: "2024-01-12",
  },
  {
    id: "product",
    name: "Product Metrics",
    description: "User engagement and feature adoption",
    insightCount: 6,
    visibility: "private",
    updatedAt: "3 days ago",
    createdAt: "2024-01-15",
  },
];

export const DashboardsPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [dashboards] = useState<Dashboard[]>(SAMPLE_DASHBOARDS);

  const filteredDashboards = dashboards.filter((dashboard) =>
    dashboard.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const DashboardCard = ({ dashboard }: { dashboard: Dashboard }) => (
    <div
      className={cn(
        "group bg-card rounded-xl border p-5 hover:shadow-md transition-all duration-300",
        dashboard.isMain
          ? "border-primary/30 bg-gradient-to-br from-card to-accent/20"
          : "border-border/60 hover:border-primary/30"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              dashboard.isMain ? "bg-gradient-primary" : "bg-accent"
            )}
          >
            <LayoutDashboard
              className={cn(
                "w-5 h-5",
                dashboard.isMain ? "text-primary-foreground" : "text-accent-foreground"
              )}
            />
          </div>
          {dashboard.isMain && (
            <Badge variant="secondary" className="text-xs">
              Main
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1">
          {dashboard.starred && (
            <Star className="w-4 h-4 text-chart-4 fill-chart-4" />
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              {dashboard.visibility === "public" && (
                <DropdownMenuItem>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Share Link
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                disabled={dashboard.isMain}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <Link to={`/dashboards/${dashboard.id}`}>
        <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
          {dashboard.name}
        </h3>
        {dashboard.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {dashboard.description}
          </p>
        )}
      </Link>

      {/* Meta */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/60">
        <div className="flex items-center gap-3">
          <span>{dashboard.insightCount} insights</span>
          <span className="flex items-center gap-1">
            {dashboard.visibility === "public" ? (
              <>
                <Globe className="w-3 h-3" />
                Public
              </>
            ) : (
              <>
                <Lock className="w-3 h-3" />
                Private
              </>
            )}
          </span>
        </div>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {dashboard.updatedAt}
        </span>
      </div>
    </div>
  );

  const DashboardRow = ({ dashboard }: { dashboard: Dashboard }) => (
    <Link
      to={`/dashboards/${dashboard.id}`}
      className="group flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors border-b border-border/60 last:border-b-0"
    >
      <div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
          dashboard.isMain ? "bg-gradient-primary" : "bg-accent"
        )}
      >
        <LayoutDashboard
          className={cn(
            "w-5 h-5",
            dashboard.isMain ? "text-primary-foreground" : "text-accent-foreground"
          )}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
            {dashboard.name}
          </p>
          {dashboard.isMain && (
            <Badge variant="secondary" className="text-xs">
              Main
            </Badge>
          )}
          {dashboard.starred && (
            <Star className="w-3.5 h-3.5 text-chart-4 fill-chart-4" />
          )}
        </div>
        {dashboard.description && (
          <p className="text-sm text-muted-foreground truncate">
            {dashboard.description}
          </p>
        )}
      </div>

      <div className="hidden md:block text-sm text-muted-foreground">
        {dashboard.insightCount} insights
      </div>

      <div className="hidden lg:flex items-center gap-1 text-sm text-muted-foreground">
        {dashboard.visibility === "public" ? (
          <>
            <Globe className="w-3.5 h-3.5" />
            Public
          </>
        ) : (
          <>
            <Lock className="w-3.5 h-3.5" />
            Private
          </>
        )}
      </div>

      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Clock className="w-3.5 h-3.5" />
        {dashboard.updatedAt}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={(e) => e.preventDefault()}
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Copy className="w-4 h-4 mr-2" />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive"
            disabled={dashboard.isMain}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Link>
  );

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <header className="h-16 bg-card/80 backdrop-blur-sm border-b border-border/60 flex items-center justify-between px-6 sticky top-0 z-40">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Dashboards</h1>
          <p className="text-sm text-muted-foreground">
            {dashboards.length} dashboards
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Dashboard
        </Button>
      </header>

      <div className="p-6">
        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search dashboards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center border border-border rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        {filteredDashboards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <LayoutDashboard className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {searchQuery ? "No dashboards found" : "No dashboards yet"}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-sm">
              {searchQuery
                ? "Try adjusting your search query"
                : "Create your first dashboard to organize your insights"}
            </p>
            {!searchQuery && (
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Dashboard
              </Button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-fade-in">
            {filteredDashboards.map((dashboard, index) => (
              <div
                key={dashboard.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <DashboardCard dashboard={dashboard} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border/60 animate-fade-in">
            {filteredDashboards.map((dashboard) => (
              <DashboardRow key={dashboard.id} dashboard={dashboard} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
