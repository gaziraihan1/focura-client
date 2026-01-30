import { motion } from "framer-motion";
import { ProfilePictureUpload } from "./ProfilePictureUpload";
import { ProfileFormFields } from "./ProfileFormFields";

interface ProfileInformationCardProps {
  isEditing: boolean;
  isUploading: boolean;
  formData: {
    name: string;
    bio: string;
    timezone: string;
    image: string;
  };
  email: string;
  onFormChange: (field: string, value: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileInformationCard({
  isEditing,
  isUploading,
  formData,
  email,
  onFormChange,
  onImageUpload,
}: ProfileInformationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-card border border-border p-6"
    >
      <h2 className="text-xl font-bold text-foreground mb-6">
        Profile Information
      </h2>

      <div className="space-y-6">
        <ProfilePictureUpload
          image={formData.image}
          name={formData.name}
          isEditing={isEditing}
          isUploading={isUploading}
          onImageUpload={onImageUpload}
        />

        <ProfileFormFields
          isEditing={isEditing}
          formData={formData}
          email={email}
          onFormChange={onFormChange}
        />
      </div>
    </motion.div>
  );
}