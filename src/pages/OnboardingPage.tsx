import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Building2,
  Users,
  Target,
  Briefcase,
  ArrowRight,
  BarChart3,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const industries = [
  "Technology",
  "E-commerce",
  "Finance",
  "Healthcare",
  "Marketing",
  "Manufacturing",
  "Retail",
  "Other",
];

const companySizes = [
  { label: "Just me", value: "1" },
  { label: "2-10", value: "2-10" },
  { label: "11-50", value: "11-50" },
  { label: "51-200", value: "51-200" },
  { label: "201-500", value: "201-500" },
  { label: "500+", value: "500+" },
];

const interests = [
  "Sales Analytics",
  "Marketing Performance",
  "Financial Reporting",
  "Customer Insights",
  "Product Analytics",
  "Operations",
  "HR & People",
  "Custom Dashboards",
];

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [role, setRole] = useState("");

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleContinue = () => {
    navigate("/data-source");
  };

  const isValid = companyName.trim() && industry && companySize;

  return (
    <div className="min-h-screen bg-gradient-surface flex">
      {/* Left Panel - Progress */}
      <aside className="hidden lg:flex w-80 bg-card border-r border-border/60 flex-col p-8">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow-primary">
            <BarChart3 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground text-lg">DataPulse</span>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-foreground font-medium">Create Account</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-sm font-semibold text-primary-foreground">2</span>
            </div>
            <span className="text-foreground font-medium">Tell us about you</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <span className="text-sm font-semibold text-muted-foreground">3</span>
            </div>
            <span className="text-muted-foreground">Connect your data</span>
          </div>
        </div>

        <div className="mt-auto">
          <p className="text-sm text-muted-foreground">
            This helps us personalize your experience and suggest relevant templates.
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-xl animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Tell us about your company
            </h1>
            <p className="text-muted-foreground">
              We'll customize your experience based on your needs
            </p>
          </div>

          <div className="bg-card rounded-2xl border border-border/60 p-8 space-y-6">
            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-sm font-medium flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                Company Name
              </Label>
              <Input
                id="companyName"
                placeholder="Acme Inc."
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="h-12"
              />
            </div>

            {/* Your Role */}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                Your Role
              </Label>
              <Input
                id="role"
                placeholder="e.g. Data Analyst, Product Manager"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="h-12"
              />
            </div>

            {/* Industry */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                Industry
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {industries.map((ind) => (
                  <button
                    key={ind}
                    onClick={() => setIndustry(ind)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                      industry === ind
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>

            {/* Company Size */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                Company Size
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {companySizes.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => setCompanySize(size.value)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                      companySize === size.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">What are you most interested in?</Label>
              <p className="text-xs text-muted-foreground mb-2">Select all that apply</p>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium transition-all border",
                      selectedInterests.includes(interest)
                        ? "bg-secondary/10 border-secondary text-secondary"
                        : "bg-transparent border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    )}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleContinue}
              disabled={!isValid}
              className="h-12 px-8 bg-gradient-primary hover:opacity-90 shadow-glow transition-all"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-4">
            You can always update this later in Settings
          </p>
        </div>
      </main>
    </div>
  );
};
