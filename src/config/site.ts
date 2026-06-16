/**
 * Lalisa Belle — Centralized Site Configuration
 *
 * Single source of truth for all business contact info, store details,
 * and shipping parameters. Uses import.meta.env overrides so values
 * can be changed per-environment without touching code.
 */

export const siteConfig = {
  name: "Lalisa Belle",
  tagline: "Premium Imitation Jewellery",
  url: "https://lalisabelle.com",

  contact: {
    phone: import.meta.env.VITE_CONTACT_PHONE || "9211770999",
    whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER || "919211770999",
    email: import.meta.env.VITE_CONTACT_EMAIL || "support@lalisabelle.com",
    instagram: {
      handle: "@lalisabelle",
      url: "https://instagram.com/lalisabelle",
    },
  },

  store: {
    name: "Lalisa Belle — M3M 65th Avenue",
    address: {
      line1: "Ground Floor, M3M 65th Avenue",
      line2: "R7 LG 37, Sector 65, Gurugram",
      state: "Haryana",
      zip: "122018",
      landmark: "Opposite to SuperDogs and Arte Saloon",
    },
    hours: "Monday – Sunday: 11 AM – 9:30 PM",
    googleMapsEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3509.5!2d77.0699!3d28.4089!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sM3M+65th+Avenue!5e0!3m2!1sen!2sin!4v1700000000000",
    googleMapsUrl: "https://maps.google.com/?q=M3M+65th+Avenue+Sector+65+Gurugram",
    coordinates: { lat: 28.4089, lng: 77.0699 },
  },

  shipping: {
    freeThresholdINR: 999,
    flatFeeINR: 99,
    partners: ["Blue Dart", "Delhivery", "FedEx"],
    processingDays: "1–3",
  },

  social: {
    instagram: "https://instagram.com/lalisabelle",
    facebook: "",
    twitter: "",
  },
} as const;

/** Pre-formatted WhatsApp chat URL */
export const getWhatsAppUrl = (message = "Hi! I'm interested in Lalisa Belle jewellery.") =>
  `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(message)}`;

/** Pre-formatted tel: link */
export const getPhoneUrl = () => `tel:${siteConfig.contact.phone}`;

/** Pre-formatted mailto: link */
export const getEmailUrl = () => `mailto:${siteConfig.contact.email}`;

/** Full address as a single string */
export const getFullAddress = () => {
  const a = siteConfig.store.address;
  return `${a.line1}, ${a.line2}, ${a.state} ${a.zip}`;
};
