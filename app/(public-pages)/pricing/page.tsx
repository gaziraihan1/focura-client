"use client"
import BillingToggle from '@/components/Pricing/BillingToggle';
import FeatureComparison from '@/components/Pricing/FeatureComparison'
import PricingCards from '@/components/Pricing/PricingCards';
import PricingFAQ from '@/components/Pricing/PricingFaq';
import PricingHero from '@/components/Pricing/PricingHero'
import PricingPlans from '@/components/Pricing/PricingPlans'
import PricingSupportCTA from '@/components/Pricing/PricingSupportCTA';
import React, { useState } from 'react'

export default function Pricing() {
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
