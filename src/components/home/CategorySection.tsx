import { Link } from "react-router-dom";
import catEarrings from "@/assets/cat-earrings.jpg";
import catNecklaces from "@/assets/cat-necklaces.jpg";
import catBangles from "@/assets/cat-bangles.jpg";
import catRings from "@/assets/cat-rings.jpg";
import catHair from "@/assets/product-1.jpg"; // Placeholder
import catPremium from "@/assets/hero-banner.jpg"; // Placeholder

const cats = [
  { name: "Earrings", image: catEarrings, slug: "Earrings", count: "50+" },
  { name: "Necklaces", image: catNecklaces, slug: "Necklaces", count: "30+" },
  { name: "Bangles", image: catBangles, slug: "Bangles", count: "25+" },
  { name: "Rings", image: catRings, slug: "Rings", count: "20+" },
  { name: "Hair Accessories", image: catHair, slug: "Hair Accessories", count: "15+" },
  { name: "Premium", image: catPremium, slug: "Premium", count: "Exquisite" },
];

const CategorySection = () => (
  <section className="py-16 md:py-20">
    <div className="container">
      <div className="text-center mb-10">
        <h2 className="font-serif text-2xl md:text-3xl font-medium mb-2">Shop by Category</h2>
        <p className="text-muted-foreground font-sans text-sm">Find your perfect <span className="text-primary font-semibold">Lalisa Belle</span> piece</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 border-amber-500/10">
        {cats.map((cat) => (
          <Link key={cat.slug} to={`/shop?category=${cat.slug}`} className="group relative overflow-hidden rounded-lg aspect-[3/4] shadow-md hover:shadow-amber-500/20 hover:-translate-y-1 transition-all duration-300">
            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="font-serif text-lg text-white font-medium drop-shadow-sm">{cat.name}</h3>
              <span className="text-xs text-amber-500/90 font-sans tracking-wider uppercase font-semibold">{cat.count}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default CategorySection;
