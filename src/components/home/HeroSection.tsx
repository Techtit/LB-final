import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { motion } from "framer-motion";

const allImages = [
  { id: "15-20-Men", src: "/hero/15-20-men.png" },
  { id: "15-20-Women", src: "/hero/15-20-women.png" },
  { id: "20-50-Men", src: "/hero/20-50-men.jpeg" },
  { id: "20-50-Women", src: "/hero/20-50-women.jpg" },
  { id: "50-80-Men", src: "/hero/50-80-men.png", pos: "object-[15%_center] md:object-center" },
  { id: "50-80-Women", src: "/hero/50-80-women.png" },
];

const ageGroups = ["15-20", "20-50", "50-80"];
const gendersModal = ["Women", "Men"]; // specific to modal for UI
const genders = ["Women", "Men"];

const HeroSection = () => {
  const { isSignedIn } = useAuth();
  const [hasEntered, setHasEntered] = useState(false);
  const [modalAgeVal, setModalAgeVal] = useState(25);
  const [selectedGender, setSelectedGender] = useState("Women");
  const [selectedAge, setSelectedAge] = useState("20-50");

  // Sync slider output to ageGroup string
  useEffect(() => {
    if (modalAgeVal <= 20) {
      setSelectedAge("15-20");
    } else if (modalAgeVal <= 50) {
      setSelectedAge("20-50");
    } else {
      setSelectedAge("50-80");
    }
  }, [modalAgeVal]);

  const displayGender = selectedGender === "Kids" ? "Women" : selectedGender;
  const currentImageId = `${selectedAge}-${displayGender}`;
  const sliderPercentage = ((modalAgeVal - 15) / (80 - 15)) * 100;

  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] flex flex-col md:flex-row md:items-center overflow-hidden">
      {/* Background line slider style */}
      <style>{`
        .vibe-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 4px;
          border-radius: 4px;
          outline: none;
        }
        .vibe-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: radial-gradient(circle, #fcd34d 10%, #a16207 90%);
          border: 3px solid rgba(255, 255, 255, 0.4);
          cursor: pointer;
          box-shadow: 0 0 15px rgba(0,0,0,0.7);
        }
      `}</style>

      {/* Modal - only rendered when the user hasn't pressed Enter Store and isn't signed in */}
      {!hasEntered && !isSignedIn && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[8px]" />
          
          {/* Modal Box */}
          <div className="relative w-full max-w-[24rem] bg-gradient-to-br from-white/10 to-amber-950/20 backdrop-blur-2xl border border-white/20 p-8 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden">
            <button 
              onClick={() => setHasEntered(true)} 
              className="absolute top-5 right-5 bg-white/10 hover:bg-white/20 text-white rounded-md p-1 transition-colors backdrop-blur-md"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-3xl font-serif text-center text-white font-medium mb-1 drop-shadow-md">Find Your Style</h2>
            <p className="text-sm text-center text-white/80 mb-8 font-sans drop-shadow-sm">Personalize your shopping experience</p>
            
            <div className="mb-6">
              <h3 className="text-[15px] text-white/95 mb-3 ml-1 drop-shadow-sm">Shop for</h3>
              <div className="flex gap-2">
                 {gendersModal.map((g) => (
                   <button
                    key={g}
                    onClick={() => setSelectedGender(g)}
                    className={`flex-1 py-1.5 rounded-full text-[15px] font-sans font-medium transition-all duration-300 ${
                      selectedGender === g
                        ? "bg-gradient-to-b from-[#a16723] to-[#714614] text-white shadow-lg border border-[#a16723]"
                        : "bg-white/10 hover:bg-white/20 text-white/90 border border-white/10"
                    }`}
                   >
                     {g}
                   </button>
                 ))}
              </div>
            </div>
            
            <div className="mb-8 relative mt-2">
               <div className="flex justify-between items-end mb-4 ml-1 mr-1">
                 <h3 className="text-[15px] text-white/95 drop-shadow-sm">Tell us your vibe</h3>
                 <span className="text-sm text-white font-medium drop-shadow-sm">Age: {modalAgeVal}</span>
               </div>
               <div className="px-1 relative">
                 <input
                  type="range"
                  min="15"
                  max="80"
                  value={modalAgeVal}
                  onChange={(e) => setModalAgeVal(Number(e.target.value))}
                  className="vibe-slider"
                  style={{
                    background: `linear-gradient(to right, #b45309 0%, #d97706 ${sliderPercentage}%, rgba(255,255,255,0.2) ${sliderPercentage}%, rgba(255,255,255,0.2) 100%)`
                  }}
                 />
               </div>
               <div className="flex justify-between text-white/70 text-xs mt-3 px-1 font-medium font-sans">
                 <div className="text-center"><span>15 - 20</span><br/><span className="text-[10px] opacity-80 mt-0.5 block">Youthful</span></div>
                 <div className="text-center relative -left-1"><span className="text-white/40">|</span><br/><span className="text-[10px] opacity-80 mt-0.5 block">Adult</span></div>
                 <div className="text-center relative right-0.5"><span className="text-white/40">|</span><br/><span className="text-[10px] opacity-80 mt-0.5 block">Mature</span></div>
                 <div className="text-center"><span>50 - 80</span><br/><span className="text-[10px] opacity-80 mt-0.5 block">Classic</span></div>
               </div>
            </div>
            
            <button 
              onClick={() => setHasEntered(true)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-b from-[#b88645] to-[#7a5525] hover:from-[#c9954f] hover:to-[#8a612b] text-white font-medium text-[17px] shadow-[0_4px_20px_0_rgba(161,103,35,0.4)] transition-all transform hover:scale-[1.02]"
            >
              Enter Store
            </button>
          </div>
        </div>
      )}

      {/* Background Images */}
      <div className="absolute inset-0 bg-black">
        {allImages.map((img) => (
          <img
            key={img.id}
            src={img.src}
            alt={`Hero Background ${img.id}`}
            className={`absolute inset-0 w-full h-full object-cover ${img.pos || 'object-center'} transition-opacity duration-1000 ease-in-out ${
              currentImageId === img.id ? "opacity-100 z-0" : "opacity-0 -z-10"
            }`}
          />
        ))}
        {/* Gradient overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/70 md:bg-gradient-to-r md:from-black/80 md:via-black/50 md:to-transparent z-10" />
      </div>

      {/* Content */}
      <div className="container relative z-20 flex-1 flex flex-col justify-between md:justify-center pt-24 pb-8 md:py-0 mt-4 md:mt-0">
        <div className="max-w-xl text-white">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-tight mb-4 drop-shadow-md">
            Affordable Elegance for Everyday Style
          </h1>
          <motion.p 
            animate={{ opacity: [1, 0, 1] }} 
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} 
            className="text-base md:text-lg mb-8 font-sans leading-relaxed drop-shadow-sm max-w-md"
          >
            Personalized jewellery designed for your aesthetic. Discover stunning pieces that look premium without the premium price tag.
          </motion.p>
        </div>

        <div className="flex flex-wrap gap-4 mt-auto md:mt-8 pb-4 md:pb-0">
          <Button
            asChild
            size="lg"
            className="w-[85%] mx-auto md:mx-0 md:w-auto font-sans tracking-wide shadow-[0_4px_20px_0_rgba(161,103,35,0.4)] bg-gradient-to-r from-[#b88645] to-[#7a5525] hover:opacity-90 text-white border-0 h-11 md:h-12 px-6 md:px-8 text-[15px] md:text-base transition-transform hover:scale-105"
          >
            <Link to="/shop?filter=bestsellers">Shop Collection</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
