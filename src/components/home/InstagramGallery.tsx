import { Instagram } from "lucide-react";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";
import catEarrings from "@/assets/cat-earrings.jpg";
import catBangles from "@/assets/cat-bangles.jpg";
import logo from "@/assets/logo.png";

const images = [product1, product5, catEarrings, product2, catBangles, product6];

const InstagramGallery = () => (
  <section className="py-16 md:py-20 bg-secondary/30">
    <div className="container text-center mb-8">
      <img src={logo} alt="Lalisa Belle" className="h-8 mx-auto mb-3 opacity-20" />
      <h2 className="font-serif text-2xl md:text-3xl font-medium mb-2">Follow <span className="text-primary font-semibold">Lalisa Belle</span> on Instagram</h2>
      <p className="text-muted-foreground font-sans text-sm flex items-center justify-center gap-1">
        <Instagram className="w-4 h-4" /> @lalisabelle
      </p>
    </div>
    <div className="grid grid-cols-3 md:grid-cols-6 gap-1">
      {images.map((img, i) => (
        <a key={i} href="#" className="aspect-square overflow-hidden group relative">
          <img src={img} alt="Instagram" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors flex items-center justify-center">
            <Instagram className="w-6 h-6 text-background opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </a>
      ))}
    </div>
  </section>
);

export default InstagramGallery;
