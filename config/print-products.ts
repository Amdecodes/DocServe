export interface PrintProduct {
  id: string;
  name: string;
  description: string;
  basePrice: string;
  image: string;
  category: string;
}

export const PRINT_PRODUCTS: PrintProduct[] = [
  {
    id: "menus",
    name: "Restaurant Menus",
    description: "High-quality laminated menus, tri-fold or booklet styles.",
    basePrice: "50 ETB / page",
    image: "/images/products/menu-placeholder.jpg",
    category: "Business",
  },
  {
    id: "business-cards",
    name: "Business Cards",
    description: "Premium matte or glossy finish business cards.",
    basePrice: "500 ETB / 100 pcs",
    image: "/images/products/business-card-placeholder.jpg",
    category: "Business",
  },
  {
    id: "flyers",
    name: "Flyers & Brochures",
    description: "A5, A4 flyers for events and promotions.",
    basePrice: "10 ETB / copy",
    image: "/images/products/flyer-placeholder.jpg",
    category: "Marketing",
  },
  {
    id: "wedding-cards",
    name: "Wedding Invitations",
    description: "Elegant custom designs with premium envelopes.",
    basePrice: "50 ETB / card",
    image: "/images/products/wedding-placeholder.jpg",
    category: "Events",
  },
  {
    id: "banners",
    name: "Roll-up Banners",
    description: "Standard 85x200cm roll-up banners with stand.",
    basePrice: "2500 ETB",
    image: "/images/products/banner-placeholder.jpg",
    category: "Marketing",
  },
  {
    id: "stickers",
    name: "Custom Stickers",
    description: "Die-cut labels for products or branding.",
    basePrice: "5 ETB / pc",
    image: "/images/products/sticker-placeholder.jpg",
    category: "Branding",
  },
  {
    id: "tshirts",
    name: "T-Shirt Printing",
    description: "Cotton t-shirts with heat press or screen printing.",
    basePrice: "400 ETB",
    image: "/images/products/tshirt-placeholder.jpg",
    category: "Apparel",
  },
  {
    id: "mugs",
    name: "Custom Mugs",
    description: "Ceramic mugs with your logo or photo.",
    basePrice: "350 ETB",
    image: "/images/products/mug-placeholder.jpg",
    category: "Gifts",
  },
];
