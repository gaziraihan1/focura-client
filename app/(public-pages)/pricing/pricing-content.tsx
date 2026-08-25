"use client"
import BillingToggle from '@/components/public/pricing/BillingToggle';
import FeatureComparison from '@/components/public/pricing/FeatureComparison'
import PricingCards from '@/components/public/pricing/PricingCards';
import PricingFAQ from '@/components/public/pricing/PricingFaq';
import PricingHero from '@/components/public/pricing/PricingHero'
import PricingPlans from '@/components/public/pricing/PricingPlans'
import PricingSupportCTA from '@/components/public/pricing/PricingSupportCTA';
import { useState } from "react";

export default function PricingContent() {
    const [billing, setBilling] = useState<"yearly" | "monthly">("monthly");
  return (
    <div>
        <PricingHero />
        <PricingPlans />
        <FeatureComparison />
        <div className='py-20'>
        <BillingToggle billing={billing} setBilling={setBilling} />

        <PricingCards billing={billing} />
        </div>
        <PricingFAQ />
        <PricingSupportCTA />
    </div>
  )
}
