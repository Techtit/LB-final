import { Star, Quote } from "lucide-react";
import { reviews } from "@/data/products";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const ReviewsSection = () => {
  const [emblaRef] = useEmblaCarousel(
    { 
      loop: true, 
      align: "start",
      slidesToScroll: 3,
    }, 
    [Autoplay({ delay: 6000, stopOnInteraction: false })]
  );

  return (
    <section className="py-16 md:py-24 bg-stone-50/50">
      <div className="container overflow-hidden">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-medium mb-3">What Our Customers Say</h2>
          <p className="text-muted-foreground font-sans text-base">Real reviews from happy <span className="text-primary font-semibold">Lalisa Belle</span> customers</p>
          <div className="flex items-center justify-center gap-1 mt-4">
            {Array.from({ length: 5 }).map((_, j) => (
              <Star key={j} className="w-5 h-5 fill-primary text-primary" />
            ))}
            <span className="text-sm font-sans font-medium ml-3">4.9/5 Average Rating</span>
          </div>
        </div>

        <div className="relative px-4">
          <div className="embla" ref={emblaRef}>
            <div className="embla__container flex -ml-6 md:-ml-8">
              {reviews.map((review, i) => (
                <div key={i} className="embla__slide flex-[0_0_100%] md:flex-[0_0_33.333%] pl-6 md:pl-8 py-4">
                  <div className="h-full bg-white border border-stone-200/60 rounded-2xl p-8 md:p-10 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 group relative">
                    <Quote className="absolute top-6 right-8 w-10 h-10 text-primary/5 group-hover:text-primary/10 transition-colors" />
                    
                    <div className="flex gap-1 mb-5">
                      {Array.from({ length: review.rating }).map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>

                    <p className="text-[15px] text-foreground/80 leading-relaxed mb-6 font-sans italic">
                      "{review.text}"
                    </p>

                    <div className="mt-auto flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20 uppercase">
                        {review.name[0]}
                      </div>
                      <p className="text-sm font-semibold text-foreground tracking-tight">— {review.name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
