import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      {/* Header */}
      <header className="h-16 bg-card/80 backdrop-blur-sm border-b border-border/60 flex items-center px-6 sticky top-0 z-40">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your workspace and preferences</p>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 border-r border-border/60 p-4 shrink-0">
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

        {/* Content */}
        <main className="flex-1 p-6">
          {activeTab === "profile" && (
            <div className="max-w-2xl animate-fade-in">
              <h2 className="text-lg font-semibold text-foreground mb-6">Profile Settings</h2>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center text-2xl font-semibold text-primary-foreground">
                    JD
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      Upload Photo
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG or GIF. Max 2MB.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Doe" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john@example.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" defaultValue="Acme Corp" />
                </div>

                <div className="pt-4">
                  <Button>Save Changes</Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "team" && (
            <div className="max-w-2xl animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Team Members</h2>
                <Button>
                  <Users className="w-4 h-4 mr-2" />
                  Invite Member
                </Button>
              </div>
              
              <div className="bg-card rounded-xl border border-border/60 divide-y divide-border/60">
                {[
                  { name: "John Doe", email: "john@example.com", role: "Admin" },
                  { name: "Jane Smith", email: "jane@example.com", role: "Analyst" },
                  { name: "Bob Johnson", email: "bob@example.com", role: "Viewer" },
                ].map((member) => (
                  <div key={member.email} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-medium text-muted-foreground">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">{member.role}</span>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "api" && (
            <div className="max-w-2xl animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">API Keys</h2>
                <Button>
                  <Key className="w-4 h-4 mr-2" />
                  Generate Key
                </Button>
              </div>
              
              <div className="bg-card rounded-xl border border-border/60 p-6">
                <p className="text-muted-foreground text-center py-8">
                  No API keys generated yet. Create one to integrate with external services.
                </p>
              </div>
            </div>
          )}

          {activeTab !== "profile" && activeTab !== "team" && activeTab !== "api" && (
            <div className="max-w-2xl animate-fade-in">
              <h2 className="text-lg font-semibold text-foreground mb-6 capitalize">
                {tabs.find((t) => t.id === activeTab)?.label}
              </h2>
              <div className="bg-card rounded-xl border border-border/60 p-6">
                <p className="text-muted-foreground text-center py-8">
                  This section is coming soon.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
