import { Mail } from "lucide-react";

interface ProfileFormFieldsProps {
  isEditing: boolean;
  formData: {
    name: string;
    bio: string;
    timezone: string;
  };
  email: string;
  onFormChange: (field: string, value: string) => void;
}

export function ProfileFormFields({
  isEditing,
  formData,
  email,
  onFormChange,
}: ProfileFormFieldsProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Full Name
        </label>
        {isEditing ? (
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onFormChange("name", e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
            placeholder="Enter your name"
          />
        ) : (
          <p className="text-foreground">{formData.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Email Address
        </label>
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-muted/50 border border-border">
          <Mail size={18} className="text-muted-foreground" />
          <p className="text-foreground">{email}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Email cannot be changed
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Bio
        </label>
        {isEditing ? (
          <textarea
            value={formData.bio}
            onChange={(e) => onFormChange("bio", e.target.value)}
            rows={4}
            className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none resize-none"
            placeholder="Tell us about yourself..."
          />
        ) : (
          <p className="text-foreground">
            {formData.bio || "No bio added yet"}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Timezone
        </label>
        {isEditing ? (
          <select
            value={formData.timezone}
            onChange={(e) => onFormChange("timezone", e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground focus:ring-2 ring-primary outline-none"
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
            <option value="Europe/London">London (GMT)</option>
            <option value="Europe/Paris">Paris (CET)</option>
            <option value="Asia/Tokyo">Tokyo (JST)</option>
            <option value="Asia/Dhaka">Dhaka (BST)</option>
          </select>
        ) : (
          <p className="text-foreground">{formData.timezone}</p>
        )}
      </div>
    </div>
  );
}