import { LabelContent } from "@/components/Dashboard/Labels/LabelDetails/LabelContent";
import { use } from "react";

interface LabelPageProps {
  params: Promise<{ id: string }>;
}

export default function LabelPage({ params }: LabelPageProps) {
  const { id } = use(params);

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <LabelContent id={id} />
      </div>
    </main>
  );
}