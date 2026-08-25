"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { StatusSelect } from "./StatusSelect";
import { useCreatePopularResource, useUpdatePopularResource } from "@/hooks/useResource";
import type { PopularResourceDTO } from "@/types/resource.types";

const schema = z.object({
  title: z.string().trim().min(3, "Title is too short").max(150),
  description: z.string().trim().min(10, "Add a bit more detail").max(2000),
  image: z.string().trim().url("Enter a valid image URL"),
  category: z.string().trim().min(2, "Category is required").max(60),
  status: z.enum(["DRAFT", "PUBLIC", "ARCHIVE"]),
});

type FormValues = z.infer<typeof schema>;

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";
const labelClass = "mb-1.5 block text-sm font-medium text-foreground";

interface PopularResourceFormProps {
  onSuccess?: () => void;
  /** When provided, the form switches to edit mode */
  editData?: PopularResourceDTO;
}

export function PopularResourceForm({ onSuccess, editData }: PopularResourceFormProps) {
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
      reset({
        title: editData.title,
        description: editData.description,
        image: editData.image,
        category: editData.category,
        status: editData.status,
      });
    } else {
      reset({ title: "", description: "", image: "", category: "", status: "DRAFT" });
    }
  }, [editData, reset]);

  const { mutateAsync: create, isPending: isCreating, error: createError } = useCreatePopularResource();
  const { mutateAsync: update, isPending: isUpdating, error: updateError } = useUpdatePopularResource();

  const isPending = isCreating || isUpdating;
  const error = createError ?? updateError;
  const status = watch("status");

  const onSubmit = async (values: FormValues) => {
    if (isEditing) {
      await update({ slug: editData.slug, payload: values });
    } else {
      await create(values);
      reset({ title: "", description: "", image: "", category: "", status: "DRAFT" });
    }
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="popular-title" className={labelClass}>
          Title
        </label>
        <input id="popular-title" {...register("title")} className={inputClass} />
        {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="popular-description" className={labelClass}>
          Description
        </label>
        <textarea
          id="popular-description"
          rows={4}
          {...register("description")}
          className={inputClass}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="popular-image" className={labelClass}>
          Image URL
        </label>
        <input
          id="popular-image"
          placeholder="https://..."
          {...register("image")}
          className={inputClass}
        />
        {errors.image && <p className="mt-1 text-xs text-destructive">{errors.image.message}</p>}
      </div>

      <div>
        <label htmlFor="popular-category" className={labelClass}>
          Category
        </label>
        <input
          id="popular-category"
          placeholder="Guide, Tutorial, Tool…"
          {...register("category")}
          className={inputClass}
        />
        {errors.category && (
          <p className="mt-1 text-xs text-destructive">{errors.category.message}</p>
        )}
      </div>

      <StatusSelect
        id="popular-status"
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
            : "Save popular resource"}
      </button>
    </form>
  );
}