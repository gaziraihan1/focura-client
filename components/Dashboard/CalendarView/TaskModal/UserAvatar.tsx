import Image from "next/image"

interface UserAvatarProps {
    name: string;
    image?: string | null;
    size?: "sm" | "md" | "lg"
}

const sizeClasses = {
    sm: "w-6 h-6 text-[10px]",
    md: "w-8 h-8 text-xs",
    lg: "w-10 h-10 text-sm"
}
export default function UserAvatar({name, image, size = "md"}: UserAvatarProps) {
    const getInitials = (fullname: string) => {
        return fullname
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0,2)
    }

    if(image) {
        return (
            <Image
            width={size === "sm" ? 24 : size === "md" ? 32 : 40}
            height={size === "sm" ? 24 : size === "md" ? 32 : 40}
            src={image}
            alt={name}
            className={`${sizeClasses[size].split(" ")[0]} ${sizeClasses[size].split(" ")[1]} rounded-full object-cover`}
            />
        )
    }
  return (
    <div className={`${sizeClasses[size]} rounded-full bg-primary/20 flex items-center justify-center`}>
        <span className={`${sizeClasses[size].split(" ")[2]} font-semibold text-primary`}>
            {getInitials(name)}
        </span>
    </div>
  )
}
