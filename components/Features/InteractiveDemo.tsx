"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";

export default function InteractiveDemo() {
  return (
    <section className="relative w-full py-28 overflow-hidden">
      <div className="absolute top-0 left-1/3 w-[350px] h-[350px] bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-secondary/20 blur-[140px] rounded-full pointer-events-none"></div>

      <div className="relative max-w-6xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            Experience how <span className="text-primary">Focura</span> works
          </h2>

          <p className="mt-4 text-foreground/70 max-w-2xl mx-auto">
            Get a quick look at how teams plan, collaborate, and execute using
            Focura’s modern and intuitive workspace.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="
            relative mx-auto 
            bg-background/40 backdrop-blur-xl 
            border border-border/40 
            shadow-[0_15px_45px_-10px_rgba(0,0,0,0.15)]
            rounded-3xl overflow-hidden
            max-w-4xl
          "
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="
              absolute inset-0 flex items-center justify-center
              z-20 cursor-pointer
            "
          >
            <div className="w-20 h-20 rounded-full bg-background/60 backdrop-blur-xl border border-border/40 flex items-center justify-center shadow-lg">
              <PlayCircle size={48} className="text-primary" />
            </div>
          </motion.div>

          <div className="absolute inset-0 bg-linear-to-b from-black/20 to-black/30 z-10"></div>

          <Image
            src="/demo-preview.png" 
            alt="Focura Demo"
            width={1600}
            height={900}
            priority
            className="w-full object-cover"
          />
        </motion.div>

        <div className="text-center mt-12">
          <p className="text-foreground/70 mb-6">
            Want to explore more? Take a full tour of the Focura platform.
          </p>

          <button
            className="
              px-8 py-3 rounded-lg 
              bg-primary text-primary-foreground 
              font-semibold shadow-md 
              hover:opacity-90 transition
            "
          >
            Launch Full Demo
          </button>
        </div>
      </div>
    </section>
  );
}
