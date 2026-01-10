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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Users, MoreHorizontal, Mail, Shield, Trash2, UserPlus, Crown, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "analyst" | "viewer";
  status: "active" | "pending" | "inactive";
  joinedAt: string;
  avatar?: string;
}

const INITIAL_MEMBERS: TeamMember[] = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "owner", status: "active", joinedAt: "2024-01-15" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", role: "admin", status: "active", joinedAt: "2024-02-20" },
  { id: "3", name: "Bob Johnson", email: "bob@example.com", role: "analyst", status: "active", joinedAt: "2024-03-10" },
  { id: "4", name: "Alice Williams", email: "alice@example.com", role: "viewer", status: "pending", joinedAt: "2024-06-01" },
];

const ROLE_COLORS: Record<TeamMember["role"], string> = {
  owner: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  admin: "bg-primary/10 text-primary border-primary/20",
  analyst: "bg-secondary/10 text-secondary border-secondary/20",
  viewer: "bg-muted text-muted-foreground border-border",
};

const ROLE_DESCRIPTIONS: Record<TeamMember["role"], string> = {
  owner: "Full access including billing and team management",
  admin: "Manage team members, databases, and all insights",
  analyst: "Create and edit insights, dashboards, and queries",
  viewer: "View dashboards and insights only",
};

export const TeamSettings = () => {
  const [members, setMembers] = useState<TeamMember[]>(INITIAL_MEMBERS);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<TeamMember["role"]>("viewer");

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInvite = () => {
    if (!inviteEmail) {
      toast.error("Please enter an email address");
      return;
    }
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole,
      status: "pending",
      joinedAt: new Date().toISOString().split("T")[0],
    };
    setMembers([...members, newMember]);
    setInviteOpen(false);
    setInviteEmail("");
    setInviteRole("viewer");
    toast.success(`Invitation sent to ${inviteEmail}`);
  };

  const handleRemoveMember = (id: string) => {
    const member = members.find((m) => m.id === id);
    if (member?.role === "owner") {
      toast.error("Cannot remove the owner");
      return;
    }
    setMembers(members.filter((m) => m.id !== id));
    toast.success("Team member removed");
  };

  const handleChangeRole = (id: string, newRole: TeamMember["role"]) => {
    setMembers(members.map((m) => (m.id === id ? { ...m, role: newRole } : m)));
    toast.success("Role updated successfully");
  };

  const handleResendInvite = (email: string) => {
    toast.success(`Invitation resent to ${email}`);
  };

  return (
    <div className="max-w-4xl animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Team Members</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your team and their permissions
          </p>
        </div>
        <Button onClick={() => setInviteOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search team members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Roles Overview */}
      <div className="grid grid-cols-4 gap-3">
        {(["owner", "admin", "analyst", "viewer"] as const).map((role) => (
          <div key={role} className="bg-card rounded-lg border border-border/60 p-3">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className={ROLE_COLORS[role]}>
                {role === "owner" && <Crown className="w-3 h-3 mr-1" />}
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </Badge>
              <span className="text-sm font-medium text-foreground">
                {members.filter((m) => m.role === role).length}
              </span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {ROLE_DESCRIPTIONS[role]}
            </p>
          </div>
        ))}
      </div>

      {/* Members List */}
      <div className="bg-card rounded-xl border border-border/60 divide-y divide-border/60">
        {filteredMembers.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No team members found</p>
          </div>
        ) : (
          filteredMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center font-medium text-primary-foreground text-sm">
                  {member.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{member.name}</p>
                    {member.status === "pending" && (
                      <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-600 border-amber-500/20">
                        Pending
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className={ROLE_COLORS[member.role]}>
                  {member.role === "owner" && <Crown className="w-3 h-3 mr-1" />}
                  {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                </Badge>
                <span className="text-xs text-muted-foreground w-24">
                  Joined {new Date(member.joinedAt).toLocaleDateString()}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {member.role !== "owner" && (
                      <>
                        <DropdownMenuItem onClick={() => handleChangeRole(member.id, "admin")}>
                          <Shield className="w-4 h-4 mr-2" />
                          Make Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleChangeRole(member.id, "analyst")}>
                          <Users className="w-4 h-4 mr-2" />
                          Make Analyst
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleChangeRole(member.id, "viewer")}>
                          <Users className="w-4 h-4 mr-2" />
                          Make Viewer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    {member.status === "pending" && (
                      <DropdownMenuItem onClick={() => handleResendInvite(member.email)}>
                        <Mail className="w-4 h-4 mr-2" />
                        Resend Invite
                      </DropdownMenuItem>
                    )}
                    {member.role !== "owner" && (
                      <DropdownMenuItem 
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Invite Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your workspace
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="inviteEmail">Email Address</Label>
              <Input
                id="inviteEmail"
                type="email"
                placeholder="colleague@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inviteRole">Role</Label>
              <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as TeamMember["role"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="analyst">Analyst</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {ROLE_DESCRIPTIONS[inviteRole]}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInvite}>
              <Mail className="w-4 h-4 mr-2" />
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
