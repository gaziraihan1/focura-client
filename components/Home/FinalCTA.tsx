import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="w-full py-24 bg-background">
      <div className="mx-auto max-w-5xl px-6">

        <div className="
          relative
          bg-foreground/5
          backdrop-blur-xl
          border border-border
          rounded-3xl 
          p-10 md:p-16 
          text-center
          shadow-[0_0_30px_-5px_rgba(0,0,0,0.3)]
          dark:shadow-[0_0_30px_-5px_rgba(255,255,255,0.12)]
        ">
          
          <div className="absolute inset-0 -z-10 rounded-3xl 
            bg-linear-to-br from-foreground/10 to-transparent 
            blur-2xl opacity-10">
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Boost Your Productivity —
            <br />
            <span className="text-primary">
              Start Working Smarter Today
            </span>
          </h2>

          <p className="text-foreground/70 max-w-2xl mx-auto mt-5 text-lg md:text-xl leading-relaxed">
            Join thousands of professionals who trust Focura to streamline tasks,
            organize projects, and scale with confidence.
          </p>

          <div className="mt-10">
            <Link
            href={'https://focura-waitlist.web.app'}
              className="
                px-8 py-4 
                bg-primary text-background 
                font-semibold rounded-full 
                hover:opacity-90 
                transition 
                shadow-lg shadow-primary/20
              "
            >
              Join The Waitlist
            </Link>
          </div>

          <p className="text-foreground/60 text-sm mt-6">
            No credit card required. Cancel anytime.
          </p>

        </div>
        
      </div>
    </section>
  );
}
