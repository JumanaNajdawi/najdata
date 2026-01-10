import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Key, Copy, Eye, EyeOff, MoreHorizontal, Trash2, Plus, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface APIKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string | null;
  status: "active" | "expired" | "revoked";
  permissions: string[];
}

const INITIAL_KEYS: APIKey[] = [
  {
    id: "1",
    name: "Production API Key",
    key: "sk_live_abc123...xyz789",
    createdAt: "2024-03-15",
    lastUsed: "2024-06-10",
    status: "active",
    permissions: ["read", "write"],
  },
  {
    id: "2",
    name: "Development Key",
    key: "sk_test_def456...uvw012",
    createdAt: "2024-05-20",
    lastUsed: "2024-06-09",
    status: "active",
    permissions: ["read"],
  },
];

export const APIKeysSettings = () => {
  const [apiKeys, setApiKeys] = useState<APIKey[]>(INITIAL_KEYS);
  const [createOpen, setCreateOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyCreated, setNewKeyCreated] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  const handleCreateKey = () => {
    if (!newKeyName) {
      toast.error("Please enter a name for the API key");
      return;
    }
    const newKey = `sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    const apiKey: APIKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: newKey,
      createdAt: new Date().toISOString().split("T")[0],
      lastUsed: null,
      status: "active",
      permissions: ["read", "write"],
    };
    setApiKeys([apiKey, ...apiKeys]);
    setNewKeyCreated(newKey);
    setNewKeyName("");
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("API key copied to clipboard");
  };

  const handleRevokeKey = (id: string) => {
    setApiKeys(apiKeys.map((k) => (k.id === id ? { ...k, status: "revoked" as const } : k)));
    toast.success("API key revoked");
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys(apiKeys.filter((k) => k.id !== id));
    toast.success("API key deleted");
  };

  const toggleKeyVisibility = (id: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisibleKeys(newVisible);
  };

  const closeCreateDialog = () => {
    setCreateOpen(false);
    setNewKeyCreated(null);
    setNewKeyName("");
  };

  return (
    <div className="max-w-3xl animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">API Keys</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage API keys for programmatic access to your data
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create API Key
        </Button>
      </div>

      {/* Security Notice */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-600">Keep your API keys secure</p>
          <p className="text-xs text-amber-600/80 mt-1">
            API keys grant access to your data. Never share them publicly or commit them to version control.
          </p>
        </div>
      </div>

      {/* API Keys List */}
      <div className="space-y-3">
        {apiKeys.length === 0 ? (
          <div className="bg-card rounded-xl border border-border/60 p-12 text-center">
            <Key className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No API Keys</h3>
            <p className="text-muted-foreground mb-4">
              Create an API key to integrate with external services
            </p>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First API Key
            </Button>
          </div>
        ) : (
          apiKeys.map((apiKey) => (
            <div
              key={apiKey.id}
              className="bg-card rounded-xl border border-border/60 p-4 hover:border-border transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Key className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-foreground">{apiKey.name}</h4>
                      <Badge
                        variant="outline"
                        className={
                          apiKey.status === "active"
                            ? "bg-secondary/10 text-secondary border-secondary/20"
                            : "bg-destructive/10 text-destructive border-destructive/20"
                        }
                      >
                        {apiKey.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-sm text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                        {visibleKeys.has(apiKey.id) ? apiKey.key : apiKey.key.replace(/./g, "•").slice(0, 20) + "..."}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                      >
                        {visibleKeys.has(apiKey.id) ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleCopyKey(apiKey.key)}
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Created: {new Date(apiKey.createdAt).toLocaleDateString()}</span>
                      <span>
                        Last used: {apiKey.lastUsed ? new Date(apiKey.lastUsed).toLocaleDateString() : "Never"}
                      </span>
                      <span>Permissions: {apiKey.permissions.join(", ")}</span>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleCopyKey(apiKey.key)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Key
                    </DropdownMenuItem>
                    {apiKey.status === "active" && (
                      <DropdownMenuItem
                        onClick={() => handleRevokeKey(apiKey.id)}
                        className="text-amber-600 focus:text-amber-600"
                      >
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Revoke Key
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => handleDeleteKey(apiKey.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Key Dialog */}
      <Dialog open={createOpen} onOpenChange={closeCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{newKeyCreated ? "API Key Created" : "Create API Key"}</DialogTitle>
            <DialogDescription>
              {newKeyCreated
                ? "Copy your API key now. You won't be able to see it again."
                : "Create a new API key for external integrations"}
            </DialogDescription>
          </DialogHeader>
          {newKeyCreated ? (
            <div className="space-y-4 py-4">
              <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                <p className="text-sm text-secondary font-medium">API key created successfully!</p>
              </div>
              <div className="space-y-2">
                <Label>Your API Key</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm font-mono bg-muted px-3 py-2 rounded-lg break-all">
                    {newKeyCreated}
                  </code>
                  <Button size="icon" onClick={() => handleCopyKey(newKeyCreated)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Store this key securely. It won't be shown again.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="keyName">Key Name</Label>
                <Input
                  id="keyName"
                  placeholder="e.g., Production API Key"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  A descriptive name to identify this key
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            {newKeyCreated ? (
              <Button onClick={closeCreateDialog}>Done</Button>
            ) : (
              <>
                <Button variant="outline" onClick={closeCreateDialog}>
                  Cancel
                </Button>
                <Button onClick={handleCreateKey}>
                  <Key className="w-4 h-4 mr-2" />
                  Create Key
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
