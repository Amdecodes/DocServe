export interface AgreementVariable {
  key: string;
  label: string;
  type: "text" | "number" | "date" | "textarea";
  required: boolean;
  placeholder?: string;
}

export interface AgreementTemplate {
  id: string;
  title: string;
  description: string;
  price: number;
  language: "am" | "en";
  version: "v1";
  content: string; // The text with {PLACEHOLDERS}
  variables: AgreementVariable[];
  category: "Vehicle" | "Real Estate" | "Service" | "Other";
}

export const AGREEMENT_TEMPLATES: AgreementTemplate[] = [
  {
    id: "car-sale-am",
    title: "የመኪና ሽያጭ ውል",
    description: "ህጋዊ የመኪና ሽያጭ ውል ማዘጋጃ ቅጽ",
    price: 150,
    language: "am",
    version: "v1",
    category: "Vehicle",
    content: `የመኪና ሽያጭ ውል

ይህ ውል በ{DATE} የተደረገ ነው።

ሻጭ: {SELLER_NAME}፣ መኖሪያ አድራሻ {SELLER_ADDRESS}፣ ስልክ ቁጥር {SELLER_PHONE}
ገዎች: {BUYER_NAME}፣ መኖሪያ አድራሻ {BUYER_ADDRESS}፣ ስልክ ቁጥር {BUYER_PHONE}

1. ውሉ የተፈፀመበት ምክንያት
ሻጭ በስም የተመዘገበ እና የባለቤትነት መታወቂያው ቁጥር {LIBRE_NO} የሆነውን፣ ሰሌዳ ቁጥር {PLATE_NO}፣ የሻሲ ቁጥር {CHASSIS_NO}፣ ሞተር ቁጥር {MOTOR_NO} የሆነውን {CAR_MODEL} መኪና፣ ለገዢ በ {PRICE} (በፊደል: {PRICE_WORDS}) ለመሸጥ ተስማምተዋል።

2. ክፍያ
ገዢ ሙሉ ክፍያውን ለሻጭ ከፍለዋል። / ወይም በከፊል ከፍለዋል። (እንደ ስምምነቱ)

3. ሃላፊነት
ሻጭ መኪናው ከማንኛውም እዳ እና እገዳ ነጻ መሆኑን ያረጋግጣሉ። ይህ ውል ከተፈረመበት ቀን ጀምሮ መኪናው ጋር በተያያዘ ለሚመጣ ማንኛውም ህጋዊ ወይም የገንዘብ ተጠያቂነት ገዢ ወይም ሻጭ እንደየሁኔታው ተጠያቂ ይሆናሉ።

ፊርማዎች
ሻጭ: __________________
ገዢ: __________________
ምስክር 1: __________________
ምስክር 2: __________________`,
    variables: [
      { key: "DATE", label: "ቀን", type: "date", required: true },
      {
        key: "SELLER_NAME",
        label: "የሻጭ ሙሉ ስም",
        type: "text",
        required: true,
        placeholder: "ለምሳሌ፡ አበበ ከበደ",
      },
      {
        key: "SELLER_ADDRESS",
        label: "የሻጭ አድራሻ",
        type: "text",
        required: true,
        placeholder: "ክፍለ ከተማ፣ ወረዳ",
      },
      { key: "SELLER_PHONE", label: "የሻጭ ስልክ", type: "text", required: true },
      { key: "BUYER_NAME", label: "የገዢ ሙሉ ስም", type: "text", required: true },
      { key: "BUYER_ADDRESS", label: "የገዢ አድራሻ", type: "text", required: true },
      { key: "BUYER_PHONE", label: "የገዢ ስልክ", type: "text", required: true },
      { key: "LIBRE_NO", label: "ሊብሬ ቁጥር", type: "text", required: true },
      { key: "PLATE_NO", label: "ሰሌዳ ቁጥር", type: "text", required: true },
      { key: "CHASSIS_NO", label: "ሻሲ ቁጥር", type: "text", required: true },
      { key: "MOTOR_NO", label: "ሞተር ቁጥር", type: "text", required: true },
      {
        key: "CAR_MODEL",
        label: "የመኪናው ሞዴል",
        type: "text",
        required: true,
        placeholder: "Toyota Vitz 2010",
      },
      { key: "PRICE", label: "የሽያጭ ዋጋ (በቁጥር)", type: "number", required: true },
      {
        key: "PRICE_WORDS",
        label: "የሽያጭ ዋጋ (በፊደል)",
        type: "text",
        required: true,
      },
    ],
  },
  {
    id: "house-rent-am",
    title: "የቤት ኪራይ ውል",
    description: "መደበኛ የቤት ኪራይ ውል",
    price: 200,
    language: "am",
    version: "v1",
    category: "Real Estate",
    content:
      "የቤት ኪራይ ውል\n\nእኔ አከራይ {LESSOR_NAME} በ {ADDRESS} ለሚገኘው ቤት ተከራይ {LESSEE_NAME} በወር {RENT_AMOUNT} ብር ለመከራየት ተስማምተናል...\n(This is a placeholder for the full content)",
    variables: [
      { key: "LESSOR_NAME", label: "አከራይ ስም", type: "text", required: true },
      { key: "LESSEE_NAME", label: "ተከራይ ስም", type: "text", required: true },
      { key: "ADDRESS", label: "የቤቱ አድራሻ", type: "text", required: true },
      { key: "RENT_AMOUNT", label: "የኪራይ ዋጋ", type: "number", required: true },
    ],
  },
];
