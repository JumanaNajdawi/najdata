import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Shield,
  Key,
  Smartphone,
  Lock,
  History,
  Globe,
  AlertTriangle,
  Check,
  X,
  Loader2,
  LogOut,
  Monitor,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Session {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  lastActive: string;
  current: boolean;
}

const SESSIONS: Session[] = [
  {
    id: "1",
    device: "MacBook Pro",
    browser: "Chrome 125",
    location: "New York, USA",
    ip: "192.168.1.100",
    lastActive: "Now",
    current: true,
  },
  {
    id: "2",
    device: "iPhone 15",
    browser: "Safari Mobile",
    location: "New York, USA",
    ip: "192.168.1.101",
    lastActive: "2 hours ago",
    current: false,
  },
  {
    id: "3",
    device: "Windows PC",
    browser: "Firefox 126",
    location: "Boston, USA",
    ip: "10.0.0.55",
    lastActive: "3 days ago",
    current: false,
  },
];

interface LoginHistory {
  id: string;
  date: string;
  ip: string;
  location: string;
  status: "success" | "failed";
  method: string;
}

const LOGIN_HISTORY: LoginHistory[] = [
  { id: "1", date: "2024-06-10T14:32:00", ip: "192.168.1.100", location: "New York, USA", status: "success", method: "Password" },
  { id: "2", date: "2024-06-10T10:15:00", ip: "192.168.1.101", location: "New York, USA", status: "success", method: "2FA" },
  { id: "3", date: "2024-06-09T22:45:00", ip: "10.0.0.55", location: "Boston, USA", status: "success", method: "Password" },
  { id: "4", date: "2024-06-08T16:20:00", ip: "203.0.113.50", location: "Unknown", status: "failed", method: "Password" },
];

export const SecuritySettings = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [twoFactorDialogOpen, setTwoFactorDialogOpen] = useState(false);
  const [sessions, setSessions] = useState<Session[]>(SESSIONS);
  const [changingPassword, setChangingPassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setChangingPassword(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setChangingPassword(false);
    setPasswordDialogOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast.success("Password changed successfully");
  };

  const handleEnable2FA = () => {
    setTwoFactorDialogOpen(true);
  };

  const handleConfirm2FA = () => {
    setTwoFactorEnabled(true);
    setTwoFactorDialogOpen(false);
    toast.success("Two-factor authentication enabled");
  };

  const handleRevokeSession = (id: string) => {
    setSessions(sessions.filter((s) => s.id !== id));
    toast.success("Session revoked");
  };

  const handleRevokeAllSessions = () => {
    setSessions(sessions.filter((s) => s.current));
    toast.success("All other sessions revoked");
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", color: "" };
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength: 33, label: "Weak", color: "bg-destructive" };
    if (strength <= 3) return { strength: 66, label: "Medium", color: "bg-amber-500" };
    return { strength: 100, label: "Strong", color: "bg-secondary" };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <div className="max-w-3xl animate-fade-in space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Security</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account security and access controls
        </p>
      </div>

      {/* Security Status */}
      <div className={`rounded-xl border p-6 ${twoFactorEnabled ? "bg-secondary/5 border-secondary/20" : "bg-amber-500/5 border-amber-500/20"}`}>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${twoFactorEnabled ? "bg-secondary/10" : "bg-amber-500/10"}`}>
            <Shield className={`w-6 h-6 ${twoFactorEnabled ? "text-secondary" : "text-amber-600"}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-foreground">Security Status</h3>
              <Badge variant="outline" className={twoFactorEnabled ? "bg-secondary/10 text-secondary border-secondary/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20"}>
                {twoFactorEnabled ? "Strong" : "Medium"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {twoFactorEnabled
                ? "Your account is protected with two-factor authentication"
                : "Enable two-factor authentication for enhanced security"}
            </p>
          </div>
        </div>
      </div>

      {/* Password */}
      <div className="bg-card rounded-xl border border-border/60 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <Key className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Password</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Last changed 30 days ago
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={() => setPasswordDialogOpen(true)}>
            Change Password
          </Button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-card rounded-xl border border-border/60 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-foreground">Two-Factor Authentication</h3>
                {twoFactorEnabled && (
                  <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
                    Enabled
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Add an extra layer of security to your account
              </p>
            </div>
          </div>
          {twoFactorEnabled ? (
            <Button variant="outline" onClick={() => setTwoFactorEnabled(false)}>
              Disable
            </Button>
          ) : (
            <Button onClick={handleEnable2FA}>Enable 2FA</Button>
          )}
        </div>
      </div>

      {/* Active Sessions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">Active Sessions</h3>
          {sessions.length > 1 && (
            <Button variant="ghost" size="sm" onClick={handleRevokeAllSessions}>
              <LogOut className="w-4 h-4 mr-1.5" />
              Revoke All Others
            </Button>
          )}
        </div>
        <div className="bg-card rounded-xl border border-border/60 divide-y divide-border/60">
          {sessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Monitor className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{session.device}</p>
                    {session.current && (
                      <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20 text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span>{session.browser}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {session.location}
                    </span>
                    <span>{session.ip}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">{session.lastActive}</span>
                {!session.current && (
                  <Button variant="ghost" size="sm" onClick={() => handleRevokeSession(session.id)}>
                    Revoke
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Login History */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">Recent Login Activity</h3>
        <div className="bg-card rounded-xl border border-border/60 divide-y divide-border/60">
          {LOGIN_HISTORY.map((login) => (
            <div key={login.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${login.status === "success" ? "bg-secondary/10" : "bg-destructive/10"}`}>
                  {login.status === "success" ? (
                    <Check className="w-4 h-4 text-secondary" />
                  ) : (
                    <X className="w-4 h-4 text-destructive" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {login.status === "success" ? "Successful login" : "Failed login attempt"}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span>{login.method}</span>
                    <span>{login.ip}</span>
                    <span>{login.location}</span>
                  </div>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">
                {new Date(login.date).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              {newPassword && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full ${passwordStrength.color} transition-all`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{passwordStrength.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use 8+ characters with uppercase, numbers, and symbols
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-destructive">Passwords don't match</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangePassword} disabled={changingPassword}>
              {changingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Changing...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2FA Setup Dialog */}
      <Dialog open={twoFactorDialogOpen} onOpenChange={setTwoFactorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Up Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Scan the QR code with your authenticator app
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex justify-center">
              <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">QR Code Placeholder</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Or enter this code manually:</Label>
              <code className="block text-center text-sm font-mono bg-muted px-4 py-2 rounded-lg">
                ABCD EFGH IJKL MNOP
              </code>
            </div>
            <div className="space-y-2">
              <Label htmlFor="verifyCode">Enter verification code</Label>
              <Input id="verifyCode" placeholder="000000" maxLength={6} className="text-center text-lg tracking-widest" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTwoFactorDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm2FA}>
              <Check className="w-4 h-4 mr-2" />
              Verify & Enable
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
