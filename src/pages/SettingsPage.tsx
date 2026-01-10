import {
  User,
  Users,
  Key,
  Plug,
  CreditCard,
  Bell,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { TeamSettings } from "@/components/settings/TeamSettings";
import { APIKeysSettings } from "@/components/settings/APIKeysSettings";
import { IntegrationsSettings } from "@/components/settings/IntegrationsSettings";
import { BillingSettings } from "@/components/settings/BillingSettings";
import { NotificationsSettings } from "@/components/settings/NotificationsSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "team", label: "Team Members", icon: Users },
  { id: "api", label: "API Keys", icon: Key },
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
];

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="flex-1 overflow-y-auto">
      <header className="h-16 bg-card/80 backdrop-blur-sm border-b border-border/60 flex items-center px-6 sticky top-0 z-40">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your workspace and preferences</p>
        </div>
      </header>

      <div className="flex">
        <aside className="w-56 border-r border-border/60 p-4 shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  activeTab === tab.id
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6">
          {activeTab === "profile" && <ProfileSettings />}
          {activeTab === "team" && <TeamSettings />}
          {activeTab === "api" && <APIKeysSettings />}
          {activeTab === "integrations" && <IntegrationsSettings />}
          {activeTab === "billing" && <BillingSettings />}
          {activeTab === "notifications" && <NotificationsSettings />}
          {activeTab === "security" && <SecuritySettings />}
        </main>
      </div>
    </div>
  );
};
