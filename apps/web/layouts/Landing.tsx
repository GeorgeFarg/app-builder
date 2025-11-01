

import Link from 'next/link';
import Image from 'next/image';
import HeroSection from "../components/landing/Hero"
import BestAIModelSection from "../components/landing/BestAi"
import PricingCard from "../components/landing/Pricing"
import InnovationSection from "../components/landing/Innovation"
import FeatureCard from "../components/landing/FeatureCard"
import DifferenceSection from "../components/landing/Difference"
import AmazingExperienceCTA from "../components/landing/CTA"
import TestimonialsSection from "../components/landing/Testomonials"
import NewsletterSection from "../components/landing/NewsLetter"

const Landing = () => {
  return (
        <>
            <HeroSection />
            <BestAIModelSection />
            <InnovationSection />
            <DifferenceSection />
            <AmazingExperienceCTA />
            <TestimonialsSection />
            <NewsletterSection />
        </>
  )
}

export default Landing