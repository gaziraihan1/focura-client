"use client";

import { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import { testimonials } from "@/constants/home.constants";

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function TestimonialSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const current = testimonials[index];

  return (
    <section className="relative py-24 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-linear-to-b from-muted/30 via-transparent to-transparent pointer-events-none" />
      <div className="relative max-w-5xl mx-auto px-6 text-center">
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
          Testimonials
        </span>
        <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight text-foreground">
          Loved by teams everywhere
        </h2>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
          Thousands of teams rely on Focura to stay aligned and work smarter.
        </p>

        <div className="relative mx-auto mt-14 w-full max-w-2xl min-h-70">
          <Quote
            size={40}
            className="absolute -top-5 left-2 text-muted-foreground/20"
            aria-hidden="true"
          />
          <div
            key={index}
            className="flex h-full flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 shadow-xl shadow-foreground/5 animate-in fade-in duration-500"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground text-lg font-bold text-background ring-4 ring-muted">
              {initialsOf(current.name)}
            </div>

            <p className="mt-6 text-lg md:text-xl text-foreground leading-relaxed">
              “{current.quote}”
            </p>

            <div className="mt-6">
              <h3 className="text-base font-semibold text-foreground">{current.name}</h3>
              <p className="text-sm text-muted-foreground">{current.role}</p>
            </div>

            <div className="mt-4 flex justify-center gap-1">
              {[...Array(current.rating)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className="fill-foreground text-foreground"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center gap-2.5">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Show testimonial ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === i ? "w-6 bg-foreground" : "w-2 bg-foreground/20 hover:bg-foreground/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
