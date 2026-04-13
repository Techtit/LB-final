import AnimatedSection from "@/components/AnimatedSection";
import HeroSection from "@/components/home/HeroSection";
import ProductCarouselStrip from "@/components/home/ProductCarouselStrip";
import PromoBanner from "@/components/home/PromoBanner";
import CategorySection from "@/components/home/CategorySection";
import BestSellersSection from "@/components/home/BestSellersSection";
import BudgetCollections from "@/components/home/BudgetCollections";
import NewArrivals from "@/components/home/NewArrivals";
import TrustIndicators from "@/components/home/TrustIndicators";
import ReviewsSection from "@/components/home/ReviewsSection";
import InstagramGallery from "@/components/home/InstagramGallery";
import EntryPrompt from "@/components/home/EntryPrompt";
import PremiumSection from "@/components/home/PremiumSection";

import { Helmet } from "react-helmet-async";

const Index = () => (
  <>
    <Helmet>
      <title>Lalisa Belle — Elegant Oxidized Jewellery</title>
      <meta name="description" content="Discover stunning oxidized jewellery at affordable prices." />
    </Helmet>
    <EntryPrompt />
    <HeroSection />
    <ProductCarouselStrip />
    <PromoBanner />
    <AnimatedSection>
      <CategorySection />
    </AnimatedSection>
    <AnimatedSection>
      <PremiumSection />
    </AnimatedSection>
    <AnimatedSection>
      <BestSellersSection />
    </AnimatedSection>
    <AnimatedSection delay={0.1}>
      <BudgetCollections />
    </AnimatedSection>
    <AnimatedSection>
      <NewArrivals />
    </AnimatedSection>
    <AnimatedSection>
      <TrustIndicators />
    </AnimatedSection>
    <AnimatedSection delay={0.1}>
      <ReviewsSection />
    </AnimatedSection>
    <AnimatedSection>
      <InstagramGallery />
    </AnimatedSection>
  </>
);

export default Index;
