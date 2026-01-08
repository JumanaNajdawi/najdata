import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LayoutDashboard, Star, Lock, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Dashboard {
  id: string;
  name: string;
  description?: string;
  insightCount: number;
  visibility: "private" | "public";
  isMain?: boolean;
  starred?: boolean;
}

interface AddToDashboardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (dashboard: Dashboard) => void;
  dashboards: Dashboard[];
}

export const AddToDashboardDialog = ({
  open,
  onOpenChange,
  onSelect,
  dashboards,
}: AddToDashboardDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Dashboard</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] pr-4">
          <div className="space-y-2">
            {dashboards.map((dashboard) => (
              <Button
                key={dashboard.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start h-auto p-3 hover:bg-accent",
                  dashboard.isMain && "border border-primary/30"
                )}
                onClick={() => {
                  onSelect(dashboard);
                  onOpenChange(false);
                }}
              >
                <div className="flex items-center gap-3 w-full">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                      dashboard.isMain ? "bg-gradient-primary" : "bg-accent"
                    )}
                  >
                    <LayoutDashboard
                      className={cn(
                        "w-5 h-5",
                        dashboard.isMain
                          ? "text-primary-foreground"
                          : "text-accent-foreground"
                      )}
                    />
                  </div>

                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">
                        {dashboard.name}
                      </span>
                      {dashboard.isMain && (
                        <Badge variant="secondary" className="text-xs">
                          Main
                        </Badge>
                      )}
                      {dashboard.starred && (
                        <Star className="w-3 h-3 text-chart-4 fill-chart-4" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
