import { useRef } from "react";
import { User, Camera, Loader2 } from "lucide-react";
import Image from "next/image";

interface ProfilePictureUploadProps {
  image?: string;
  name: string;
  isEditing: boolean;
  isUploading: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfilePictureUpload({
  image,
  name,
  isEditing,
  isUploading,
  onImageUpload,
}: ProfilePictureUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-6">
      <div className="relative">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-muted flex items-center justify-center">
          {image ? (
            <Image
              src={image}
              alt={name}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={40} className="text-muted-foreground" />
          )}
        </div>
        {isEditing && (
          <>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50"
            >
              {isUploading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Camera size={16} />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onImageUpload}
              className="hidden"
            />
          </>
        )}
      </div>
      <div>
        <h3 className="font-semibold text-foreground">Profile Picture</h3>
        <p className="text-sm text-muted-foreground mt-1">
          JPG, PNG or GIF. Max size 5MB.
        </p>
      </div>
    </div>
  );
}