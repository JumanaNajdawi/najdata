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
import { Globe, Lock, LayoutDashboard, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

interface Dashboard {
  id: string;
  name: string;
  description?: string;
  visibility: "private" | "public";
  isMain?: boolean;
  starred?: boolean;
  color?: string;
}

interface CreateDashboardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (dashboard: Omit<Dashboard, "id">) => void;
  editingDashboard?: Dashboard | null;
}

const COLORS = [
  { value: "blue", label: "Blue", class: "bg-primary" },
  { value: "green", label: "Green", class: "bg-secondary" },
  { value: "purple", label: "Purple", class: "bg-chart-3" },
  { value: "orange", label: "Orange", class: "bg-chart-4" },
  { value: "red", label: "Red", class: "bg-chart-5" },
];

export const CreateDashboardDialog = ({
  open,
  onOpenChange,
  onSave,
  editingDashboard,
}: CreateDashboardDialogProps) => {
  const [name, setName] = useState(editingDashboard?.name || "");
  const [description, setDescription] = useState(editingDashboard?.description || "");
  const [visibility, setVisibility] = useState<"private" | "public">(
    editingDashboard?.visibility || "private"
  );
  const [isMain, setIsMain] = useState(editingDashboard?.isMain || false);
  const [color, setColor] = useState(editingDashboard?.color || "blue");

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      description: description.trim() || undefined,
      visibility,
      isMain,
      color,
    });
    // Reset form
    setName("");
    setDescription("");
    setVisibility("private");
    setIsMain(false);
    setColor("blue");
  };

  const isEditing = !!editingDashboard;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5" />
            {isEditing ? "Edit Dashboard" : "Create Dashboard"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your dashboard settings"
              : "Create a new dashboard to organize your insights"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Dashboard Name</Label>
            <Input
              id="name"
              placeholder="e.g., Sales Overview"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe what this dashboard shows..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

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
                  onClick={() => setColor(c.value)}
                  className={cn(
                    "w-10 h-10 rounded-lg transition-all",
                    c.class,
                    color === c.value
                      ? "ring-2 ring-offset-2 ring-primary ring-offset-background scale-110"
                      : "opacity-60 hover:opacity-100"
                  )}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Visibility */}
          <div className="space-y-2">
            <Label>Visibility</Label>
            <Select
              value={visibility}
              onValueChange={(v: "private" | "public") => setVisibility(v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Private - Only you can see
                  </div>
                </SelectItem>
                <SelectItem value="public">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Public - Anyone with link
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Main Dashboard */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <Label className="font-medium">Set as Main Dashboard</Label>
              <p className="text-sm text-muted-foreground">
                This will be your default landing dashboard
              </p>
            </div>
            <Switch checked={isMain} onCheckedChange={setIsMain} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            {isEditing ? "Save Changes" : "Create Dashboard"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
