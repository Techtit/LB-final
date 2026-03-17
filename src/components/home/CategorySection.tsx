import { Link } from "react-router-dom";
import catEarrings from "@/assets/cat-earrings.jpg";
import catNecklaces from "@/assets/cat-necklaces.jpg";
import catBangles from "@/assets/cat-bangles.jpg";
import catRings from "@/assets/cat-rings.jpg";

const cats = [
  { name: "Earrings", image: catEarrings, slug: "earrings", count: "50+" },
  { name: "Necklaces", image: catNecklaces, slug: "necklaces", count: "30+" },
  { name: "Bangles", image: catBangles, slug: "bangles", count: "25+" },
  { name: "Rings", image: catRings, slug: "rings", count: "20+" },
];

const CategorySection = () => (
  <section className="py-16 md:py-20">
    <div className="container">
      <div className="text-center mb-10">
        <h2 className="font-serif text-2xl md:text-3xl font-medium mb-2">Shop by Category</h2>
        <p className="text-muted-foreground font-sans text-sm">Find your perfect <span className="text-primary font-semibold">Lalisa Belle</span> piece</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {cats.map((cat) => (
          <Link key={cat.slug} to={`/shop?category=${cat.slug}`} className="group relative overflow-hidden rounded-lg aspect-[3/4] shadow-md hover:shadow-xl transition-shadow">
            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="font-serif text-lg md:text-xl text-background font-medium">{cat.name}</h3>
              <span className="text-xs text-background/70 font-sans tracking-wider uppercase">{cat.count} Styles →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default CategorySection;
