import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Save,
  FolderOpen,
  Star,
  StarOff,
  Trash2,
  MoreHorizontal,
  Clock,
  Search,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export interface SavedQuery {
  id: string;
  name: string;
  query: string;
  description?: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SavedQueriesPanelProps {
  onLoadQuery: (query: SavedQuery) => void;
  currentQuery: string;
}

const INITIAL_SAVED_QUERIES: SavedQuery[] = [
  {
    id: "1",
    name: "Monthly Revenue",
    query: `SELECT 
  DATE_TRUNC('month', created_at) as month,
  SUM(amount) as revenue
FROM orders
WHERE status = 'completed'
GROUP BY month
ORDER BY month DESC
LIMIT 12;`,
    description: "Monthly revenue aggregation",
    isFavorite: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  },
  {
    id: "2",
    name: "Top Customers",
    query: `SELECT 
  u.name,
  u.email,
  COUNT(o.id) as order_count,
  SUM(o.amount) as total_spent
FROM users u
JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name, u.email
ORDER BY total_spent DESC
LIMIT 10;`,
    description: "Top 10 customers by spending",
    isFavorite: true,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
  },
  {
    id: "3",
    name: "Product Inventory",
    query: `SELECT 
  p.name,
  p.category,
  p.price,
  COUNT(oi.id) as times_ordered
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.name, p.category, p.price
ORDER BY times_ordered DESC;`,
    isFavorite: false,
    createdAt: "2024-01-05",
    updatedAt: "2024-01-05",
  },
];

export const SavedQueriesPanel = ({
  onLoadQuery,
  currentQuery,
}: SavedQueriesPanelProps) => {
  const { toast } = useToast();
  const [savedQueries, setSavedQueries] = useState<SavedQuery[]>(INITIAL_SAVED_QUERIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [newQueryName, setNewQueryName] = useState("");
  const [newQueryDescription, setNewQueryDescription] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const filteredQueries = savedQueries.filter((q) => {
    const matchesSearch =
      q.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFavorite = showFavoritesOnly ? q.isFavorite : true;
    return matchesSearch && matchesFavorite;
  });

  const handleSaveQuery = () => {
    if (!newQueryName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your query",
        variant: "destructive",
      });
      return;
    }

    const newQuery: SavedQuery = {
      id: Date.now().toString(),
      name: newQueryName,
      query: currentQuery,
      description: newQueryDescription || undefined,
      isFavorite: false,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };

    setSavedQueries((prev) => [newQuery, ...prev]);
    setSaveDialogOpen(false);
    setNewQueryName("");
    setNewQueryDescription("");

    toast({
      title: "Query saved",
      description: `"${newQueryName}" has been saved to your library`,
    });
  };

  const handleToggleFavorite = (id: string) => {
    setSavedQueries((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, isFavorite: !q.isFavorite } : q
      )
    );
  };

  const handleDeleteQuery = (id: string) => {
    const query = savedQueries.find((q) => q.id === id);
    setSavedQueries((prev) => prev.filter((q) => q.id !== id));
    toast({
      title: "Query deleted",
      description: `"${query?.name}" has been removed`,
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-border/60">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <FolderOpen className="w-4 h-4" />
            Saved Queries
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={() => setSaveDialogOpen(true)}
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Save
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search queries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-8 text-sm"
          />
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant={showFavoritesOnly ? "secondary" : "ghost"}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          >
            <Star className={cn("w-3 h-3 mr-1", showFavoritesOnly && "fill-current")} />
            Favorites
          </Button>
        </div>
      </div>

      {/* Query List */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredQueries.length === 0 ? (
          <div className="text-center py-8">
            <FolderOpen className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">
              {searchQuery || showFavoritesOnly
                ? "No queries found"
                : "No saved queries yet"}
            </p>
            {!searchQuery && !showFavoritesOnly && (
              <Button
                variant="link"
                size="sm"
                className="mt-1"
                onClick={() => setSaveDialogOpen(true)}
              >
                Save your first query
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredQueries.map((query) => (
              <div
                key={query.id}
                className="group p-2.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => onLoadQuery(query)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(query.id);
                        }}
                        className="shrink-0"
                      >
                        {query.isFavorite ? (
                          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        ) : (
                          <StarOff className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100" />
                        )}
                      </button>
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-primary">
                        {query.name}
                      </p>
                    </div>
                    {query.description && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5 ml-5">
                        {query.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground/60 flex items-center gap-1 mt-1 ml-5">
                      <Clock className="w-3 h-3" />
                      {query.updatedAt}
                    </p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onLoadQuery(query)}>
                        <FolderOpen className="w-4 h-4 mr-2" />
                        Load Query
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(query.id);
                        }}
                      >
                        {query.isFavorite ? (
                          <>
                            <StarOff className="w-4 h-4 mr-2" />
                            Remove from Favorites
                          </>
                        ) : (
                          <>
                            <Star className="w-4 h-4 mr-2" />
                            Add to Favorites
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteQuery(query.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Query Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Query</DialogTitle>
            <DialogDescription>
              Save your current query for easy access later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Name *</label>
              <Input
                placeholder="e.g., Monthly Revenue Report"
                value={newQueryName}
                onChange={(e) => setNewQueryName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Description (optional)
              </label>
              <Input
                placeholder="Brief description of what this query does"
                value={newQueryDescription}
                onChange={(e) => setNewQueryDescription(e.target.value)}
              />
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Query Preview</p>
              <pre className="text-xs font-mono text-foreground overflow-x-auto max-h-24 whitespace-pre-wrap">
                {currentQuery.slice(0, 200)}
                {currentQuery.length > 200 && "..."}
              </pre>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveQuery}>
              <Save className="w-4 h-4 mr-2" />
              Save Query
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
