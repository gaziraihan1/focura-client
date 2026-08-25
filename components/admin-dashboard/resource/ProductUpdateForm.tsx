"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { StatusSelect } from "./StatusSelect";
import { useCreateProductUpdate } from "@/hooks/useResource";
import { useUpdateProductUpdate } from "@/hooks/useResource";
import type { ProductUpdateDTO } from "@/types/resource.types";

const schema = z.object({
  title: z.string().trim().min(3, "Title is too short").max(150),
  date: z.string().min(1, "Pick a date"),
  description: z.string().trim().min(10, "Add a bit more detail").max(4000),
  version: z.string().trim().min(1, "Version is required").max(40),
  status: z.enum(["DRAFT", "PUBLIC", "ARCHIVE"]),
});

type FormValues = z.infer<typeof schema>;

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";
const labelClass = "mb-1.5 block text-sm font-medium text-foreground";

interface ProductUpdateFormProps {
  onSuccess?: () => void;
  /** When provided, the form switches to edit mode */
  editData?: ProductUpdateDTO;
}

export function ProductUpdateForm({ onSuccess, editData }: ProductUpdateFormProps) {
  const isEditing = !!editData;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { status: "DRAFT" },
  });

  // Populate form when switching to edit mode
  useEffect(() => {
    if (editData) {
      // Normalise date to YYYY-MM-DD for <input type="date">
      const dateValue = editData.date
        ? new Date(editData.date).toISOString().split("T")[0]
        : "";
      reset({
        title: editData.title,
        date: dateValue,
        description: editData.description,
        version: editData.version,
        status: editData.status,
      });
    } else {
      reset({  title: "", date: "", description: "", version: "", status: "DRAFT" });
    }
  }, [editData, reset]);

  const { mutateAsync: create, isPending: isCreating, error: createError } = useCreateProductUpdate();
  const { mutateAsync: update, isPending: isUpdating, error: updateError } = useUpdateProductUpdate();

  const isPending = isCreating || isUpdating;
  const error = createError ?? updateError;
  const status = watch("status");

  const onSubmit = async (values: FormValues) => {
    if (isEditing) {
      await update({ slug: editData.slug, payload: values });
    } else {
      await create(values);
      reset({  title: "", date: "", description: "", version: "", status: "DRAFT" });
    }
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      

      <div>
        <label htmlFor="update-title" className={labelClass}>
          Title
        </label>
        <input id="update-title" {...register("title")} className={inputClass} />
        {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="update-date" className={labelClass}>
            Date
          </label>
          <input
            id="update-date"
            type="date"
            {...register("date")}
            className={inputClass}
          />
          {errors.date && <p className="mt-1 text-xs text-destructive">{errors.date.message}</p>}
        </div>

        <div>
          <label htmlFor="update-version" className={labelClass}>
            Version
          </label>
          <input
            id="update-version"
            placeholder="2.4.0"
            {...register("version")}
            className={inputClass}
          />
          {errors.version && (
            <p className="mt-1 text-xs text-destructive">{errors.version.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="update-description" className={labelClass}>
          Description
        </label>
        <textarea
          id="update-description"
          rows={4}
          {...register("description")}
          className={inputClass}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>

      <StatusSelect
        id="update-status"
        value={status}
        onChange={(v) => setValue("status", v)}
        disabled={isSubmitting}
      />

      {error && <p className="text-sm text-destructive">{error.message}</p>}

      <button
        type="submit"
        disabled={isPending || isSubmitting}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        {isPending
          ? isEditing
            ? "Saving…"
            : "Creating…"
          : isEditing
            ? "Save changes"
            : "Save product update"}
      </button>
    </form>
  );
}