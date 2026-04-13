import { Instagram } from "lucide-react";
import logo from "@/assets/logo.png";

// Real Lalisa Belle post IDs
const postIds = [
  "DR6l5z2j1Oi",
  "DRy5OiNEqWK",
  "DRoYlAVklFA",
  "DOiTN-uEfZP",
  "DVibhnXERcv"
];

const InstagramGallery = () => (
  <section className="py-16 md:py-20 bg-secondary/30">
    <div className="container text-center mb-10">
      <img src={logo} alt="Lalisa Belle" className="h-8 mx-auto mb-3 opacity-20" />
      <h2 className="font-serif text-2xl md:text-3xl font-medium mb-2">Follow <span className="text-primary font-semibold">Lalisa Belle</span> on Instagram</h2>
      <a href="https://www.instagram.com/lalisabelle9/?utm_source=ig_embed&ig_rid=4e1e7552-6bc0-4b5d-a3d0-3608ea96d937" target="_blank" rel="noopener noreferrer" className="text-muted-foreground font-sans text-sm flex items-center justify-center gap-2 hover:text-primary transition-colors">
        <Instagram className="w-4 h-4" /> @lalisabelle9
      </a>
    </div>

    <div className="container">
      <div className="grid lg:grid-cols-[400px_1fr] gap-8 items-start justify-center">
        {/* Left Column: Embedded Instagram Reel */}
        <div className="w-full max-w-[400px] mx-auto rounded-xl overflow-hidden shadow-lg bg-background border border-border">
          <iframe
            src="https://www.instagram.com/reel/DUqHzRgErhM/embed/"
            className="w-full border-0"
            height="520"
            allowTransparency
            allow="encrypted-media"
            loading="lazy"
            title="Lalisa Belle Instagram Reel"
          />
        </div>

        {/* Right Column: Real Instagram Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {postIds.map((id, i) => (
            <div key={i} className="rounded-xl overflow-hidden shadow-sm bg-background border border-border flex items-center justify-center">
              {/* Instagram restricts iframe sizing slightly, locking it to a min-width roughly 320px */}
              <iframe
                src={`https://www.instagram.com/p/${id}/embed`}
                className="w-full max-w-[320px] md:max-w-full border-0"
                height="400"
                allowTransparency
                allow="encrypted-media"
                loading="lazy"
                title={`Instagram Post ${i + 1}`}
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-12 text-center">
        <a 
          href="https://www.instagram.com/lalisabelle9/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-sans font-medium rounded-full hover:bg-primary transition-colors"
        >
          <Instagram className="w-5 h-5" />
          View Complete Gallery
        </a>
      </div>
    </div>
  </section>
);

export default InstagramGallery;
