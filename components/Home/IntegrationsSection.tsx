"use client";

import React from "react";
import Image from "next/image";

export default function IntegrationsSection() {
  const integrations = [
    { name: "Slack", logo: "/integrations/slack.png" },
    { name: "Notion", logo: "/integrations/notion.png" },
    { name: "Google Drive", logo: "/integrations/drive.png" },
    { name: "Figma", logo: "/integrations/figma.png" },
    { name: "Asana", logo: "/integrations/asana.png" },
    { name: "Trello", logo: "/integrations/trello.png" },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-foreground">
          Works seamlessly with your tools
        </h2>
        <p className="mt-4 text-lg text-foreground/70 max-w-2xl mx-auto">
          Connect Focura with your favorite apps and keep your workflow unified
          across platforms.
        </p>

        <div
          className="
            mt-20 
            grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 
            lg:grid-cols-6 gap-6
          "
        >
          {integrations.map((item, index) => (
            <div
              key={index}
              className="
                p-6 rounded-2xl border border-border/50 
                bg-white/20 dark:bg-white/5 
                backdrop-blur-xl
                shadow-lg
                flex flex-col items-center justify-center gap-4 
                hover:scale-[1.04] hover:shadow-xl
                transition-all duration-300 cursor-pointer
              "
            >
              <div className="relative w-14 h-14">
                <Image
                  src={item.logo}
                  alt={item.name}
                  fill
                  className="object-contain"
                />
              </div>

              <p className="font-medium text-foreground">{item.name}</p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <button className="bg-primary text-primary-foreground px-6 py-3 rounded-full text-lg font-semibold hover:opacity-90 transition">
            Explore All Integrations
          </button>
        </div>
      </div>
    </section>
  );
}
