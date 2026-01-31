"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { features } from "@/constant/home.constant";

export default function FeatureShowcase() {
  

  return (
    <section className="py-28 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-bold text-center text-foreground">
          Powerful features that help your team move faster
        </h2>
        <p className="mt-4 text-center text-foreground/70 max-w-2xl mx-auto">
          Everything you need to plan, collaborate, and execute — in one
          beautifully designed system.
        </p>

        <div className="mt-24 space-y-32">
          {features.map((f, index) => (
            <div
              key={index}
              className={`flex flex-col items-center gap-16 md:gap-24 ${
                f.reverse
                  ? "md:flex-row-reverse"
                  : "md:flex-row"
              }`}
            >
              <div className="flex-1 relative rounded-3xl overflow-hidden 
                bg-white/30 dark:bg-white/5 backdrop-blur-xl 
                border border-border shadow-xl h-[300px] md:h-[360px]"
              >
                <Image
                  src={f.image}
                  alt={f.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                  {f.title}
                </h3>
                <p className="mt-4 text-foreground/70 text-lg leading-relaxed">
                  {f.desc}
                </p>

                <button className="mt-6 inline-flex items-center gap-2 text-primary font-semibold hover:opacity-80">
                  Learn more <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
