import { LucideIcon } from "lucide-react";
import { UseFormRegister, FieldErrors, FieldValues, Path } from "react-hook-form";

interface AuthFormInputProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  type?: string;
  placeholder: string;
  icon: LucideIcon;
  register: UseFormRegister<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  disabled: boolean;
}

export function AuthFormInput<TFieldValues extends FieldValues>({
  name,
  type = "text",
  placeholder,
  icon: Icon,
  register,
  errors,
  disabled,
}: AuthFormInputProps<TFieldValues>) {
  const error = errors[name];

  return (
    <div className="relative">
      <Icon className="absolute left-3 top-3.5 text-foreground/50" size={18} />
      <input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full py-3 pl-10 pr-4 rounded-xl bg-background/60 border text-foreground placeholder:text-foreground/50 focus:ring-2 ring-primary outline-none transition ${
          error ? "border-red-500" : "border-border"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1 ml-1">
          {error.message as string}
        </p>
      )}
    </div>
  );
}