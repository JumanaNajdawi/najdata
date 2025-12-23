import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart3, Sparkles, ArrowRight, Mail, Lock, User, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Login goes directly to home, signup goes to onboarding
    if (isLogin) {
      navigate("/home");
    } else {
      navigate("/onboarding");
    }
  };

  const features = [
    "Connect any data source in seconds",
    "Ask questions in plain English",
    "Generate beautiful charts instantly",
    "Export and share with your team"
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-[55%] bg-gradient-primary relative overflow-hidden">
        {/* Ambient orbs */}
        <div className="ambient-orb w-[500px] h-[500px] -top-32 -left-32 opacity-40" 
             style={{ background: 'radial-gradient(circle, hsl(250 84% 75% / 0.4) 0%, transparent 70%)' }} />
        <div className="ambient-orb w-[400px] h-[400px] bottom-20 right-10 opacity-30"
             style={{ background: 'radial-gradient(circle, hsl(162 82% 50% / 0.4) 0%, transparent 70%)' }} />
        <div className="ambient-orb w-[300px] h-[300px] top-1/3 right-1/4 opacity-20 animate-float"
             style={{ background: 'radial-gradient(circle, hsl(0 0% 100% / 0.2) 0%, transparent 70%)' }} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
             style={{ 
               backgroundImage: 'linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)',
               backgroundSize: '60px 60px' 
             }} />
        
        <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24 text-primary-foreground">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-14 h-14 bg-primary-foreground/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-primary-foreground/20">
              <BarChart3 className="w-8 h-8" />
            </div>
            <span className="text-3xl font-bold tracking-tight">DataPulse</span>
          </div>
          
          <h1 className="text-5xl xl:text-6xl font-bold leading-[1.1] mb-6">
            Transform data into
            <span className="flex items-center gap-3 mt-2">
              insights
              <div className="w-14 h-14 bg-ai/30 rounded-2xl flex items-center justify-center backdrop-blur-sm animate-pulse-soft">
                <Sparkles className="w-7 h-7" />
              </div>
            </span>
          </h1>
          
          <p className="text-xl text-primary-foreground/80 leading-relaxed max-w-lg mb-12">
            The AI-powered analytics platform that turns complex data into actionable insights—no coding required.
          </p>
          
          <div className="space-y-4">
            {features.map((feature, i) => (
              <div 
                key={i} 
                className="flex items-center gap-4 text-primary-foreground/90 animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-7 h-7 rounded-lg bg-primary-foreground/15 flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-lg">{feature}</span>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div className="mt-16 pt-8 border-t border-primary-foreground/10">
            <p className="text-sm text-primary-foreground/60 mb-4">Trusted by data teams at</p>
            <div className="flex items-center gap-8 opacity-60">
              <div className="text-xl font-bold tracking-tight">Acme Inc</div>
              <div className="text-xl font-bold tracking-tight">TechCorp</div>
              <div className="text-xl font-bold tracking-tight">Startup.io</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-50 bg-gradient-surface" />
        
        <div className="w-full max-w-md relative z-10">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center animate-fade-in">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <BarChart3 className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">DataPulse</span>
          </div>

          <div className="text-center mb-10 animate-slide-up">
            <h2 className="text-3xl font-bold text-foreground mb-3">
              {isLogin ? "Welcome back" : "Start for free"}
            </h2>
            <p className="text-muted-foreground text-lg">
              {isLogin 
                ? "Sign in to continue analyzing your data" 
                : "Create your account in seconds"}
            </p>
          </div>

          {/* SSO Options */}
          <div className="space-y-3 mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <Button 
              variant="outline" 
              className="w-full h-13 text-base font-medium hover:bg-accent hover:border-primary/30 transition-all" 
              type="button"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-13 text-base font-medium hover:bg-accent hover:border-primary/30 transition-all" 
              type="button"
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Continue with GitHub
            </Button>
          </div>

          <div className="relative mb-8 animate-slide-up" style={{ animationDelay: '150ms' }}>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-4 text-muted-foreground">or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 animate-slide-up" style={{ animationDelay: '200ms' }}>
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-12 h-13 text-base"
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-13 text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                {isLogin && (
                  <button type="button" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 h-13 text-base"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-13 text-base font-semibold mt-6 bg-gradient-primary hover:opacity-90 shadow-glow transition-all" 
              size="lg"
            >
              {isLogin ? "Sign In" : "Create Account"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>

          <p className="text-center text-muted-foreground mt-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-semibold hover:underline"
            >
              {isLogin ? "Sign up free" : "Sign in"}
            </button>
          </p>

          {!isLogin && (
            <p className="text-center text-xs text-muted-foreground mt-6 animate-fade-in" style={{ animationDelay: '350ms' }}>
              By creating an account, you agree to our{" "}
              <a href="#" className="underline hover:text-foreground transition-colors">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="underline hover:text-foreground transition-colors">Privacy Policy</a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
