import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Mail,
  MessageSquare,
  AlertTriangle,
  BarChart3,
  Users,
  Database,
  Check,
  Smartphone,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  email: boolean;
  push: boolean;
  slack: boolean;
}

const INITIAL_SETTINGS: NotificationSetting[] = [
  {
    id: "insights",
    title: "Insight Updates",
    description: "When insights are created, modified, or shared with you",
    icon: BarChart3,
    email: true,
    push: true,
    slack: false,
  },
  {
    id: "alerts",
    title: "Data Alerts",
    description: "When data thresholds are triggered or anomalies detected",
    icon: AlertTriangle,
    email: true,
    push: true,
    slack: true,
  },
  {
    id: "team",
    title: "Team Activity",
    description: "When team members join, leave, or update permissions",
    icon: Users,
    email: true,
    push: false,
    slack: false,
  },
  {
    id: "database",
    title: "Database Events",
    description: "Connection status, sync completions, and errors",
    icon: Database,
    email: true,
    push: true,
    slack: true,
  },
  {
    id: "reports",
    title: "Scheduled Reports",
    description: "When scheduled reports are generated and ready",
    icon: Mail,
    email: true,
    push: false,
    slack: true,
  },
  {
    id: "comments",
    title: "Comments & Mentions",
    description: "When someone comments on or mentions you in an insight",
    icon: MessageSquare,
    email: true,
    push: true,
    slack: false,
  },
];

export const NotificationsSettings = () => {
  const [settings, setSettings] = useState<NotificationSetting[]>(INITIAL_SETTINGS);
  const [digestFrequency, setDigestFrequency] = useState("daily");
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(true);
  const [quietHoursStart, setQuietHoursStart] = useState("22:00");
  const [quietHoursEnd, setQuietHoursEnd] = useState("08:00");

  const handleToggle = (id: string, channel: "email" | "push" | "slack") => {
    setSettings(
      settings.map((s) =>
        s.id === id ? { ...s, [channel]: !s[channel] } : s
      )
    );
  };

  const handleSave = () => {
    toast.success("Notification preferences saved");
  };

  const handleEnableAll = (channel: "email" | "push" | "slack") => {
    setSettings(settings.map((s) => ({ ...s, [channel]: true })));
    toast.success(`All ${channel} notifications enabled`);
  };

  const handleDisableAll = (channel: "email" | "push" | "slack") => {
    setSettings(settings.map((s) => ({ ...s, [channel]: false })));
    toast.success(`All ${channel} notifications disabled`);
  };

  return (
    <div className="max-w-3xl animate-fade-in space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure how and when you receive notifications
        </p>
      </div>

      {/* Channel Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border/60 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">Email</span>
            </div>
            <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
              {settings.filter((s) => s.email).length} active
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEnableAll("email")}>
              Enable All
            </Button>
            <Button variant="ghost" size="sm" className="flex-1" onClick={() => handleDisableAll("email")}>
              Disable All
            </Button>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border/60 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-chart-3" />
              <span className="font-medium text-foreground">Push</span>
            </div>
            <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
              {settings.filter((s) => s.push).length} active
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEnableAll("push")}>
              Enable All
            </Button>
            <Button variant="ghost" size="sm" className="flex-1" onClick={() => handleDisableAll("push")}>
              Disable All
            </Button>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border/60 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-chart-4" />
              <span className="font-medium text-foreground">Slack</span>
            </div>
            <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
              {settings.filter((s) => s.slack).length} active
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEnableAll("slack")}>
              Enable All
            </Button>
            <Button variant="ghost" size="sm" className="flex-1" onClick={() => handleDisableAll("slack")}>
              Disable All
            </Button>
          </div>
        </div>
      </div>

      {/* Notification Types */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">Notification Types</h3>
        <div className="bg-card rounded-xl border border-border/60 divide-y divide-border/60">
          {/* Header */}
          <div className="grid grid-cols-[1fr,80px,80px,80px] gap-4 p-4 text-sm font-medium text-muted-foreground">
            <span>Notification</span>
            <span className="text-center">Email</span>
            <span className="text-center">Push</span>
            <span className="text-center">Slack</span>
          </div>
          {/* Settings */}
          {settings.map((setting) => (
            <div
              key={setting.id}
              className="grid grid-cols-[1fr,80px,80px,80px] gap-4 p-4 items-center hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                  <setting.icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{setting.title}</p>
                  <p className="text-xs text-muted-foreground">{setting.description}</p>
                </div>
              </div>
              <div className="flex justify-center">
                <Switch
                  checked={setting.email}
                  onCheckedChange={() => handleToggle(setting.id, "email")}
                />
              </div>
              <div className="flex justify-center">
                <Switch
                  checked={setting.push}
                  onCheckedChange={() => handleToggle(setting.id, "push")}
                />
              </div>
              <div className="flex justify-center">
                <Switch
                  checked={setting.slack}
                  onCheckedChange={() => handleToggle(setting.id, "slack")}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Digest */}
      <div className="bg-card rounded-xl border border-border/60 p-6 space-y-4">
        <h3 className="text-sm font-medium text-foreground">Email Digest</h3>
        <p className="text-sm text-muted-foreground">
          Receive a summary of activity instead of individual emails
        </p>
        <div className="flex items-center gap-4">
          <Label htmlFor="digest" className="text-sm">Frequency</Label>
          <Select value={digestFrequency} onValueChange={setDigestFrequency}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="realtime">Real-time</SelectItem>
              <SelectItem value="hourly">Hourly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="never">Never</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quiet Hours */}
      <div className="bg-card rounded-xl border border-border/60 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-foreground">Quiet Hours</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Pause push notifications during specific hours
            </p>
          </div>
          <Switch checked={quietHoursEnabled} onCheckedChange={setQuietHoursEnabled} />
        </div>
        {quietHoursEnabled && (
          <div className="flex items-center gap-4 pt-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">From</Label>
              <Select value={quietHoursStart} onValueChange={setQuietHoursStart}>
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => (
                    <SelectItem key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                      {`${i.toString().padStart(2, "0")}:00`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">To</Label>
              <Select value={quietHoursEnd} onValueChange={setQuietHoursEnd}>
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => (
                    <SelectItem key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                      {`${i.toString().padStart(2, "0")}:00`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Check className="w-4 h-4 mr-2" />
          Save Preferences
        </Button>
      </div>
    </div>
  );
};
