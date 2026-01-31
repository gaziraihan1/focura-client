"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { features } from "@/constant/features.costant";

export default function FeaturesDetails() {
 
  return (
    <section className="relative py-28 bg-background">
      <div className="absolute -top-12 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[120px] opacity-40" />
      <div className="absolute -bottom-12 left-0 w-80 h-80 bg-primary/10 rounded-full blur-[120px] opacity-40" />

      <div className="relative max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-bold text-foreground text-center mb-20">
          Powerful features designed for modern teams
        </h2>

        <div className="flex flex-col gap-28">
          {features.map((f, i) => (
            <div
              key={i}
              className={`
                flex flex-col-reverse md:flex-row items-center gap-12 
                ${i % 2 !== 0 ? "md:flex-row-reverse" : ""}
              `}
            >
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-semibold text-foreground">
                  {f.title}
                </h3>
                <p className="text-foreground/70 mt-4 leading-relaxed">
                  {f.desc}
                </p>

                <ul className="mt-6 space-y-3">
                  {f.points.map((p, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-foreground/80"
                    >
                      <CheckCircle size={20} className="text-primary" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="
                flex-1 rounded-2xl overflow-hidden 
                bg-background/40 backdrop-blur-xl border border-border shadow-xl
              "
              >
                <Image
                  src={f.img}
                  alt={f.title}
                  width={1200}
                  height={900}
                  className="w-full h-full object-cover transition-all hover:scale-105"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
