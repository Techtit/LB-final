import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, Flame } from "lucide-react";

const PromoBanner = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 43, seconds: 21 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <section className="bg-gradient-to-r from-primary via-primary to-gold-light py-3">
      <div className="container">
        <Link to="/shop" className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-primary-foreground">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 animate-pulse" />
            <span className="font-sans font-bold text-sm tracking-wide">LIMITED TIME OFFER</span>
          </div>
          <span className="text-xs sm:text-sm font-sans opacity-90">Extra 10% off on all orders</span>
          <div className="flex items-center gap-1.5 font-mono text-sm font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span className="bg-foreground/20 px-1.5 py-0.5 rounded">{pad(timeLeft.hours)}</span>:
            <span className="bg-foreground/20 px-1.5 py-0.5 rounded">{pad(timeLeft.minutes)}</span>:
            <span className="bg-foreground/20 px-1.5 py-0.5 rounded">{pad(timeLeft.seconds)}</span>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default PromoBanner;
