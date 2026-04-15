import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { motion } from "framer-motion";

const categoryImages: Record<string, { src: string; pos?: string }[]> = {
  Women: [
    { src: "/hero/15-20-women.png" },
    { src: "/hero/20-50-women.jpg" },
    { src: "/hero/50-80-women.png" },
  ],
  Men: [
    { src: "/hero/15-20-men.png" },
    { src: "/hero/20-50-men.jpeg" },
    { src: "/hero/50-80-men.png", pos: "object-[15%_center] md:object-center" },
  ],
  Kids: [
    { src: "/hero/15-20-women.png" },
    { src: "/hero/20-50-women.jpg" },
    { src: "/hero/50-80-women.png" },
  ],
  Pets: [
    { src: "/hero/bgpets.jpg" },
  ],
};

const categories = ["Women", "Men", "Kids", "Pets"];
const genders = ["Women", "Men"];

const heroCopy: Record<string, { title: string; body: string }> = {
  Women: {
    title: "Elegance for the Modern Woman",
    body: "Personalized jewellery designed for your aesthetic. Discover stunning pieces that look premium without the premium price tag."
  },
  Men: {
    title: "Bold Style for the Modern Man",
    body: "Express your unique aesthetic. Edgy oxidized picks that level up your everyday fit."
  },
  Kids: {
    title: "Whimsical Wonders for Kids",
    body: "Delicate and durable designs for the little ones. Jewellery that brings a sparkle to their everyday adventures."
  },
  Pets: {
    title: "Premium Accessories for Pets",
    body: "Style doesn't stop with you. Discover elegant pieces crafted specifically for your furry companions."
  },
  General: {
    title: "Affordable Elegance for Everyday Style",
    body: "Personalized jewellery designed for your aesthetic. Discover stunning pieces that look premium without the premium price tag."
  }
};

const HeroSection = () => {
  const { isSignedIn } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return sessionStorage.getItem("selectedCategory") || "Women";
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDefaultImageLoaded, setIsDefaultImageLoaded] = useState(false);

  // Sync category from EntryPrompt custom event
  useEffect(() => {
    const handleCategoryChange = (e: any) => {
      if (e.detail) {
        setSelectedCategory(e.detail);
        setCurrentImageIndex(0);
      }
    };

    window.addEventListener("lb-category-selected", handleCategoryChange);
    return () => window.removeEventListener("lb-category-selected", handleCategoryChange);
  }, []);
  // Preload first images of each category
  useEffect(() => {
    const imagesToPreload = [
      "/hero/20-50-women.jpg",
      "/hero/20-50-men.jpeg",
      "/hero/bgpets.jpg"
    ];
    
    let loadedCount = 0;
    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === imagesToPreload.length) setIsDefaultImageLoaded(true);
      };
      if (img.complete) {
        loadedCount++;
        if (loadedCount === imagesToPreload.length) setIsDefaultImageLoaded(true);
      }
    });

    // Fallback if images fail to load or are already cached but listeners don't fire
    const timer = setTimeout(() => setIsDefaultImageLoaded(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Background cycling effect
  useEffect(() => {
    const images = categoryImages[selectedCategory] || [];
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4000); // Cycle every 4 seconds

    return () => clearInterval(interval);
  }, [selectedCategory]);

  if (!isDefaultImageLoaded) {
    return <div className="h-screen bg-black" />;
  }

  const currentCopy = heroCopy[selectedCategory] || heroCopy.General;

  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] flex flex-col md:flex-row md:items-center overflow-hidden">
      <div className="absolute inset-0 bg-black">
        {Object.entries(categoryImages).flatMap(([cat, images]) => 
          images.map((img, idx) => (
            <img
              key={`${cat}-${idx}`}
              src={img.src}
              alt={`Hero Background ${cat} ${idx}`}
              className={`absolute inset-0 w-full h-full object-cover ${img.pos || 'object-center'} transition-opacity duration-1000 ease-in-out ${
                selectedCategory === cat && currentImageIndex === idx ? "opacity-100 z-0" : "opacity-0 -z-10"
              }`}
            />
          ))
        )}
        {/* Gradient overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/70 md:bg-gradient-to-r md:from-black/80 md:via-black/50 md:to-transparent z-10" />
      </div>

      {/* Content */}
      <div className="container relative z-20 flex-1 flex flex-col justify-between md:justify-center pt-24 pb-8 md:py-0 mt-4 md:mt-0">
        <div className="max-w-xl text-white">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-tight mb-4 drop-shadow-md">
             {currentCopy.title}
          </h1>
          <motion.p 
            animate={{ opacity: [1, 0, 1] }} 
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} 
            className="text-base md:text-lg mb-8 font-sans leading-relaxed drop-shadow-sm max-w-md"
          >
            {currentCopy.body}
          </motion.p>
        </div>

        <div className="flex flex-wrap gap-4 mt-auto md:mt-8 pb-4 md:pb-0">
          <Button
            asChild
            size="lg"
            className="w-[85%] mx-auto md:mx-0 md:w-auto font-sans tracking-wide shadow-[0_4px_20px_0_rgba(161,103,35,0.4)] bg-gradient-to-r from-[#b88645] to-[#7a5525] hover:opacity-90 text-white border-0 h-11 md:h-12 px-6 md:px-8 text-[15px] md:text-base transition-transform hover:scale-105"
          >
            <Link to={`/shop?segment=${selectedCategory}`}>Shop Collection</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
