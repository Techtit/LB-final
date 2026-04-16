import { Helmet } from "react-helmet-async";
import AnimatedSection from "@/components/AnimatedSection";

const ReturnPolicy = () => {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-background flex items-center justify-center">
      <Helmet>
        <title>Return Policy — Lalisa Belle</title>
      </Helmet>

      <div className="container max-w-2xl px-4 mx-auto text-center">
        <AnimatedSection>
          <h1 className="font-serif text-4xl text-[#b88645] mb-8">Return Policy</h1>
          <div className="p-12 bg-white border border-dashed rounded-3xl">
            <p className="text-xl text-foreground font-serif leading-relaxed italic">
              "After our online venture begins 100%, we will define the return policy."
            </p>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default ReturnPolicy;
