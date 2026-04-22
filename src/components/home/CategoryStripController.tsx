import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CategorySelectorStrip from "./CategorySelectorStrip";

type Segment = "Women" | "Men" | "Kids" | "Pets";

const categoryMap: Record<Segment, string[]> = {
  Women: ["Earrings", "Necklaces", "Bangles", "Rings", "Hair Accessories", "Bracelets", "Premium"],
  Men: ["Chains", "Bracelets", "Rings", "Pendants", "Premium"],
  Kids: ["Earrings", "Bracelets", "Necklaces", "Rings", "Hair Accessories", "Cute Collection", "Premium"],
  Pets: ["Collars", "Tags", "Charms", "Premium"],
};

const CategoryStripController = () => {
  const [selectedSegment, setSelectedSegment] = useState<Segment>(() => {
    return (sessionStorage.getItem("selectedCategory") as Segment) || "Women";
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  // Sync segment from EntryPrompt custom event (Same as Hero)
  useEffect(() => {
    const handleCategoryChange = (e: any) => {
      if (e.detail && categoryMap[e.detail as Segment]) {
        setSelectedSegment(e.detail);
        setActiveIndex(0); // Reset index on segment change
      }
    };

    window.addEventListener("lb-category-selected", handleCategoryChange);
    return () => window.removeEventListener("lb-category-selected", handleCategoryChange);
  }, []);

  const categories = categoryMap[selectedSegment] || categoryMap.Women;
  const currentCategory = categories[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % categories.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? categories.length - 1 : prev - 1));
  };

  const handleCategoryClick = () => {
    navigate(`/shop?segment=${selectedSegment}&category=${encodeURIComponent(currentCategory)}`);
  };

  return (
    <CategorySelectorStrip 
      category={currentCategory} 
      onNext={handleNext} 
      onPrev={handlePrev} 
      onClick={handleCategoryClick}
    />
  );
};

export default CategoryStripController;
