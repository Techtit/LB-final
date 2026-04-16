import { Helmet } from "react-helmet-async";
import AnimatedSection from "@/components/AnimatedSection";

const About = () => {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <Helmet>
        <title>About Us — Lalisa Belle</title>
        <meta name="description" content="Lean more about Lalisa Belle and our mission to provide high-quality imitation jewellery." />
      </Helmet>

      <div className="container max-w-4xl px-4 mx-auto">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h1 className="font-serif text-4xl md:text-5xl text-[#b88645] mb-6">About Lalisa Belle</h1>
            <div className="w-24 h-1 bg-[#b88645]/30 mx-auto"></div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="prose prose-stone max-w-none">
            <h2 className="font-serif text-2xl text-[#222] mb-6">Imitation, Artificial Jewellery Store</h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed italic mb-8 border-l-4 border-[#b88645] pl-6 py-2">
              "LALISA BELLE offers a stunning collection of high-quality imitation jewellery that blends elegance with affordability."
            </p>

            <div className="space-y-6 text-foreground/80 leading-loose text-lg font-sans">
              <p>
                From traditional ethnic to minimalistic designs to modern chic styles, our curated pieces are perfect for weddings, parties, everyday wear, and gifting.
              </p>
              
              <p>
                Crafted with precision and made to last, our jewellery gives you the luxury look without the premium price. Visit us for the latest trends in necklaces, earrings, bangles, rings, and more.
              </p>

              <p className="font-serif text-2xl text-[#b88645] pt-8">
                Sparkle in style — without compromise!
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default About;
