import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Camera, Check, Globe, MapPin } from "lucide-react";
import { toast } from "sonner";

export const ProfileSettings = () => {
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    company: "Acme Corp",
    jobTitle: "Data Analyst",
    phone: "+1 (555) 123-4567",
    timezone: "America/New_York",
    bio: "Data enthusiast passionate about turning insights into action.",
    location: "New York, USA",
  });
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const handleSave = () => {
    toast.success("Profile updated successfully");
  };

  return (
    <div className="max-w-2xl animate-fade-in space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Profile Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your personal information and preferences
        </p>
      </div>

      {/* Avatar Section */}
      <div className="bg-card rounded-xl border border-border/60 p-6">
        <h3 className="text-sm font-medium text-foreground mb-4">Profile Photo</h3>
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center text-3xl font-semibold text-primary-foreground">
              {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
            </div>
            <button className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Upload Photo
              </Button>
              <Button variant="ghost" size="sm" className="text-destructive">
                Remove
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              JPG, PNG or GIF. Max 2MB. Recommended: 400x400px
            </p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-card rounded-xl border border-border/60 p-6 space-y-6">
        <h3 className="text-sm font-medium text-foreground">Personal Information</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input 
              id="firstName" 
              value={profile.firstName}
              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input 
              id="lastName" 
              value={profile.lastName}
              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email" 
            type="email" 
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            This email is used for login and notifications
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input 
              id="company" 
              value={profile.company}
              onChange={(e) => setProfile({ ...profile, company: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input 
              id="jobTitle" 
              value={profile.jobTitle}
              onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input 
            id="phone" 
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea 
            id="bio" 
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            rows={3}
            placeholder="Tell us a bit about yourself..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Location
            </Label>
            <Input 
              id="location" 
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone" className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> Timezone
            </Label>
            <Input 
              id="timezone" 
              value={profile.timezone}
              onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Email Preferences */}
      <div className="bg-card rounded-xl border border-border/60 p-6 space-y-4">
        <h3 className="text-sm font-medium text-foreground">Email Preferences</h3>
        
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-medium text-foreground">Email Notifications</p>
            <p className="text-xs text-muted-foreground">
              Receive email updates about your account activity
            </p>
          </div>
          <Switch 
            checked={emailNotifications} 
            onCheckedChange={setEmailNotifications}
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-medium text-foreground">Marketing Emails</p>
            <p className="text-xs text-muted-foreground">
              Receive tips, product updates, and promotions
            </p>
          </div>
          <Switch 
            checked={marketingEmails} 
            onCheckedChange={setMarketingEmails}
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave}>
          <Check className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};
