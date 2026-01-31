"use client";

import { cases } from "@/constant/features.costant";
import Image from "next/image";

export default function UseCases() {
  

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold">
          Use Cases <span className="text-brand">For Any Team</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Focura adapts to your workflow — whether you&apos;re a founder,
          agency, or a remote team.
        </p>
      </div>

      <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
        {cases.map((c, i) => (
          <div
            key={i}
            className="backdrop-blur-lg bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition"
          >
            <div className="relative h-48 w-full">
              <Image src={c.img} alt={c.title} fill className="object-cover" />
            </div>
            <div className="p-6 space-y-2">
              <h3 className="text-xl font-semibold">{c.title}</h3>
              <p className="text-muted-foreground">{c.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
