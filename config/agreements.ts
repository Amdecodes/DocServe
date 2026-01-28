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
    title: "የመኪና ሽያጭ ውል ስምምነት",
    description: "የመኪና ሽያጭ ውል ማዘጋጃ ቅጽ (Ethiopian Standard)",
    price: 250,
    language: "am",
    version: "v1",
    category: "Vehicle",
    content: `የውል ቀን፡ {AGREEMENT_DATE} ዓ.ም

1. የሻጭ መረጃ
• ሙሉ ስም፡ {SELLER_FULL_NAME}
• የአባት ስም፡ {SELLER_FATHER_NAME}
• መታወቂያ ቁጥር፡ {SELLER_ID_NUMBER}
• አድራሻ፡ {SELLER_ADDRESS}

ውክልና፡ {SELLER_REPRESENTATION}

2. የገዢ መረጃ
• ሙሉ ስም፡ {BUYER_FULL_NAME}
• የአባት ስም፡ {BUYER_FATHER_NAME}
• መታወቂያ ቁጥር፡ {BUYER_ID_NUMBER}
• አድራሻ፡ {BUYER_ADDRESS}

3. የመኪና መግለጫ
• የመኪና ዓይነት / ሞዴል፡ {CAR_MAKE_MODEL}
• የመኪና ቀለም፡ {CAR_COLOR}
• የሞተር ቁጥር፡ {ENGINE_NUMBER}
• የሻሲ ቁጥር፡ {CHASSIS_NUMBER}
• የሰሌዳ ቁጥር፡ {PLATE_NUMBER}
• የማምረቻ ዓመት፡ {MANUFACTURE_YEAR}

4. የሽያጭ ዋጋ እና ክፍያ
• ጠቅላላ ዋጋ፡ {SALE_PRICE} ብር
• በፊደል፡ {SALE_PRICE_WORDS}

የክፍያ ሁኔታ፡ {PAYMENT_STATUS}
• የክፍያ ዘዴ፡ {PAYMENT_METHOD}
• የመጀመሪያ ክፍያ፡ {DOWN_PAYMENT}
• የቀሪ ክፍያ ቀን፡ {REMAINING_PAYMENT_DATE}

5. የሻጭ መግለጫ
እኔ {SELLER_FULL_NAME} መኪናው የእኔ ሙሉ ንብረት መሆኑን፣ ከማንኛውም እገዳ ወይም ክስ ነፃ መሆኑን እና ለ {BUYER_FULL_NAME} በፈቃዴ መሸጤን አረጋግጣለሁ።

6. የገዢ መግለጫ
እኔ {BUYER_FULL_NAME} መኪናውን በተገለጸው ሁኔታ ተቀብዬ መግዛቴን እና ክፍያውን መፈጸሜን አረጋግጣለሁ።

7. ምስክሮች
ምስክር 1: {WITNESS1_NAME} – ፊርማ __________
ምስክር 2: {WITNESS2_NAME} – ፊርማ __________

8. ፊርማ
• የሻጭ ፊርማ፡ __________ ቀን፡ {SIGN_DATE}
• የገዢ ፊርማ፡ __________ ቀን፡ {SIGN_DATE}`,
    variables: [
      { key: "AGREEMENT_DATE", label: "የውል ቀን", type: "text", required: true },
      { key: "SELLER_FULL_NAME", label: "የሻጭ ሙሉ ስም", type: "text", required: true },
      { key: "SELLER_FATHER_NAME", label: "የሻጭ የአባት ስም", type: "text", required: true },
      { key: "SELLER_ID_NUMBER", label: "የሻጭ መታወቂያ ቁጥር", type: "text", required: true },
      { key: "SELLER_ADDRESS", label: "የሻጭ አድራሻ", type: "text", required: true },
      { key: "SELLER_REPRESENTATION", label: "ውክልና (በራሴ/በወኪል)", type: "text", required: true, placeholder: "በራሴ ወይም በወኪል" },
      { key: "BUYER_FULL_NAME", label: "የገዢ ሙሉ ስም", type: "text", required: true },
      { key: "BUYER_FATHER_NAME", label: "የገዢ የአባት ስም", type: "text", required: true },
      { key: "BUYER_ID_NUMBER", label: "የገዢ መታወቂያ ቁጥር", type: "text", required: true },
      { key: "BUYER_ADDRESS", label: "የገዢ አድራሻ", type: "text", required: true },
      { key: "CAR_MAKE_MODEL", label: "የመኪና ዓይነት / ሞዴል", type: "text", required: true, placeholder: "ለምሳሌ፡ Toyota Vitz 2010" },
      { key: "CAR_COLOR", label: "የመኪና ቀለም", type: "text", required: true },
      { key: "ENGINE_NUMBER", label: "የሞተር ቁጥር", type: "text", required: true },
      { key: "CHASSIS_NUMBER", label: "የሻሲ ቁጥር", type: "text", required: true },
      { key: "PLATE_NUMBER", label: "የሰሌዳ ቁጥር", type: "text", required: true },
      { key: "MANUFACTURE_YEAR", label: "የማምረቻ ዓመት", type: "text", required: true },
      { key: "SALE_PRICE", label: "ጠቅላላ ዋጋ (ብር)", type: "number", required: true },
      { key: "SALE_PRICE_WORDS", label: "የሽያጭ ዋጋ (በፊደል)", type: "text", required: true },
      { key: "PAYMENT_STATUS", label: "የክፍያ ሁኔታ", type: "text", required: true, placeholder: "ሙሉ በሙሉ ተከፍሏል ወይም በክፍያ መደብ" },
      { key: "PAYMENT_METHOD", label: "የክፍያ ዘዴ", type: "text", required: true },
      { key: "DOWN_PAYMENT", label: "የመጀመሪያ ክፍያ", type: "text", required: false },
      { key: "REMAINING_PAYMENT_DATE", label: "የቀሪ ክፍያ ቀን", type: "text", required: false },
      { key: "WITNESS1_NAME", label: "ምስክር 1 ስም", type: "text", required: true },
      { key: "WITNESS2_NAME", label: "ምስክር 2 ስም", type: "text", required: true },
      { key: "SIGN_DATE", label: "ፊርማ ቀን", type: "date", required: true },
    ],
  },
  {
    id: "car-rent-am",
    title: "የመኪና ኪራይ ውል ስምምነት",
    description: "የመኪና ኪራይ ውል ማዘጋጃ ቅጽ (Ethiopian Standard)",
    price: 200,
    language: "am",
    version: "v1",
    category: "Vehicle",
    content: `የውል ቀን፡ {AGREEMENT_DATE} ዓ.ም

1. የአከራይ መረጃ
• ሙሉ ስም፡ {OWNER_FULL_NAME}
• የአባት ስም፡ {OWNER_FATHER_NAME}
• መታወቂያ ቁጥር፡ {OWNER_ID_NUMBER}
• አድራሻ፡ {OWNER_ADDRESS}

2. የተከራይ መረጃ
• ሙሉ ስም፡ {RENTER_FULL_NAME}
• የአባት ስም፡ {RENTER_FATHER_NAME}
• መታወቂያ ቁጥር፡ {RENTER_ID_NUMBER}
• አድራሻ፡ {RENTER_ADDRESS}

3. የመኪና መግለጫ
• የመኪና ዓይነት / ሞዴል፡ {CAR_MAKE_MODEL}
• የመኪና ቀለም፡ {CAR_COLOR}
• የሞተር ቁጥር፡ {ENGINE_NUMBER}
• የሻሲ ቁጥር፡ {CHASSIS_NUMBER}
• የሰሌዳ ቁጥር፡ {PLATE_NUMBER}

4. የኪራይ ጊዜ
• የመጀመሪያ ቀን፡ {RENT_START_DATE}
• የመጨረሻ ቀን፡ {RENT_END_DATE}
• የኪራይ ቆይታ፡ {RENT_DURATION}

5. የኪራይ ክፍያ
• የቀን / ወር ኪራይ፡ {RENT_AMOUNT} ብር
• የተቀማጭ ገንዘብ፡ {DEPOSIT_AMOUNT} ብር
• የክፍያ ዘዴ፡ {PAYMENT_METHOD}

6. የተከራይ ግዴታ
• መኪናውን በአግባቡ መጠቀም
• ለሶስተኛ ወገን መከራየት አይፈቀድም
• ማንኛውንም ጉዳት መክፈል

7. የአከራይ መብት
• መኪናውን በማንኛውም ጊዜ ለምርመራ መመልከት

8. የውል መቋረጫ
• አንዱ ወገን {TERMINATION_NOTICE_PERIOD} ቀን በፊት ማሳወቂያ ሲሰጥ

9. ምስክሮች
ምስክር 1: {WITNESS1_NAME} – ፊርማ __________
ምስክር 2: {WITNESS2_NAME} – ፊርማ __________

10. ፊርማ
• የአከራይ ፊርማ፡ __________ ቀን፡ {SIGN_DATE}
• የተከራይ ፊርማ፡ __________ ቀን፡ {SIGN_DATE}`,
    variables: [
      { key: "AGREEMENT_DATE", label: "የውል ቀን", type: "text", required: true },
      { key: "OWNER_FULL_NAME", label: "አከራይ ሙሉ ስም", type: "text", required: true },
      { key: "OWNER_FATHER_NAME", label: "አከራይ የአባት ስም", type: "text", required: true },
      { key: "OWNER_ID_NUMBER", label: "አከራይ መታወቂያ ቁጥር", type: "text", required: true },
      { key: "OWNER_ADDRESS", label: "አከራይ አድራሻ", type: "text", required: true },
      { key: "RENTER_FULL_NAME", label: "ተከራይ ሙሉ ስም", type: "text", required: true },
      { key: "RENTER_FATHER_NAME", label: "ተከራይ የአባት ስም", type: "text", required: true },
      { key: "RENTER_ID_NUMBER", label: "ተከራይ መታወቂያ ቁጥር", type: "text", required: true },
      { key: "RENTER_ADDRESS", label: "ተከራይ አድራሻ", type: "text", required: true },
      { key: "CAR_MAKE_MODEL", label: "የመኪና ዓይነት / ሞዴል", type: "text", required: true, placeholder: "Toyota Vitz 2010" },
      { key: "CAR_COLOR", label: "የመኪና ቀለም", type: "text", required: true },
      { key: "ENGINE_NUMBER", label: "የሞተር ቁጥር", type: "text", required: true },
      { key: "CHASSIS_NUMBER", label: "የሻሲ ቁጥር", type: "text", required: true },
      { key: "PLATE_NUMBER", label: "የሰሌዳ ቁጥር", type: "text", required: true },
      { key: "RENT_START_DATE", label: "የኪራይ መጀመሪያ ቀን", type: "date", required: true },
      { key: "RENT_END_DATE", label: "የኪራይ ማብቂያ ቀን", type: "date", required: true },
      { key: "RENT_DURATION", label: "የኪራይ ቆይታ", type: "text", required: true },
      { key: "RENT_AMOUNT", label: "የቀን / ወር ኪራይ (ብር)", type: "number", required: true },
      { key: "DEPOSIT_AMOUNT", label: "የተቀማጭ ገንዘብ (ብር)", type: "number", required: true },
      { key: "PAYMENT_METHOD", label: "የክፍያ ዘዴ", type: "text", required: true },
      { key: "TERMINATION_NOTICE_PERIOD", label: "የማሳወቂያ ጊዜ (በቀናት)", type: "text", required: true },
      { key: "WITNESS1_NAME", label: "ምስክር 1 ስም", type: "text", required: true },
      { key: "WITNESS2_NAME", label: "ምስክር 2 ስም", type: "text", required: true },
      { key: "SIGN_DATE", label: "ፊርማ ቀን", type: "date", required: true },
    ],
  },
  {
    id: "house-sale-am",
    title: "የቤት ሽያጭ ውል ስምምነት",
    description: "የቤት ሽያጭ ውል ማዘጋጃ ቅጽ (Ethiopian Standard)",
    price: 300,
    language: "am",
    version: "v1",
    category: "Real Estate",
    content: `የውል ቀን፡ {AGREEMENT_DATE} ዓ.ም

1. የሻጭ መረጃ
• ሙሉ ስም፡ {SELLER_FULL_NAME}
• የአባት ስም፡ {SELLER_FATHER_NAME}
• ዜግነት፡ {SELLER_NATIONALITY}
• መታወቂያ ቁጥር፡ {SELLER_ID_NUMBER}
• አድራሻ፡ {SELLER_ADDRESS}

ውክልና፡ {SELLER_REPRESENTATION}

የወኪል መረጃ (ካለ)
• ስም፡ {SELLER_AGENT_NAME}
• የውክልና ሰነድ ቁጥር፡ {SELLER_PO_NUMBER}
• የተሰጠበት ቀን፡ {SELLER_PO_DATE}

2. የገዢ መረጃ
• ሙሉ ስም፡ {BUYER_FULL_NAME}
• የአባት ስም፡ {BUYER_FATHER_NAME}
• ዜግነት፡ {BUYER_NATIONALITY}
• መታወቂያ ቁጥር፡ {BUYER_ID_NUMBER}
• አድራሻ፡ {BUYER_ADDRESS}

ውክልና፡ {BUYER_REPRESENTATION}

የወኪል መረጃ (ካለ)
• ስም፡ {BUYER_AGENT_NAME}
• የውክልና ሰነድ ቁጥር፡ {BUYER_PO_NUMBER}
• የተሰጠበት ቀን፡ {BUYER_PO_DATE}

3. የሚሸጠው ንብረት መግለጫ
• ከተማ፡ {PROPERTY_CITY}
• ክፍለ ከተማ፡ {PROPERTY_SUBCITY}
• ወረዳ፡ {PROPERTY_WOREDA}
• ቀበሌ፡ {PROPERTY_KEBELE}
• የቤት ቁጥር፡ {PROPERTY_HOUSE_NUMBER}
• የካርታ / የይዞታ ቁጥር፡ {PROPERTY_MAP_NUMBER}
• የመሬት ስፋት፡ {PROPERTY_LAND_AREA} ካሬ ሜትር
• የቤት አይነት፡ {PROPERTY_TYPE}

4. የሽያጭ ዋጋ እና ክፍያ
• ጠቅላላ የሽያጭ ዋጋ፡ {SALE_PRICE} ብር
• በፊደል፡ {SALE_PRICE_WORDS}

የክፍያ ሁኔታ፡ {PAYMENT_STATUS}
• የክፍያ ዘዴ፡ {PAYMENT_METHOD}
• የመጀመሪያ ክፍያ፡ {DOWN_PAYMENT}
• የቀሪ ክፍያ ቀን፡ {REMAINING_PAYMENT_DATE}

5. የሻጭ መግለጫ
እኔ {SELLER_FULL_NAME} ከላይ በተገለጸው ንብረት ላይ ሙሉ የህግ መብት እንዳለኝ እና ከማንኛውም እገዳ፣ ተጠያቂነት ወይም ክስ ነፃ መሆኑን እገልጻለሁ።

6. የገዢ መግለጫ
እኔ {BUYER_FULL_NAME} ንብረቱን በሙሉ ፈቃዴ ገዝቻለሁ እና ክፍያውን መፈጸሜን አረጋግጣለሁ።

7. ምስክሮች
ምስክር 1: {WITNESS1_NAME} – ፊርማ __________
ምስክር 2: {WITNESS2_NAME} – ፊርማ __________

8. ፊርማ
• የሻጭ ፊርማ፡ __________ ቀን፡ {SIGN_DATE}
• የገዢ ፊርማ፡ __________ ቀን፡ {SIGN_DATE}`,
    variables: [
      { key: "AGREEMENT_DATE", label: "የውል ቀን", type: "text", required: true },
      { key: "SELLER_FULL_NAME", label: "የሻጭ ሙሉ ስም", type: "text", required: true },
      { key: "SELLER_FATHER_NAME", label: "የሻጭ የአባት ስም", type: "text", required: true },
      { key: "SELLER_NATIONALITY", label: "የሻጭ ዜግነት", type: "text", required: true },
      { key: "SELLER_ID_NUMBER", label: "የሻጭ መታወቂያ ቁጥር", type: "text", required: true },
      { key: "SELLER_ADDRESS", label: "የሻጭ አድራሻ", type: "text", required: true },
      { key: "SELLER_REPRESENTATION", label: "ውክልና (በራሴ/በወኪል)", type: "text", required: true, placeholder: "በራሴ ወይም በወኪል" },
      { key: "SELLER_AGENT_NAME", label: "የወኪል ስም (ካለ)", type: "text", required: false },
      { key: "SELLER_PO_NUMBER", label: "የውክልና ሰነድ ቁጥር", type: "text", required: false },
      { key: "SELLER_PO_DATE", label: "የውክልና የተሰጠበት ቀን", type: "text", required: false },
      { key: "BUYER_FULL_NAME", label: "የገዢ ሙሉ ስም", type: "text", required: true },
      { key: "BUYER_FATHER_NAME", label: "የገዢ የአባት ስም", type: "text", required: true },
      { key: "BUYER_NATIONALITY", label: "የገዢ ዜግነት", type: "text", required: true },
      { key: "BUYER_ID_NUMBER", label: "የገዢ መታወቂያ ቁጥር", type: "text", required: true },
      { key: "BUYER_ADDRESS", label: "የገዢ አድራሻ", type: "text", required: true },
      { key: "BUYER_REPRESENTATION", label: "ውክልና (በራሴ/በወኪል)", type: "text", required: true, placeholder: "በራሴ ወይም በወኪል" },
      { key: "BUYER_AGENT_NAME", label: "የወኪል ስም (ካለ)", type: "text", required: false },
      { key: "BUYER_PO_NUMBER", label: "የውክልና ሰነድ ቁጥር", type: "text", required: false },
      { key: "BUYER_PO_DATE", label: "የውክልና የተሰጠበት ቀን", type: "text", required: false },
      { key: "PROPERTY_CITY", label: "ከተማ", type: "text", required: true },
      { key: "PROPERTY_SUBCITY", label: "ክፍለ ከተማ", type: "text", required: true },
      { key: "PROPERTY_WOREDA", label: "ወረዳ", type: "text", required: true },
      { key: "PROPERTY_KEBELE", label: "ቀበሌ", type: "text", required: true },
      { key: "PROPERTY_HOUSE_NUMBER", label: "የቤት ቁጥር", type: "text", required: true },
      { key: "PROPERTY_MAP_NUMBER", label: "የካርታ / የይዞታ ቁጥር", type: "text", required: true },
      { key: "PROPERTY_LAND_AREA", label: "የመሬት ስፋት (ካሬ ሜትር)", type: "text", required: true },
      { key: "PROPERTY_TYPE", label: "የቤት አይነት", type: "text", required: true },
      { key: "SALE_PRICE", label: "ጠቅላላ የሽያጭ ዋጋ (ብር)", type: "number", required: true },
      { key: "SALE_PRICE_WORDS", label: "የሽያጭ ዋጋ (በፊደል)", type: "text", required: true },
      { key: "PAYMENT_STATUS", label: "የክፍያ ሁኔታ", type: "text", required: true, placeholder: "ሙሉ በሙሉ ተከፍሏል ወይም በክፍያ መደብ" },
      { key: "PAYMENT_METHOD", label: "የክፍያ ዘዴ", type: "text", required: true },
      { key: "DOWN_PAYMENT", label: "የመጀመሪያ ክፍያ", type: "text", required: false },
      { key: "REMAINING_PAYMENT_DATE", label: "የቀሪ ክፍያ ቀን", type: "text", required: false },
      { key: "WITNESS1_NAME", label: "ምስክር 1 ስም", type: "text", required: true },
      { key: "WITNESS2_NAME", label: "ምስክር 2 ስም", type: "text", required: true },
      { key: "SIGN_DATE", label: "ፊርማ ቀን", type: "date", required: true },
    ],
  },
  {
    id: "house-rent-am",
    title: "የቤት ኪራይ ውል ስምምነት",
    description: "የቤት ኪራይ ውል ማዘጋጃ ቅጽ (Ethiopian Standard)",
    price: 250,
    language: "am",
    version: "v1",
    category: "Real Estate",
    content: `የውል ቀን፡ {AGREEMENT_DATE} ዓ.ም

1. የአከራይ መረጃ
• ሙሉ ስም፡ {LANDLORD_FULL_NAME}
• የአባት ስም፡ {LANDLORD_FATHER_NAME}
• መታወቂያ ቁጥር፡ {LANDLORD_ID_NUMBER}
• አድራሻ፡ {LANDLORD_ADDRESS}

2. የተከራይ መረጃ
• ሙሉ ስም፡ {TENANT_FULL_NAME}
• የአባት ስም፡ {TENANT_FATHER_NAME}
• መታወቂያ ቁጥር፡ {TENANT_ID_NUMBER}
• አድራሻ፡ {TENANT_ADDRESS}

3. የኪራይ ቤት መግለጫ
• ከተማ፡ {PROPERTY_CITY}
• ክፍለ ከተማ፡ {PROPERTY_SUBCITY}
• ወረዳ፡ {PROPERTY_WOREDA}
• ቀበሌ፡ {PROPERTY_KEBELE}
• የቤት ቁጥር፡ {PROPERTY_HOUSE_NUMBER}
• የቤት አይነት፡ {PROPERTY_TYPE}

4. የኪራይ ዘመን
• የመጀመሪያ ቀን፡ {RENT_START_DATE}
• የመጨረሻ ቀን፡ {RENT_END_DATE}
• የኪራይ ጊዜ፡ {RENT_DURATION}

5. የኪራይ ክፍያ
• ወርሃዊ ኪራይ፡ {MONTHLY_RENT} ብር
• የተቀማጭ ገንዘብ፡ {DEPOSIT_AMOUNT} ብር
• የክፍያ ቀን፡ {RENT_PAYMENT_DAY} ቀን

6. የተከራይ ግዴታ
• ቤቱን በአግባቡ መጠቀም
• ማንኛውንም ጉዳት መጠገን
• ኪራይን በወቅቱ መክፈል

7. የአከራይ ግዴታ
• ቤቱን ለመኖር ተገቢ ሁኔታ ማድረግ
• የቤቱን መብት መጠበቅ

8. የውል መቋረጫ
• አንዱ ወገን በፊት {TERMINATION_NOTICE_PERIOD} ቀን ማሳወቂያ ሲሰጥ

9. ምስክሮች
ምስክር 1: {WITNESS1_NAME} – ፊርማ __________
ምስክር 2: {WITNESS2_NAME} – ፊርማ __________

10. ፊርማ
• የአከራይ ፊርማ፡ __________ ቀን፡ {SIGN_DATE}
• የተከራይ ፊርማ፡ __________ ቀን፡ {SIGN_DATE}`,
    variables: [
      { key: "AGREEMENT_DATE", label: "የውል ቀን", type: "text", required: true },
      { key: "LANDLORD_FULL_NAME", label: "አከራይ ሙሉ ስም", type: "text", required: true },
      { key: "LANDLORD_FATHER_NAME", label: "አከራይ የአባት ስም", type: "text", required: true },
      { key: "LANDLORD_ID_NUMBER", label: "አከራይ መታወቂያ ቁጥር", type: "text", required: true },
      { key: "LANDLORD_ADDRESS", label: "አከራይ አድራሻ", type: "text", required: true },
      { key: "TENANT_FULL_NAME", label: "ተከራይ ሙሉ ስም", type: "text", required: true },
      { key: "TENANT_FATHER_NAME", label: "ተከራይ የአባት ስም", type: "text", required: true },
      { key: "TENANT_ID_NUMBER", label: "ተከራይ መታወቂያ ቁጥር", type: "text", required: true },
      { key: "TENANT_ADDRESS", label: "ተከራይ አድራሻ", type: "text", required: true },
      { key: "PROPERTY_CITY", label: "ከተማ", type: "text", required: true },
      { key: "PROPERTY_SUBCITY", label: "ክፍለ ከተማ", type: "text", required: true },
      { key: "PROPERTY_WOREDA", label: "ወረዳ", type: "text", required: true },
      { key: "PROPERTY_KEBELE", label: "ቀበሌ", type: "text", required: true },
      { key: "PROPERTY_HOUSE_NUMBER", label: "የቤት ቁጥር", type: "text", required: true },
      { key: "PROPERTY_TYPE", label: "የቤት አይነት", type: "text", required: true },
      { key: "RENT_START_DATE", label: "የኪራይ መጀመሪያ ቀን", type: "date", required: true },
      { key: "RENT_END_DATE", label: "የኪራይ ማብቂያ ቀን", type: "date", required: true },
      { key: "RENT_DURATION", label: "የኪራይ ጊዜ", type: "text", required: true },
      { key: "MONTHLY_RENT", label: "ወርሃዊ ኪራይ (ብር)", type: "number", required: true },
      { key: "DEPOSIT_AMOUNT", label: "የተቀማጭ ገንዘብ (ብር)", type: "number", required: true },
      { key: "RENT_PAYMENT_DAY", label: "የክፍያ ቀን", type: "text", required: true },
      { key: "TERMINATION_NOTICE_PERIOD", label: "የማሳወቂያ ጊዜ (በቀናት)", type: "text", required: true },
      { key: "WITNESS1_NAME", label: "ምስክር 1 ስም", type: "text", required: true },
      { key: "WITNESS2_NAME", label: "ምስክር 2 ስም", type: "text", required: true },
      { key: "SIGN_DATE", label: "ፊርማ ቀን", type: "date", required: true },
    ],
  },

];
