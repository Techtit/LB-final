import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";
import product7 from "@/assets/product-7.jpg";
import product8 from "@/assets/product-8.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: "earrings" | "necklaces" | "bangles" | "rings";
  badge?: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  description: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Floral Jhumka Earrings",
    price: 199,
    originalPrice: 399,
    image: product1,
    category: "earrings",
    badge: "50% OFF",
    isBestSeller: true,
    description: "Handcrafted oxidized jhumka earrings with intricate floral pattern and pearl drops. Lightweight and comfortable for all-day wear.",
  },
  {
    id: "2",
    name: "Royal Choker Necklace",
    price: 349,
    originalPrice: 599,
    image: product2,
    category: "necklaces",
    badge: "BESTSELLER",
    isBestSeller: true,
    description: "Statement oxidized choker necklace with traditional Indian motifs. Perfect for festive occasions and everyday elegance.",
  },
  {
    id: "3",
    name: "Dotted Bangle Set",
    price: 249,
    originalPrice: 449,
    image: product3,
    category: "bangles",
    isBestSeller: true,
    description: "Set of 4 oxidized silver stacking bangles with dotted pattern. Mix and match for your perfect stack.",
  },
  {
    id: "4",
    name: "Lotus Bloom Ring",
    price: 149,
    originalPrice: 299,
    image: product4,
    category: "rings",
    badge: "50% OFF",
    isBestSeller: true,
    description: "Stunning oxidized statement ring with vintage floral lotus design. Adjustable size fits most fingers.",
  },
  {
    id: "5",
    name: "Peacock Drop Earrings",
    price: 179,
    originalPrice: 349,
    image: product5,
    category: "earrings",
    isNew: true,
    isBestSeller: true,
    description: "Elegant peacock-shaped dangle earrings with detailed oxidized finish. A timeless design that complements any outfit.",
  },
  {
    id: "6",
    name: "Lotus Pendant Necklace",
    price: 299,
    originalPrice: 499,
    image: product6,
    category: "necklaces",
    isNew: true,
    isBestSeller: true,
    description: "Beautiful lotus pendant necklace with turquoise accent stone. Oxidized silver finish on a delicate chain.",
  },
  {
    id: "7",
    name: "Tribal Cuff Bangle",
    price: 199,
    originalPrice: 349,
    image: product7,
    category: "bangles",
    isNew: true,
    description: "Bold geometric tribal pattern cuff bangle. Adjustable fit with a stunning oxidized finish.",
  },
  {
    id: "8",
    name: "Heritage Leaf Ring",
    price: 129,
    image: product8,
    category: "rings",
    isNew: true,
    isBestSeller: true,
    description: "Intricate leaf and berry motif ring with oxidized detailing. Adjustable band for comfortable wear.",
  },
];

export const categories = [
  { name: "Earrings", slug: "earrings" },
  { name: "Necklaces", slug: "necklaces" },
  { name: "Bangles", slug: "bangles" },
  { name: "Rings", slug: "rings" },
] as const;

export const reviews = [
  { name: "Priya S.", text: "Absolutely love the quality! Looks way more expensive than it is. Got so many compliments! ✨", rating: 5 },
  { name: "Ananya R.", text: "The jhumkas are gorgeous and so lightweight. Perfect for daily wear. Will order more!", rating: 5 },
  { name: "Meera K.", text: "Fast shipping and beautiful packaging. The necklace is exactly as shown. Highly recommend!", rating: 5 },
  { name: "Divya P.", text: "Best affordable jewellery I've found online. The oxidized finish is stunning!", rating: 4 },
];
