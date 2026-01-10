import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CreditCard,
  Download,
  Check,
  Crown,
  Zap,
  Users,
  Database,
  BarChart3,
  ArrowRight,
  Receipt,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Plan {
  id: string;
  name: string;
  price: number;
  period: "monthly" | "yearly";
  features: string[];
  limits: {
    users: number | "unlimited";
    databases: number | "unlimited";
    insights: number | "unlimited";
    apiCalls: number | "unlimited";
  };
  popular?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 0,
    period: "monthly",
    features: ["Up to 3 team members", "5 databases", "Basic analytics", "Email support"],
    limits: { users: 3, databases: 5, insights: 50, apiCalls: 1000 },
  },
  {
    id: "pro",
    name: "Professional",
    price: 49,
    period: "monthly",
    features: [
      "Up to 10 team members",
      "Unlimited databases",
      "Advanced analytics",
      "Priority support",
      "Custom dashboards",
      "API access",
    ],
    limits: { users: 10, databases: "unlimited", insights: 500, apiCalls: 50000 },
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 199,
    period: "monthly",
    features: [
      "Unlimited team members",
      "Unlimited everything",
      "SSO/SAML",
      "Dedicated support",
      "Custom integrations",
      "SLA guarantee",
      "Audit logs",
    ],
    limits: { users: "unlimited", databases: "unlimited", insights: "unlimited", apiCalls: "unlimited" },
  },
];

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
}

const INVOICES: Invoice[] = [
  { id: "INV-001", date: "2024-06-01", amount: 49, status: "paid" },
  { id: "INV-002", date: "2024-05-01", amount: 49, status: "paid" },
  { id: "INV-003", date: "2024-04-01", amount: 49, status: "paid" },
];

export const BillingSettings = () => {
  const [currentPlan] = useState<Plan>(PLANS[1]); // Pro plan
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const usage = {
    users: { current: 5, limit: currentPlan.limits.users },
    databases: { current: 8, limit: currentPlan.limits.databases },
    insights: { current: 234, limit: currentPlan.limits.insights },
    apiCalls: { current: 12450, limit: currentPlan.limits.apiCalls },
  };

  const getUsagePercentage = (current: number, limit: number | "unlimited") => {
    if (limit === "unlimited") return 0;
    return Math.min((current / limit) * 100, 100);
  };

  const formatLimit = (limit: number | "unlimited") => {
    if (limit === "unlimited") return "Unlimited";
    return limit.toLocaleString();
  };

  const handleUpgrade = (plan: Plan) => {
    setSelectedPlan(plan);
    setUpgradeOpen(true);
  };

  const handleConfirmUpgrade = () => {
    toast.success(`Upgraded to ${selectedPlan?.name} plan`);
    setUpgradeOpen(false);
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast.success(`Downloading invoice ${invoiceId}`);
  };

  return (
    <div className="max-w-4xl animate-fade-in space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Billing & Subscription</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your subscription and billing information</p>
      </div>

      {/* Current Plan */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-xl border border-primary/20 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
              <Crown className="w-7 h-7 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold text-foreground">{currentPlan.name} Plan</h3>
                <Badge className="bg-primary text-primary-foreground">Current</Badge>
              </div>
              <p className="text-muted-foreground mt-1">
                ${currentPlan.price}/month • Renews on July 1, 2024
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={() => setUpgradeOpen(true)}>
            Change Plan
          </Button>
        </div>
      </div>

      {/* Usage */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">Current Usage</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card rounded-xl border border-border/60 p-4">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Team Members</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {usage.users.current} of {formatLimit(usage.users.limit)}
                </span>
                <span className="font-medium text-foreground">
                  {typeof usage.users.limit === "number"
                    ? `${Math.round(getUsagePercentage(usage.users.current, usage.users.limit))}%`
                    : "—"}
                </span>
              </div>
              <Progress value={getUsagePercentage(usage.users.current, usage.users.limit)} className="h-2" />
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border/60 p-4">
            <div className="flex items-center gap-3 mb-3">
              <Database className="w-5 h-5 text-secondary" />
              <span className="text-sm font-medium text-foreground">Databases</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {usage.databases.current} connected
                </span>
                <span className="font-medium text-secondary">Unlimited</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border/60 p-4">
            <div className="flex items-center gap-3 mb-3">
              <BarChart3 className="w-5 h-5 text-chart-3" />
              <span className="text-sm font-medium text-foreground">Insights Created</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {usage.insights.current} of {formatLimit(usage.insights.limit)}
                </span>
                <span className="font-medium text-foreground">
                  {typeof usage.insights.limit === "number"
                    ? `${Math.round(getUsagePercentage(usage.insights.current, usage.insights.limit))}%`
                    : "—"}
                </span>
              </div>
              <Progress value={getUsagePercentage(usage.insights.current, usage.insights.limit)} className="h-2" />
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border/60 p-4">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-5 h-5 text-chart-4" />
              <span className="text-sm font-medium text-foreground">API Calls</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {usage.apiCalls.current.toLocaleString()} of {formatLimit(usage.apiCalls.limit)}
                </span>
                <span className="font-medium text-foreground">
                  {typeof usage.apiCalls.limit === "number"
                    ? `${Math.round(getUsagePercentage(usage.apiCalls.current, usage.apiCalls.limit))}%`
                    : "—"}
                </span>
              </div>
              <Progress value={getUsagePercentage(usage.apiCalls.current, usage.apiCalls.limit)} className="h-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">Payment Method</h3>
        <div className="bg-card rounded-xl border border-border/60 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-8 rounded bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-foreground">•••• •••• •••• 4242</p>
              <p className="text-sm text-muted-foreground">Expires 12/2025</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Update
          </Button>
        </div>
      </div>

      {/* Billing History */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">Billing History</h3>
        <div className="bg-card rounded-xl border border-border/60 divide-y divide-border/60">
          {INVOICES.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{invoice.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(invoice.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-medium text-foreground">${invoice.amount.toFixed(2)}</p>
                  <Badge
                    variant="outline"
                    className={
                      invoice.status === "paid"
                        ? "bg-secondary/10 text-secondary border-secondary/20"
                        : invoice.status === "pending"
                        ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        : "bg-destructive/10 text-destructive border-destructive/20"
                    }
                  >
                    {invoice.status}
                  </Badge>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDownloadInvoice(invoice.id)}>
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade Dialog */}
      <Dialog open={upgradeOpen} onOpenChange={setUpgradeOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Choose a Plan</DialogTitle>
            <DialogDescription>Select the plan that best fits your needs</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-xl border p-4 cursor-pointer transition-all ${
                  selectedPlan?.id === plan.id
                    ? "border-primary bg-primary/5"
                    : plan.id === currentPlan.id
                    ? "border-border bg-muted/30"
                    : "border-border/60 hover:border-border"
                }`}
                onClick={() => setSelectedPlan(plan)}
              >
                {plan.popular && (
                  <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    Popular
                  </Badge>
                )}
                {plan.id === currentPlan.id && (
                  <Badge variant="outline" className="absolute -top-2 left-1/2 -translate-x-1/2">
                    Current
                  </Badge>
                )}
                <div className="text-center mb-4 pt-2">
                  <h4 className="font-semibold text-foreground">{plan.name}</h4>
                  <p className="text-2xl font-bold text-foreground mt-2">
                    ${plan.price}
                    <span className="text-sm font-normal text-muted-foreground">/mo</span>
                  </p>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-secondary shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpgradeOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmUpgrade} disabled={!selectedPlan || selectedPlan.id === currentPlan.id}>
              {selectedPlan && selectedPlan.price > currentPlan.price ? (
                <>
                  Upgrade to {selectedPlan.name}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              ) : selectedPlan && selectedPlan.price < currentPlan.price ? (
                <>Downgrade to {selectedPlan.name}</>
              ) : (
                "Select a Plan"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
