import { Star, Quote } from "lucide-react";
import { reviews } from "@/data/products";

const ReviewsSection = () => (
  <section className="py-16 md:py-20">
    <div className="container">
      <div className="text-center mb-10">
        <h2 className="font-serif text-2xl md:text-3xl font-medium mb-2">What Our Customers Say</h2>
        <p className="text-muted-foreground font-sans text-sm">Real reviews from happy <span className="text-primary font-semibold">Lalisa Belle</span> customers</p>
        <div className="flex items-center justify-center gap-1 mt-3">
          {Array.from({ length: 5 }).map((_, j) => (
            <Star key={j} className="w-5 h-5 fill-primary text-primary" />
          ))}
          <span className="text-sm font-sans font-medium ml-2">4.9/5 Average Rating</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {reviews.map((review, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-6 hover:border-primary/30 hover:shadow-md transition-all">
            <Quote className="w-5 h-5 text-primary/30 mb-2" />
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: review.rating }).map((_, j) => (
                <Star key={j} className="w-3.5 h-3.5 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed mb-4 font-sans">"{review.text}"</p>
            <p className="text-xs font-semibold text-foreground">— {review.name}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ReviewsSection;
