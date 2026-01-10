import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Database,
  Cloud,
  MessageSquare,
  BarChart3,
  Mail,
  Calendar,
  Zap,
  Settings,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: "database" | "communication" | "analytics" | "productivity";
  status: "connected" | "disconnected" | "error";
  connectedAt?: string;
  config?: Record<string, string>;
}

const INTEGRATIONS: Integration[] = [
  {
    id: "postgres",
    name: "PostgreSQL",
    description: "Connect to PostgreSQL databases for data analysis",
    icon: Database,
    category: "database",
    status: "connected",
    connectedAt: "2024-05-15",
  },
  {
    id: "mysql",
    name: "MySQL",
    description: "Import data from MySQL databases",
    icon: Database,
    category: "database",
    status: "disconnected",
  },
  {
    id: "snowflake",
    name: "Snowflake",
    description: "Cloud data warehouse integration",
    icon: Cloud,
    category: "database",
    status: "disconnected",
  },
  {
    id: "bigquery",
    name: "BigQuery",
    description: "Google BigQuery data warehouse",
    icon: Cloud,
    category: "database",
    status: "disconnected",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Get notifications and share insights in Slack",
    icon: MessageSquare,
    category: "communication",
    status: "connected",
    connectedAt: "2024-04-20",
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    description: "Share dashboards and get alerts in Teams",
    icon: MessageSquare,
    category: "communication",
    status: "disconnected",
  },
  {
    id: "ga4",
    name: "Google Analytics 4",
    description: "Import website analytics data",
    icon: BarChart3,
    category: "analytics",
    status: "connected",
    connectedAt: "2024-03-10",
  },
  {
    id: "mixpanel",
    name: "Mixpanel",
    description: "Product analytics integration",
    icon: BarChart3,
    category: "analytics",
    status: "disconnected",
  },
  {
    id: "sendgrid",
    name: "SendGrid",
    description: "Email delivery for scheduled reports",
    icon: Mail,
    category: "productivity",
    status: "disconnected",
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Automate workflows with 5000+ apps",
    icon: Zap,
    category: "productivity",
    status: "disconnected",
  },
  {
    id: "gcal",
    name: "Google Calendar",
    description: "Schedule report deliveries",
    icon: Calendar,
    category: "productivity",
    status: "disconnected",
  },
];

const CATEGORY_LABELS: Record<Integration["category"], string> = {
  database: "Databases",
  communication: "Communication",
  analytics: "Analytics",
  productivity: "Productivity",
};

export const IntegrationsSettings = () => {
  const [integrations, setIntegrations] = useState<Integration[]>(INTEGRATIONS);
  const [configOpen, setConfigOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [connecting, setConnecting] = useState(false);

  const handleConnect = (integration: Integration) => {
    setSelectedIntegration(integration);
    setConfigOpen(true);
  };

  const handleDisconnect = (id: string) => {
    setIntegrations(
      integrations.map((i) => (i.id === id ? { ...i, status: "disconnected" as const, connectedAt: undefined } : i))
    );
    toast.success("Integration disconnected");
  };

  const handleSaveConnection = async () => {
    if (!selectedIntegration) return;
    setConnecting(true);
    // Simulate connection
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIntegrations(
      integrations.map((i) =>
        i.id === selectedIntegration.id
          ? { ...i, status: "connected" as const, connectedAt: new Date().toISOString().split("T")[0] }
          : i
      )
    );
    setConnecting(false);
    setConfigOpen(false);
    setSelectedIntegration(null);
    toast.success(`${selectedIntegration.name} connected successfully`);
  };

  const categories = [...new Set(integrations.map((i) => i.category))];

  return (
    <div className="max-w-4xl animate-fade-in space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Integrations</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Connect external services to enhance your analytics capabilities
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border/60 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">
                {integrations.filter((i) => i.status === "connected").length}
              </p>
              <p className="text-xs text-muted-foreground">Connected</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border/60 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <XCircle className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">
                {integrations.filter((i) => i.status === "disconnected").length}
              </p>
              <p className="text-xs text-muted-foreground">Available</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border/60 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">{integrations.length}</p>
              <p className="text-xs text-muted-foreground">Total Integrations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      {categories.map((category) => (
        <div key={category} className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">{CATEGORY_LABELS[category]}</h3>
          <div className="grid grid-cols-2 gap-4">
            {integrations
              .filter((i) => i.category === category)
              .map((integration) => (
                <div
                  key={integration.id}
                  className="bg-card rounded-xl border border-border/60 p-4 hover:border-border transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          integration.status === "connected" ? "bg-secondary/10" : "bg-muted"
                        }`}
                      >
                        <integration.icon
                          className={`w-5 h-5 ${
                            integration.status === "connected" ? "text-secondary" : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground">{integration.name}</h4>
                          {integration.status === "connected" && (
                            <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20 text-xs">
                              Connected
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{integration.description}</p>
                        {integration.connectedAt && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Connected since {new Date(integration.connectedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-border/60">
                    {integration.status === "connected" ? (
                      <>
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4 mr-1.5" />
                          Configure
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDisconnect(integration.id)}>
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" onClick={() => handleConnect(integration)}>
                        <ExternalLink className="w-4 h-4 mr-1.5" />
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}

      {/* Configuration Dialog */}
      <Dialog open={configOpen} onOpenChange={setConfigOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect {selectedIntegration?.name}</DialogTitle>
            <DialogDescription>Enter your connection details to set up the integration</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedIntegration?.category === "database" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="host">Host</Label>
                  <Input id="host" placeholder="localhost or IP address" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="port">Port</Label>
                    <Input id="port" placeholder="5432" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="database">Database</Label>
                    <Input id="database" placeholder="my_database" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" placeholder="db_user" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="••••••••" />
                </div>
              </>
            )}
            {selectedIntegration?.category !== "database" && (
              <div className="text-center py-8">
                <selectedIntegration.icon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  You'll be redirected to {selectedIntegration?.name} to complete the connection.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfigOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveConnection} disabled={connecting}>
              {connecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
