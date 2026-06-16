import { getWhatsAppUrl } from "@/config/site";

/**
 * WhatsApp Floating Action Button — fixed bottom-right on all pages.
 * z-40 keeps it above page content but below modals (z-50) and search overlay (z-100).
 */
const WhatsAppButton = () => (
  <a
    href={getWhatsAppUrl()}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat on WhatsApp"
    className="fixed bottom-6 right-6 z-40 group"
  >
    {/* Pulse ring */}
    <span className="absolute inset-0 rounded-full bg-[#25D366]/30 animate-wa-ping" />

    {/* Button */}
    <span className="relative flex items-center justify-center w-14 h-14 md:w-[60px] md:h-[60px] rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/30 group-hover:scale-110 transition-transform duration-300">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="w-7 h-7 md:w-8 md:h-8 fill-white"
        aria-hidden="true"
      >
        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.96A15.92 15.92 0 0 0 16.004 32C24.826 32 32 24.826 32 16.004 32 7.176 24.826 0 16.004 0zm9.302 22.602c-.39 1.1-1.932 2.014-3.162 2.282-.842.178-1.94.322-5.64-1.212-4.738-1.964-7.786-6.766-8.024-7.082-.228-.316-1.916-2.55-1.916-4.864 0-2.314 1.212-3.452 1.642-3.924.39-.428 1.022-.618 1.626-.618.196 0 .372.01.53.018.468.02.702.048 1.012.782.386.916 1.33 3.242 1.446 3.478.118.236.236.552.078.868-.148.326-.276.472-.512.742-.236.27-.46.476-.696.766-.216.252-.46.522-.196.99.264.468 1.174 1.936 2.52 3.136 1.732 1.542 3.192 2.02 3.646 2.246.352.176.774.138 1.05-.158.352-.374.786-.994 1.228-1.604.314-.436.712-.49 1.1-.334.394.148 2.494 1.176 2.922 1.39.428.216.714.324.82.5.104.178.104 1.024-.286 2.124z"/>
      </svg>
    </span>
  </a>
);

export default WhatsAppButton;
