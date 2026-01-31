"use client";

import React from "react";
import { Check, Minus } from "lucide-react";
import { features } from "@/constant/pricing.constant";



export default function FeatureComparison() {
  return (
    <section className="w-full py-20" id="comparison">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Compare all plans
          </h2>
          <p className="text-muted-foreground mt-2">
            Every plan includes powerful tools, but higher tiers unlock advanced
            and collaborative features.
          </p>
        </div>

        <div className="hidden md:block overflow-hidden rounded-xl bg-card/40 backdrop-blur-xl border border-border">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-card/60 backdrop-blur-xl border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Features
                </th>
                <th className="text-center p-4 text-sm font-medium">Free</th>
                <th className="text-center p-4 text-sm font-medium">Pro</th>
                <th className="text-center p-4 text-sm font-medium">
                  Business
                </th>
              </tr>
            </thead>

            <tbody>
              {features.map((f, i) => (
                <tr
                  key={i}
                  className="border-b border-border/40 hover:bg-card/30 transition"
                >
                  <td className="p-4 text-sm">{f.name}</td>

                  <td className="text-center p-4">
                    <div className="flex justify-center items-center h-6">
                      {f.free ? (
                        <Check className="w-5 h-5 text-primary" />
                      ) : (
                        <Minus className="w-4 h-4 text-muted-foreground/50" />
                      )}
                    </div>
                  </td>

                  <td className="text-center p-4">
                    <div className="flex justify-center items-center h-6">
                      {f.pro ? (
                        <Check className="w-5 h-5 text-primary" />
                      ) : (
                        <Minus className="w-4 h-4 text-muted-foreground/50" />
                      )}
                    </div>
                  </td>

                  <td className="text-center p-4">
                    <div className="flex justify-center items-center h-6">
                      {f.business ? (
                        <Check className="w-5 h-5 text-primary" />
                      ) : (
                        <Minus className="w-4 h-4 text-muted-foreground/50" />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-4 mt-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="rounded-xl bg-card/30 backdrop-blur-xl border border-border p-4"
            >
              <h3 className="text-base font-medium mb-3">{f.name}</h3>

              <div className="grid grid-cols-3 text-center text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Free</p>
                  {f.free ? (
                    <Check className="w-5 h-5 text-primary mx-auto" />
                  ) : (
                    <Minus className="w-4 h-4 text-muted-foreground/50 mx-auto" />
                  )}
                </div>

                <div>
                  <p className="text-muted-foreground text-xs mb-1">Pro</p>
                  {f.pro ? (
                    <Check className="w-5 h-5 text-primary mx-auto" />
                  ) : (
                    <Minus className="w-4 h-4 text-muted-foreground/50 mx-auto" />
                  )}
                </div>

                <div>
                  <p className="text-muted-foreground text-xs mb-1">Business</p>
                  {f.business ? (
                    <Check className="w-5 h-5 text-primary mx-auto" />
                  ) : (
                    <Minus className="w-4 h-4 text-muted-foreground/50 mx-auto" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
