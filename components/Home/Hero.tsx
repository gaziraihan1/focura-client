"use client";

import Link from "next/link";

export default function Hero() {
const totalUser = 8

  return (
    <section className="relative w-full bg-background pt-32 pb-28 overflow-hidden">

      <svg
        className="absolute top-0 left-0 w-full h-24 text-background"
        viewBox="0 0 1440 150"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,96L80,80C160,64,320,32,480,26.7C640,21,800,43,960,48C1120,53,1280,43,1360,37.3L1440,32L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
        ></path>
      </svg>

      <div
        className="absolute inset-0 pointer-events-none opacity-80 dark:opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(var(--foreground-rgb),0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(var(--foreground-rgb),0.07) 1px, transparent 1px)
          `,
          backgroundSize: "90px 60px",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)",
        }}
      />
    

      <div className="relative max-w-5xl mx-auto text-center px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-secondary text-secondary-foreground text-xs font-medium">
          ⚡ Built for fast-moving teams
        </div>

        <h1 className="mt-6 text-4xl md:text-6xl font-bold leading-tight text-foreground">
          One tool to manage <br />
          <span className="text-primary">workflows and your team</span>
        </h1>

        <p className="mt-4 max-w-2xl mx-auto text-foreground/70 text-base md:text-lg">
          Focura helps teams plan, collaborate, and execute with clarity using a
          unified workspace built for efficiency and visibility.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/get-started"
            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition"
          >
            Start for Free
          </Link>

          <Link
            href="/demo"
            className="px-6 py-3 rounded-lg border border-border font-semibold text-foreground hover:bg-muted transition bg-background z-10"
          >
            Get a Demo
          </Link>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-10 opacity-80">
          <p className="py-1 px-4 bg-accent rounded-2xl border border-border text-foreground">
            More than { totalUser } people Trust us.
          </p>
          {/* <Image src="/logos/hubspot.svg" alt="HubSpot" width={90} height={40} />
          <Image src="/logos/dropbox.svg" alt="Dropbox" width={90} height={40} />
          <Image src="/logos/square.svg" alt="Square" width={90} height={40} />
          <Image src="/logos/intercom.svg" alt="Intercom" width={90} height={40} />
          <Image src="/logos/grammarly.svg" alt="Grammarly" width={90} height={40} /> */}
        </div>
      </div>

      <svg
        className="absolute bottom-0 left-0 w-full h-24 text-background"
        viewBox="0 0 1440 150"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,0L80,13.3C160,27,320,53,480,64C640,75,800,69,960,58.7C1120,48,1280,32,1360,24L1440,16L1440,150L1360,150C1280,150,1120,150,960,150C800,150,640,150,480,150C320,150,160,150,80,150L0,150Z"
        ></path>
      </svg>
    </section>
  );
}
