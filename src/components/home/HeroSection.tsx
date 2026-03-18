import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroBanner from "@/assets/Bg1.jpg";

const HeroSection = () => (
  <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-start md:items-center">
    <div className="absolute inset-0">
      <img src={heroBanner} alt="Lalisa Belle Jewellery" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
    </div>
    <div className="container relative z-10 pt-10 md:pt-0">
      <div className="max-w-lg text-background">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-tight mb-4">
          Affordable Elegance for Everyday Style
        </h1>
        <p className="text-base md:text-lg opacity-80 mb-6 font-sans leading-relaxed">
          Discover stunning oxidized jewellery that looks premium without the premium price tag.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" className="font-sans tracking-wide shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground border-0">
            <Link to="/shop?filter=bestsellers">Shop Best Sellers</Link>
          </Button>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
