export const PRINT_CATEGORIES = {
  CARDS: "Cards",
  MARKETING: "Marketing",
  MERCHANDISE: "Merchandise",
  STATIONERY: "Stationery",
} as const;

export type PrintCategory = (typeof PRINT_CATEGORIES)[keyof typeof PRINT_CATEGORIES];

export const CATEGORY_LABELS: Record<PrintCategory, string> = {
  [PRINT_CATEGORIES.CARDS]: "Cards",
  [PRINT_CATEGORIES.MARKETING]: "Marketing",
  [PRINT_CATEGORIES.MERCHANDISE]: "Merchandise",
  [PRINT_CATEGORIES.STATIONERY]: "Stationery",
};

export const CATEGORY_ITEMS: Record<PrintCategory, string[]> = {
  [PRINT_CATEGORIES.CARDS]: [
    "Business Cards",
    "Wedding Invitations",
    "Birthday Invitations",
    "Greeting Cards",
  ],
  [PRINT_CATEGORIES.MARKETING]: [
    "Flyers",
    "Posters",
    "Banners (Roll-up/PVC)",
    "Brochures",
  ],
  [PRINT_CATEGORIES.MERCHANDISE]: [
    "T-Shirts",
    "Mugs",
    "Caps",
    "Hoodies",
    "Tote Bags",
  ],
  [PRINT_CATEGORIES.STATIONERY]: [
    "Stickers & Labels",
    "Letterheads",
    "Envelopes",
    "Notebooks",
  ],
};

export const CARD_SUB_CATEGORIES = {
  BUSINESS: "Business Cards",
  WEDDING: "Wedding Invitations",
  BIRTHDAY: "Birthday Invitations",
  MEMORIAL: "Memorial Stationery",
} as const;

export type CardSubCategory = (typeof CARD_SUB_CATEGORIES)[keyof typeof CARD_SUB_CATEGORIES];

// Define fields needed for each formatted category
export interface DynamicField {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "textarea" | "color" | "file" | "date" | "time";
  options?: string[]; // For select inputs
  required?: boolean;
  placeholder?: string;
}

export const CATEGORY_FIELDS: Record<PrintCategory, DynamicField[]> = {
  [PRINT_CATEGORIES.CARDS]: [
    {
      name: "cardDetails",
      label: "Text / Details to Print",
      type: "textarea",
      placeholder: "Enter any specific text or details...",
      required: true,
    }
  ],
  [PRINT_CATEGORIES.MARKETING]: [
    {
      name: "size",
      label: "Size",
      type: "select",
      options: ["A5", "A4", "A3", "Custom Size"],
      required: false,
    },
    {
      name: "paperWeight",
      label: "Paper Weight",
      type: "select",
      options: ["Standard (130gsm)", "Premium (170gsm)", "Card Stock (300gsm)"],
      required: false,
    },
    {
      name: "designUrl",
      label: "Upload Design",
      type: "file",
      required: false,
    },
  ],
  [PRINT_CATEGORIES.MERCHANDISE]: [
    {
      name: "size",
      label: "Size",
      type: "select",
      options: ["S", "M", "L", "XL", "XXL"],
      required: true,
    },
    {
      name: "color",
      label: "Item Color",
      type: "text",
      placeholder: "e.g. Black, White, Navy Blue",
      required: true,
    },
    {
      name: "printLocation",
      label: "Print Location",
      type: "select",
      options: ["Front Only", "Back Only", "Front & Back", "Sleeve"],
      required: true,
    },
  ],
  [PRINT_CATEGORIES.STATIONERY]: [
    {
      name: "itemStyle",
      label: "Style / Cut",
      type: "text",
      placeholder: "e.g. Die-cut stickers, Standard Envelope",
      required: true,
    },
    {
      name: "material",
      label: "Material",
      type: "select",
      options: ["Paper", "Vinyl (Waterproof)", "Clear"],
      required: true,
    },
  ],
};

export const MARKETING_SUB_CATEGORIES = {
  FLYERS: "Flyers",
  POSTERS: "Posters",
  BANNERS: "Banners",
  BROCHURES: "Brochures",
} as const;

export const MERCHANDISE_SUB_CATEGORIES = {
  TSHIRTS: "T-Shirts",
  HOODIES: "Hoodies",
  MUGS: "Mugs",
  CAPS: "Caps",
} as const;

export const STATIONERY_SUB_CATEGORIES = {
  STICKERS: "Stickers",
  NOTEBOOKS: "Notebooks",
  LETTERHEADS: "Letterheads",
} as const;

// Combined export for easy access in UI
export const ALL_SUB_CATEGORIES = {
  [PRINT_CATEGORIES.CARDS]: CARD_SUB_CATEGORIES,
  [PRINT_CATEGORIES.MARKETING]: MARKETING_SUB_CATEGORIES,
  [PRINT_CATEGORIES.MERCHANDISE]: MERCHANDISE_SUB_CATEGORIES,
  [PRINT_CATEGORIES.STATIONERY]: STATIONERY_SUB_CATEGORIES,
};

// ... existing fields ...

export const SUB_CATEGORY_FIELDS: Record<string, DynamicField[]> = {
  // --- CARDS ---
  [CARD_SUB_CATEGORIES.WEDDING]: [
    { name: "brideName", label: "dynamic.brideName", type: "text", required: false },
    { name: "groomName", label: "dynamic.groomName", type: "text", required: false },
    { name: "eventDate", label: "dynamic.eventDate", type: "date", required: false },
    { name: "eventTime", label: "dynamic.eventTime", type: "time", required: false },
    { name: "eventPlace", label: "dynamic.eventPlace", type: "text", required: false },
  ],
  [CARD_SUB_CATEGORIES.BIRTHDAY]: [
    { name: "birthdayPerson", label: "dynamic.birthdayPerson", type: "text", required: false },
    { name: "eventDate", label: "dynamic.eventDate", type: "date", required: false },
    { name: "eventTime", label: "dynamic.eventTime", type: "time", required: false },
    { name: "eventPlace", label: "dynamic.location", type: "text", required: false },
  ],
  [CARD_SUB_CATEGORIES.MEMORIAL]: [
    { name: "deceasedName", label: "dynamic.deceasedName", type: "text", required: false },
    { name: "purpose", label: "dynamic.purpose", type: "text", placeholder: "e.g. Invitation, Thank You, Prayer Card", required: false },
    { name: "eventDate", label: "dynamic.eventDate", type: "date", required: false },
    { name: "eventTime", label: "dynamic.eventTime", type: "time", required: false },
    { name: "eventPlace", label: "dynamic.eventPlace", type: "text", required: false },
  ],
  [CARD_SUB_CATEGORIES.BUSINESS]: [
    { name: "fullName", label: "dynamic.fullName", type: "text", required: false },
    { name: "jobTitle", label: "dynamic.jobTitle", type: "text", required: false },
    { name: "phone", label: "dynamic.phone", type: "text", required: false },
    { name: "email", label: "dynamic.email", type: "text", required: false },
    { name: "address", label: "dynamic.address", type: "text", required: false },
    { name: "website", label: "dynamic.website", type: "text", required: false },
  ],

  // --- MARKETING ---
  [MARKETING_SUB_CATEGORIES.FLYERS]: [
    { name: "size", label: "dynamic.size", type: "select", options: ["A6", "A5", "A4", "DL"], required: false },
    { name: "paperType", label: "dynamic.paperType", type: "select", options: ["Glossy", "Matte"], required: false },
    { name: "quantity", label: "dynamic.quantity", type: "number", required: false },
  ],
  [MARKETING_SUB_CATEGORIES.POSTERS]: [
    { name: "size", label: "dynamic.size", type: "select", options: ["A3", "A2", "A1", "A0"], required: false },
    { name: "lamination", label: "dynamic.lamination", type: "select", options: ["None", "Gloss", "Matte"], required: false },
  ],
  [MARKETING_SUB_CATEGORIES.BANNERS]: [
    { name: "width", label: "dynamic.width", type: "number", placeholder: "cm", required: false },
    { name: "height", label: "dynamic.height", type: "number", placeholder: "cm", required: false },
    { name: "eyelets", label: "dynamic.eyelets", type: "select", options: ["Yes", "No"], required: false },
  ],
  [MARKETING_SUB_CATEGORIES.BROCHURES]: [
    { name: "foldType", label: "dynamic.foldType", type: "select", options: ["Bi-Fold", "Tri-Fold", "Z-Fold"], required: false },
    { name: "paperType", label: "dynamic.paperType", type: "text", required: false },
  ],

  // --- MERCHANDISE ---
  [MERCHANDISE_SUB_CATEGORIES.TSHIRTS]: [
    { name: "size", label: "dynamic.size", type: "select", options: ["S", "M", "L", "XL", "XXL"], required: false },
    { name: "color", label: "dynamic.color", type: "text", required: false },
    { name: "gender", label: "dynamic.gender", type: "select", options: ["Unisex", "Male", "Female"], required: false },
  ],
  [MERCHANDISE_SUB_CATEGORIES.HOODIES]: [
    { name: "size", label: "dynamic.size", type: "select", options: ["S", "M", "L", "XL", "XXL"], required: false },
    { name: "color", label: "dynamic.color", type: "text", required: false },
  ],
  [MERCHANDISE_SUB_CATEGORIES.MUGS]: [
    { name: "type", label: "dynamic.mugType", type: "select", options: ["Standard White"], required: false },
  ],
  [MERCHANDISE_SUB_CATEGORIES.CAPS]: [
    { name: "color", label: "dynamic.color", type: "text", required: false },
    { name: "style", label: "dynamic.style", type: "text", required: false },
  ],

  // --- STATIONERY ---
  [STATIONERY_SUB_CATEGORIES.STICKERS]: [
    { name: "shape", label: "dynamic.shape", type: "select", options: ["Circle", "Square", "Die-Cut"], required: false },
    { name: "size", label: "dynamic.size", type: "text", required: false },
  ],
  [STATIONERY_SUB_CATEGORIES.NOTEBOOKS]: [
    { name: "size", label: "dynamic.size", type: "select", options: ["A5", "A4"], required: false },
    { name: "cover", label: "dynamic.cover", type: "text", required: false },
  ],
  [STATIONERY_SUB_CATEGORIES.LETTERHEADS]: [
     { name: "paperType", label: "dynamic.paperType", type: "text", required: false },
  ]
};
