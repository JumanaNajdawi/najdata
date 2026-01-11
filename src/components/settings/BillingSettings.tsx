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
  Plug,
  HardDrive,
  TrendingUp,
  Info,
  LayoutDashboard,
  Lightbulb,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Types for the billing system
interface UsageLimit {
  included: number | "unlimited";
  overagePrice?: number; // Price per unit after limit
  overageUnit?: string; // e.g., "per 1,000 tokens", "per GB"
}

interface PlanLimits {
  users: UsageLimit;
  aiTokens: UsageLimit;
  storage: UsageLimit; // in GB
  insights: UsageLimit;
  dashboards: UsageLimit;
  integrations: UsageLimit;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  period: "monthly" | "yearly";
  features: string[];
  limits: PlanLimits;
  popular?: boolean;
  enterprise?: boolean;
}

interface UsageMetric {
  current: number;
  limit: number | "unlimited";
  overagePrice?: number;
  overageUnit?: string;
  unit: string;
}

interface CurrentUsage {
  users: UsageMetric;
  aiTokens: UsageMetric;
  storage: UsageMetric;
  insights: UsageMetric;
  dashboards: UsageMetric;
  integrations: UsageMetric;
}

interface Invoice {
  id: string;
  date: string;
  baseAmount: number;
  overageAmount: number;
  totalAmount: number;
  status: "paid" | "pending" | "failed";
  breakdown?: {
    metric: string;
    usage: number;
    overage: number;
    cost: number;
  }[];
}

// Plan definitions with hybrid pricing
const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for small teams getting started",
    basePrice: 0,
    period: "monthly",
    features: [
      "Up to 3 team members",
      "50,000 AI tokens/month",
      "5 GB storage",
      "10 insights",
      "3 dashboards",
      "2 integrations",
      "Email support",
    ],
    limits: {
      users: { included: 3 },
      aiTokens: { included: 50000 },
      storage: { included: 5 },
      insights: { included: 10 },
      dashboards: { included: 3 },
      integrations: { included: 2 },
    },
  },
  {
    id: "pro",
    name: "Professional",
    description: "Best for growing teams with advanced needs",
    basePrice: 49,
    period: "monthly",
    features: [
      "Up to 10 team members",
      "500,000 AI tokens/month",
      "50 GB storage",
      "100 insights",
      "20 dashboards",
      "10 integrations",
      "Priority support",
      "Advanced analytics",
      "Custom branding",
    ],
    limits: {
      users: { included: 10, overagePrice: 8, overageUnit: "per user" },
      aiTokens: { included: 500000, overagePrice: 0.002, overageUnit: "per 1K tokens" },
      storage: { included: 50, overagePrice: 0.5, overageUnit: "per GB" },
      insights: { included: 100, overagePrice: 0.5, overageUnit: "per insight" },
      dashboards: { included: 20, overagePrice: 2, overageUnit: "per dashboard" },
      integrations: { included: 10, overagePrice: 5, overageUnit: "per integration" },
    },
    popular: true,
  },
  {
    id: "business",
    name: "Business",
    description: "For large teams requiring scale",
    basePrice: 149,
    period: "monthly",
    features: [
      "Up to 50 team members",
      "2,000,000 AI tokens/month",
      "200 GB storage",
      "500 insights",
      "100 dashboards",
      "Unlimited integrations",
      "Dedicated support",
      "SSO/SAML",
      "Audit logs",
      "API access",
    ],
    limits: {
      users: { included: 50, overagePrice: 6, overageUnit: "per user" },
      aiTokens: { included: 2000000, overagePrice: 0.0015, overageUnit: "per 1K tokens" },
      storage: { included: 200, overagePrice: 0.3, overageUnit: "per GB" },
      insights: { included: 500, overagePrice: 0.3, overageUnit: "per insight" },
      dashboards: { included: 100, overagePrice: 1.5, overageUnit: "per dashboard" },
      integrations: { included: "unlimited" },
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Custom solutions for large organizations",
    basePrice: 499,
    period: "monthly",
    features: [
      "Unlimited team members",
      "Unlimited AI tokens",
      "Unlimited storage",
      "Unlimited insights",
      "Unlimited dashboards",
      "Unlimited integrations",
      "24/7 dedicated support",
      "Custom SLA",
      "On-premise option",
      "Custom integrations",
      "Training & onboarding",
    ],
    limits: {
      users: { included: "unlimited" },
      aiTokens: { included: "unlimited" },
      storage: { included: "unlimited" },
      insights: { included: "unlimited" },
      dashboards: { included: "unlimited" },
      integrations: { included: "unlimited" },
    },
    enterprise: true,
  },
];

// Sample invoices with breakdown
const INVOICES: Invoice[] = [
  {
    id: "INV-2024-006",
    date: "2024-06-01",
    baseAmount: 49,
    overageAmount: 23.5,
    totalAmount: 72.5,
    status: "paid",
    breakdown: [
      { metric: "AI Tokens", usage: 650000, overage: 150000, cost: 15 },
      { metric: "Storage", usage: 55, overage: 5, cost: 2.5 },
      { metric: "Users", usage: 12, overage: 2, cost: 6 },
    ],
  },
  {
    id: "INV-2024-005",
    date: "2024-05-01",
    baseAmount: 49,
    overageAmount: 8.0,
    totalAmount: 57.0,
    status: "paid",
    breakdown: [
      { metric: "AI Tokens", usage: 520000, overage: 20000, cost: 2 },
      { metric: "Users", usage: 11, overage: 1, cost: 6 },
    ],
  },
  {
    id: "INV-2024-004",
    date: "2024-04-01",
    baseAmount: 49,
    overageAmount: 0,
    totalAmount: 49.0,
    status: "paid",
  },
];

export const BillingSettings = () => {
  const [currentPlan] = useState<Plan>(PLANS[1]); // Pro plan
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [invoiceDetailOpen, setInvoiceDetailOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  // Current usage with overage tracking
  const usage: CurrentUsage = {
    users: {
      current: 12,
      limit: currentPlan.limits.users.included,
      overagePrice: currentPlan.limits.users.overagePrice,
      overageUnit: currentPlan.limits.users.overageUnit,
      unit: "users",
    },
    aiTokens: {
      current: 623450,
      limit: currentPlan.limits.aiTokens.included,
      overagePrice: currentPlan.limits.aiTokens.overagePrice,
      overageUnit: currentPlan.limits.aiTokens.overageUnit,
      unit: "tokens",
    },
    storage: {
      current: 42.3,
      limit: currentPlan.limits.storage.included,
      overagePrice: currentPlan.limits.storage.overagePrice,
      overageUnit: currentPlan.limits.storage.overageUnit,
      unit: "GB",
    },
    insights: {
      current: 87,
      limit: currentPlan.limits.insights.included,
      overagePrice: currentPlan.limits.insights.overagePrice,
      overageUnit: currentPlan.limits.insights.overageUnit,
      unit: "insights",
    },
    dashboards: {
      current: 15,
      limit: currentPlan.limits.dashboards.included,
      overagePrice: currentPlan.limits.dashboards.overagePrice,
      overageUnit: currentPlan.limits.dashboards.overageUnit,
      unit: "dashboards",
    },
    integrations: {
      current: 8,
      limit: currentPlan.limits.integrations.included,
      overagePrice: currentPlan.limits.integrations.overagePrice,
      overageUnit: currentPlan.limits.integrations.overageUnit,
      unit: "integrations",
    },
  };

  const getUsagePercentage = (current: number, limit: number | "unlimited") => {
    if (limit === "unlimited") return 0;
    return Math.min((current / limit) * 100, 100);
  };

  const formatLimit = (limit: number | "unlimited", unit?: string) => {
    if (limit === "unlimited") return "Unlimited";
    if (unit === "tokens" && limit >= 1000) {
      return `${(limit / 1000).toLocaleString()}K`;
    }
    return limit.toLocaleString();
  };

  const getOverage = (current: number, limit: number | "unlimited") => {
    if (limit === "unlimited") return 0;
    return Math.max(current - limit, 0);
  };

  const calculateOverageCost = (metric: UsageMetric) => {
    if (metric.limit === "unlimited" || !metric.overagePrice) return 0;
    const overage = getOverage(metric.current, metric.limit);
    if (metric.unit === "tokens") {
      return (overage / 1000) * metric.overagePrice;
    }
    return overage * metric.overagePrice;
  };

  const totalOverageCost = Object.values(usage).reduce(
    (sum, metric) => sum + calculateOverageCost(metric),
    0
  );

  const projectedBill = currentPlan.basePrice + totalOverageCost;

  const isOverLimit = (metric: UsageMetric) => {
    if (metric.limit === "unlimited") return false;
    return metric.current > metric.limit;
  };

  const isNearLimit = (metric: UsageMetric) => {
    if (metric.limit === "unlimited") return false;
    return metric.current >= metric.limit * 0.8 && metric.current <= metric.limit;
  };

  const handleUpgrade = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  const handleConfirmUpgrade = () => {
    toast.success(`Upgraded to ${selectedPlan?.name} plan`);
    setUpgradeOpen(false);
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast.success(`Downloading invoice ${invoiceId}`);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setInvoiceDetailOpen(true);
  };

  const getUsageColor = (metric: UsageMetric) => {
    if (isOverLimit(metric)) return "text-destructive";
    if (isNearLimit(metric)) return "text-amber-500";
    return "text-foreground";
  };

  const getProgressColor = (metric: UsageMetric) => {
    if (isOverLimit(metric)) return "[&>div]:bg-destructive";
    if (isNearLimit(metric)) return "[&>div]:bg-amber-500";
    return "";
  };

  const UsageCard = ({
    icon: Icon,
    label,
    metric,
    iconColor,
  }: {
    icon: React.ElementType;
    label: string;
    metric: UsageMetric;
    iconColor: string;
  }) => {
    const overage = getOverage(metric.current, metric.limit);
    const overageCost = calculateOverageCost(metric);

    return (
      <div className="bg-card rounded-xl border border-border/60 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Icon className={`w-5 h-5 ${iconColor}`} />
            <span className="text-sm font-medium text-foreground">{label}</span>
          </div>
          {isOverLimit(metric) && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Over limit - overage charges apply</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {isNearLimit(metric) && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Approaching limit</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {metric.unit === "tokens"
                ? `${(metric.current / 1000).toFixed(1)}K`
                : metric.current.toLocaleString()}{" "}
              of {formatLimit(metric.limit, metric.unit)}
            </span>
            <span className={`font-medium ${getUsageColor(metric)}`}>
              {metric.limit === "unlimited"
                ? "—"
                : `${Math.round(getUsagePercentage(metric.current, metric.limit))}%`}
            </span>
          </div>
          <Progress
            value={Math.min(getUsagePercentage(metric.current, metric.limit), 100)}
            className={`h-2 ${getProgressColor(metric)}`}
          />
          {overage > 0 && metric.overagePrice && (
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-destructive">
                +{metric.unit === "tokens" ? `${(overage / 1000).toFixed(1)}K` : overage} overage
              </span>
              <span className="text-destructive font-medium">+${overageCost.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div className="max-w-4xl animate-fade-in space-y-8">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Billing & Subscription</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your subscription, usage, and billing information
          </p>
        </div>

        {/* Current Plan & Projected Bill */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-xl border border-primary/20 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Crown className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-foreground">{currentPlan.name}</h3>
                    <Badge className="bg-primary text-primary-foreground">Current</Badge>
                  </div>
                  <p className="text-muted-foreground mt-1">
                    ${currentPlan.basePrice}/month base
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-primary/20">
              <Button variant="outline" className="w-full" onClick={() => setUpgradeOpen(true)}>
                Change Plan
              </Button>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border/60 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-chart-4/20 flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-chart-4" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Projected Bill</h3>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    ${projectedBill.toFixed(2)}
                  </p>
                </div>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Based on current usage. Final bill calculated at end of billing period.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="mt-4 pt-4 border-t border-border/60 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Base subscription</span>
                <span className="text-foreground">${currentPlan.basePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current overage</span>
                <span className={totalOverageCost > 0 ? "text-destructive" : "text-foreground"}>
                  {totalOverageCost > 0 ? "+" : ""}${totalOverageCost.toFixed(2)}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Renews on July 1, 2024
              </div>
            </div>
          </div>
        </div>

        {/* Usage Metrics */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Current Usage</h3>
            <span className="text-xs text-muted-foreground">Billing period: Jun 1 - Jun 30, 2024</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <UsageCard icon={Users} label="Team Members" metric={usage.users} iconColor="text-primary" />
            <UsageCard icon={Zap} label="AI Tokens" metric={usage.aiTokens} iconColor="text-chart-4" />
            <UsageCard icon={HardDrive} label="Storage" metric={usage.storage} iconColor="text-secondary" />
            <UsageCard icon={Lightbulb} label="Insights" metric={usage.insights} iconColor="text-chart-3" />
            <UsageCard icon={LayoutDashboard} label="Dashboards" metric={usage.dashboards} iconColor="text-chart-2" />
            <UsageCard icon={Plug} label="Integrations" metric={usage.integrations} iconColor="text-chart-5" />
          </div>
        </div>

        {/* Overage Alert */}
        {totalOverageCost > 0 && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-start gap-4">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-foreground">Overage charges detected</h4>
              <p className="text-sm text-muted-foreground mt-1">
                You've exceeded your plan limits this billing period. Consider upgrading to avoid
                overage charges or reduce usage.
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" onClick={() => setUpgradeOpen(true)}>
                  Upgrade Plan
                </Button>
                <Button variant="outline" size="sm">
                  View Usage Details
                </Button>
              </div>
            </div>
          </div>
        )}

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
                    <p className="font-medium text-foreground">${invoice.totalAmount.toFixed(2)}</p>
                    <div className="flex items-center gap-2">
                      {invoice.overageAmount > 0 && (
                        <span className="text-xs text-muted-foreground">
                          (incl. ${invoice.overageAmount.toFixed(2)} overage)
                        </span>
                      )}
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
                  </div>
                  {invoice.breakdown && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewInvoice(invoice)}
                    >
                      View
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDownloadInvoice(invoice.id)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade Dialog */}
        <Dialog open={upgradeOpen} onOpenChange={setUpgradeOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Choose a Plan</DialogTitle>
              <DialogDescription>
                Select the plan that best fits your needs. All plans include overage billing for usage beyond limits.
              </DialogDescription>
            </DialogHeader>

            <Tabs value={billingPeriod} onValueChange={(v) => setBillingPeriod(v as "monthly" | "yearly")} className="mt-4">
              <div className="flex justify-center">
                <TabsList>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="yearly">
                    Yearly
                    <Badge className="ml-2 bg-secondary text-secondary-foreground text-xs">Save 20%</Badge>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="monthly" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {PLANS.map((plan) => (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      currentPlan={currentPlan}
                      selectedPlan={selectedPlan}
                      onSelect={handleUpgrade}
                      billingPeriod="monthly"
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="yearly" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {PLANS.map((plan) => (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      currentPlan={currentPlan}
                      selectedPlan={selectedPlan}
                      onSelect={handleUpgrade}
                      billingPeriod="yearly"
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {selectedPlan && (
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium text-foreground mb-3">Usage Limits & Overage Pricing</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <LimitDisplay label="Team Members" limit={selectedPlan.limits.users} />
                  <LimitDisplay label="AI Tokens" limit={selectedPlan.limits.aiTokens} isTokens />
                  <LimitDisplay label="Storage" limit={selectedPlan.limits.storage} suffix="GB" />
                  <LimitDisplay label="Insights" limit={selectedPlan.limits.insights} />
                  <LimitDisplay label="Dashboards" limit={selectedPlan.limits.dashboards} />
                  <LimitDisplay label="Integrations" limit={selectedPlan.limits.integrations} />
                </div>
              </div>
            )}

            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setUpgradeOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirmUpgrade}
                disabled={!selectedPlan || selectedPlan.id === currentPlan.id}
              >
                {selectedPlan && selectedPlan.basePrice > currentPlan.basePrice ? (
                  <>
                    Upgrade to {selectedPlan.name}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                ) : selectedPlan && selectedPlan.basePrice < currentPlan.basePrice ? (
                  <>Downgrade to {selectedPlan.name}</>
                ) : (
                  "Select a Plan"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Invoice Detail Dialog */}
        <Dialog open={invoiceDetailOpen} onOpenChange={setInvoiceDetailOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invoice Details</DialogTitle>
              <DialogDescription>
                {selectedInvoice?.id} -{" "}
                {selectedInvoice &&
                  new Date(selectedInvoice.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
              </DialogDescription>
            </DialogHeader>
            {selectedInvoice && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-border/60">
                    <span className="text-muted-foreground">Base subscription</span>
                    <span className="text-foreground">${selectedInvoice.baseAmount.toFixed(2)}</span>
                  </div>
                  {selectedInvoice.breakdown?.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-2 border-b border-border/60">
                      <div>
                        <span className="text-muted-foreground">{item.metric} overage</span>
                        <p className="text-xs text-muted-foreground">
                          {item.usage.toLocaleString()} used, {item.overage.toLocaleString()} over limit
                        </p>
                      </div>
                      <span className="text-destructive">+${item.cost.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-2 font-medium">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">${selectedInvoice.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
                <Button className="w-full" onClick={() => handleDownloadInvoice(selectedInvoice.id)}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Invoice
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

// Plan Card Component
const PlanCard = ({
  plan,
  currentPlan,
  selectedPlan,
  onSelect,
  billingPeriod,
}: {
  plan: Plan;
  currentPlan: Plan;
  selectedPlan: Plan | null;
  onSelect: (plan: Plan) => void;
  billingPeriod: "monthly" | "yearly";
}) => {
  const yearlyPrice = plan.basePrice * 12 * 0.8; // 20% discount
  const displayPrice = billingPeriod === "yearly" ? yearlyPrice / 12 : plan.basePrice;
  const isSelected = selectedPlan?.id === plan.id;
  const isCurrent = plan.id === currentPlan.id;

  return (
    <div
      className={`relative rounded-xl border p-4 cursor-pointer transition-all ${
        isSelected
          ? "border-primary bg-primary/5 shadow-lg"
          : isCurrent
          ? "border-border bg-muted/30"
          : "border-border/60 hover:border-border hover:shadow-md"
      }`}
      onClick={() => onSelect(plan)}
    >
      {plan.popular && (
        <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
          Popular
        </Badge>
      )}
      {isCurrent && (
        <Badge variant="outline" className="absolute -top-2 left-1/2 -translate-x-1/2">
          Current
        </Badge>
      )}
      <div className="text-center mb-4 pt-2">
        <h4 className="font-semibold text-foreground">{plan.name}</h4>
        <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
        <p className="text-2xl font-bold text-foreground mt-3">
          ${displayPrice.toFixed(0)}
          <span className="text-sm font-normal text-muted-foreground">/mo</span>
        </p>
        {billingPeriod === "yearly" && plan.basePrice > 0 && (
          <p className="text-xs text-secondary mt-1">
            ${yearlyPrice.toFixed(0)}/year (save ${(plan.basePrice * 12 * 0.2).toFixed(0)})
          </p>
        )}
      </div>
      <ul className="space-y-2">
        {plan.features.slice(0, 6).map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2 text-xs">
            <Check className="w-3 h-3 text-secondary shrink-0 mt-0.5" />
            <span className="text-muted-foreground">{feature}</span>
          </li>
        ))}
        {plan.features.length > 6 && (
          <li className="text-xs text-muted-foreground pl-5">
            +{plan.features.length - 6} more features
          </li>
        )}
      </ul>
    </div>
  );
};

// Limit Display Component
const LimitDisplay = ({
  label,
  limit,
  suffix,
  isTokens,
}: {
  label: string;
  limit: UsageLimit;
  suffix?: string;
  isTokens?: boolean;
}) => {
  const formatIncluded = () => {
    if (limit.included === "unlimited") return "Unlimited";
    if (isTokens) return `${(limit.included as number / 1000).toLocaleString()}K`;
    return `${limit.included.toLocaleString()}${suffix ? ` ${suffix}` : ""}`;
  };

  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground">{formatIncluded()}</p>
      {limit.overagePrice && (
        <p className="text-xs text-muted-foreground">
          +${limit.overagePrice} {limit.overageUnit}
        </p>
      )}
    </div>
  );
};
