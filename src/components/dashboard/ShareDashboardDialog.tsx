import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  Copy,
  Check,
  Globe,
  Lock,
  Mail,
  Link2,
  Users,
  Eye,
  Edit3,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface SharedUser {
  email: string;
  permission: "view" | "edit";
}

interface ShareDashboardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dashboardName: string;
  isPublic: boolean;
  onVisibilityChange: (isPublic: boolean) => void;
}

export const ShareDashboardDialog = ({
  open,
  onOpenChange,
  dashboardName,
  isPublic,
  onVisibilityChange,
}: ShareDashboardDialogProps) => {
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState<"view" | "edit">("view");
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([
    { email: "john@example.com", permission: "edit" },
    { email: "jane@example.com", permission: "view" },
  ]);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const shareLink = `https://app.example.com/dashboards/shared/abc123`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Link copied",
      description: "Dashboard link copied to clipboard",
    });
  };

  const handleInvite = () => {
    if (!email.trim() || !email.includes("@")) return;
    setSharedUsers([...sharedUsers, { email: email.trim(), permission }]);
    setEmail("");
    toast({
      title: "Invitation sent",
      description: `${email} has been invited to ${permission} this dashboard`,
    });
  };

  const handleRemoveUser = (emailToRemove: string) => {
    setSharedUsers(sharedUsers.filter((u) => u.email !== emailToRemove));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Share "{dashboardName}"</DialogTitle>
          <DialogDescription>
            Invite others to view or collaborate on this dashboard
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Public/Private Toggle */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              {isPublic ? (
                <Globe className="w-5 h-5 text-secondary" />
              ) : (
                <Lock className="w-5 h-5 text-muted-foreground" />
              )}
              <div>
                <Label className="font-medium">
                  {isPublic ? "Public Access" : "Private"}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {isPublic
                    ? "Anyone with the link can view"
                    : "Only invited people can access"}
                </p>
              </div>
            </div>
            <Switch checked={isPublic} onCheckedChange={onVisibilityChange} />
          </div>

          {/* Share Link */}
          {isPublic && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Link2 className="w-4 h-4" />
                Share Link
              </Label>
              <div className="flex gap-2">
                <Input value={shareLink} readOnly className="font-mono text-sm" />
                <Button variant="outline" size="icon" onClick={handleCopyLink}>
                  {copied ? (
                    <Check className="w-4 h-4 text-secondary" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Invite by Email */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Invite People
            </Label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleInvite()}
              />
              <Select
                value={permission}
                onValueChange={(v: "view" | "edit") => setPermission(v)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">
                    <div className="flex items-center gap-2">
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </div>
                  </SelectItem>
                  <SelectItem value="edit">
                    <div className="flex items-center gap-2">
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleInvite} disabled={!email.includes("@")}>
                Invite
              </Button>
            </div>
          </div>

          {/* Shared Users */}
          {sharedUsers.length > 0 && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                People with Access
              </Label>
              <div className="border rounded-lg divide-y">
                {sharedUsers.map((user) => (
                  <div
                    key={user.email}
                    className="flex items-center justify-between p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary">
                        {user.email[0].toUpperCase()}
                      </div>
                      <span className="text-sm">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "text-xs px-2 py-1 rounded",
                          user.permission === "edit"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {user.permission === "edit" ? "Can edit" : "Can view"}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveUser(user.email)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
