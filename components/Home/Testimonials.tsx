"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";

export default function TestimonialSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Designer",
      quote:
        "Focura completely streamlined our team’s workflow. The clarity and speed it brings is unmatched.",
      avatar: "/mnt/data/bea22d29-b167-4c3d-a1db-37e2282056e6.png",
      rating: 5,
    },
    {
      name: "Michael Lee",
      role: "Team Manager",
      quote:
        "We reduced project delivery time by 40% after switching to Focura. It keeps everyone aligned.",
      avatar: "/mnt/data/bea22d29-b167-4c3d-a1db-37e2282056e6.png",
      rating: 5,
    },
    {
      name: "Alicia Gomez",
      role: "Operations Lead",
      quote:
        "Beautiful UI, smart features, and frictionless collaboration. Focura is built for modern teams.",
      avatar: "/mnt/data/bea22d29-b167-4c3d-a1db-37e2282056e6.png",
      rating: 5,
    },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 4000); 
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section className="relative py-28 overflow-hidden">

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-foreground">
          Loved by teams everywhere
        </h2>
        <p className="mt-4 text-foreground/70 max-w-xl mx-auto">
          Thousands of teams rely on Focura to stay aligned and work smarter.
        </p>

        <div className="mt-20 flex justify-center">
          <div className="relative w-full max-w-xl min-h-80">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="
                absolute inset-0 
                p-8 rounded-3xl shadow-xl 
                border border-white/20 dark:border-white/10
                backdrop-blur-xl bg-white/40 dark:bg-white/5
                flex flex-col items-center justify-center text-center
              "
              >
                <Image
                width={80}
                height={80}
                  src={testimonials[index].avatar}
                  alt={testimonials[index].name}
                  className="w-20 h-20 rounded-full object-cover border border-white/30 shadow-md"
                />

                <p className="mt-6 text-lg md:text-xl text-foreground/90 leading-relaxed">
                  “{testimonials[index].quote}”
                </p>

                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-foreground">
                    {testimonials[index].name}
                  </h3>
                  <p className="text-foreground/60 text-sm">
                    {testimonials[index].role}
                  </p>
                </div>

                <div className="mt-4 flex justify-center gap-1">
                  {[...Array(testimonials[index].rating)].map((_, i) => (
                    <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-10 flex justify-center gap-3">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`
                w-3 h-3 rounded-full transition-all
                ${index === i ? "bg-primary w-6" : "bg-foreground/30"}
              `}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
