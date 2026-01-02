import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Globe,
  Lock,
  Settings,
  Palette,
  Layout,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardSettings {
  name: string;
  description?: string;
  visibility: "private" | "public";
  color: string;
  autoRefresh: boolean;
  refreshInterval: number;
  layout: "grid" | "masonry" | "freeform";
}

interface DashboardSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: DashboardSettings;
  onSave: (settings: DashboardSettings) => void;
  onDelete: () => void;
}

const COLORS = [
  { value: "blue", label: "Blue", class: "bg-primary" },
  { value: "green", label: "Green", class: "bg-secondary" },
  { value: "purple", label: "Purple", class: "bg-chart-3" },
  { value: "orange", label: "Orange", class: "bg-chart-4" },
  { value: "red", label: "Red", class: "bg-chart-5" },
];

const LAYOUTS = [
  { value: "grid", label: "Grid", description: "Fixed 2-column layout" },
  { value: "masonry", label: "Masonry", description: "Variable height cards" },
  { value: "freeform", label: "Freeform", description: "Drag anywhere" },
];

export const DashboardSettingsDialog = ({
  open,
  onOpenChange,
  settings,
  onSave,
  onDelete,
}: DashboardSettingsDialogProps) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSave = () => {
    onSave(localSettings);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Dashboard Settings
          </DialogTitle>
          <DialogDescription>
            Configure your dashboard preferences
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="mt-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="settings-name">Dashboard Name</Label>
              <Input
                id="settings-name"
                value={localSettings.name}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, name: e.target.value })
                }
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="settings-description">Description</Label>
              <Textarea
                id="settings-description"
                value={localSettings.description || ""}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, description: e.target.value })
                }
                rows={3}
              />
            </div>

            {/* Visibility */}
            <div className="space-y-2">
              <Label>Visibility</Label>
              <Select
                value={localSettings.visibility}
                onValueChange={(v: "private" | "public") =>
                  setLocalSettings({ ...localSettings, visibility: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Private
                    </div>
                  </SelectItem>
                  <SelectItem value="public">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Public
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4 mt-4">
            {/* Color */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Theme Color
              </Label>
              <div className="flex gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() =>
                      setLocalSettings({ ...localSettings, color: c.value })
                    }
                    className={cn(
                      "w-10 h-10 rounded-lg transition-all",
                      c.class,
                      localSettings.color === c.value
                        ? "ring-2 ring-offset-2 ring-primary ring-offset-background scale-110"
                        : "opacity-60 hover:opacity-100"
                    )}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            {/* Layout */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Layout className="w-4 h-4" />
                Layout Style
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {LAYOUTS.map((l) => (
                  <button
                    key={l.value}
                    onClick={() =>
                      setLocalSettings({
                        ...localSettings,
                        layout: l.value as DashboardSettings["layout"],
                      })
                    }
                    className={cn(
                      "p-3 rounded-lg border text-left transition-all",
                      localSettings.layout === l.value
                        ? "border-primary bg-accent"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <span className="font-medium text-sm">{l.label}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {l.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 mt-4">
            {/* Auto Refresh */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label className="font-medium">Auto Refresh</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically refresh dashboard data
                  </p>
                </div>
              </div>
              <Switch
                checked={localSettings.autoRefresh}
                onCheckedChange={(v) =>
                  setLocalSettings({ ...localSettings, autoRefresh: v })
                }
              />
            </div>

            {localSettings.autoRefresh && (
              <div className="space-y-2 pl-4">
                <Label>Refresh Interval</Label>
                <Select
                  value={localSettings.refreshInterval.toString()}
                  onValueChange={(v) =>
                    setLocalSettings({
                      ...localSettings,
                      refreshInterval: parseInt(v),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">Every 30 seconds</SelectItem>
                    <SelectItem value="60">Every minute</SelectItem>
                    <SelectItem value="300">Every 5 minutes</SelectItem>
                    <SelectItem value="900">Every 15 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Danger Zone */}
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium text-destructive mb-3">
                Danger Zone
              </h4>
              {!confirmDelete ? (
                <Button
                  variant="outline"
                  className="text-destructive border-destructive/50 hover:bg-destructive/10"
                  onClick={() => setConfirmDelete(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Dashboard
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Are you sure?
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      onDelete();
                      onOpenChange(false);
                    }}
                  >
                    Yes, Delete
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirmDelete(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
