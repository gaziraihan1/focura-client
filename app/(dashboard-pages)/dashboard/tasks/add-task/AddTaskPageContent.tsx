"use client";

import { TaskFormHeader } from "@/components/Tasks/form/TaskFormHeader";
import { AddTaskForm } from "@/components/Tasks/form/AddTaskForm";
import { useAddTaskPage } from "@/hooks/useAddTaskPage";

export function AddTaskPageContent() {
  const {
    formData,
    errors,
    isLoading,
    handleSubmit,
    handleCancel,
    updateFormData,
    applyAiSuggestion,
    applyAiPartial,
  } = useAddTaskPage();

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 lg:px-6">
      <TaskFormHeader onCancel={handleCancel} />

      <AddTaskForm
        formData={formData}
        errors={errors}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onFieldChange={updateFormData}
        workspaceId={null}
        onApplyAiSuggestion={applyAiSuggestion}
        onApplyAiPartial={applyAiPartial}
      />
    </div>
  );
}
