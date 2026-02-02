export interface AgreementVariable {
  key: string;
  label: string;
  type: "text" | "number" | "date" | "textarea" | "checkbox";
  required: boolean;
  placeholder?: string;
  dependsOn?: string;
  truthyValue?: string; // e.g., "በወኪል"
  falsyValue?: string; // e.g., "በራሴ"
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
    price: 150,
    language: "am",
    version: "v1",
    category: "Vehicle",
    content: `                                                                                                                                               ቀን {AGREEMENT_DATE} 
                                                              የመኪና ሽያጭ ውል ስምምነት

ሻጭ ----------- {SELLER_FULL_NAME} /ዜግነት {SELLER_NATIONALITY}/ {SELLER_REPRESENTATION} {?SELLER_REPRESENTATION=በወኪል}{SELLER_AGENT_NAME} የውክልና ስልጣን ቁጥር {SELLER_PO_NUMBER} በቀን {SELLER_PO_DATE} {/?} 
  	አድራሻ፡ {SELLER_ADDRESS}
ገዢ ----------- {BUYER_FULL_NAME} /ዜግነት {BUYER_NATIONALITY}/ {BUYER_REPRESENTATION} {?BUYER_REPRESENTATION=በወኪል}{BUYER_AGENT_NAME} የውክልና ስልጣን ቁጥር {BUYER_PO_NUMBER} በቀን {BUYER_PO_DATE} {/?} 
  	አድራሻ፡ {BUYER_ADDRESS}
እኔ ሻጭ {SELLER_REPRESENTATION} {REPRESENTED_NAME} በስም ተመዝግቦ የሚገኘውን የሰሌዳ ቁጥር {VEHICLE_PLATE}፣ የተሸከርካሪው ዓይነት {VEHICLE_TYPE}፣ የተሠራበት አገር {VEHICLE_COUNTRY}፣ የሻንሲ ቁጥር {VEHICLE_CHASSIS}፣ የሞተር ቁጥር {VEHICLE_ENGINE} የሆነውን ተሸከርካሪ ለገዢ ባለበት በብር {SALE_PRICE} ({SALE_PRICE_WORDS}) የሸጥኩላቸው ሲሆን የገንዘብ አከፋፈል በተመለከተ በዚህ ውል ደረሰኝነት አማካኝነት በዛሬው እለት ቅድሚያ  ክፍያ ብር {ADVANCE_PAYMENT}  ተቀብዬ ቀሪውን ክፍያ ብር {REMAINING_PAYMENT} ደግሞ በሚመለከተው መ/ቤት ቀርቤ ስም ሳዞርላቸው ሲከፍሉኝ መኪናው እና ሊብሬውን ለገዢ ማስረከቤንና እና መሸጤን በፊርማዬ አረጋግጣለሁ፡፡
ይህ ተሸከርካሪ ከመሸጡ በፊት የነበረ ዕዳ ዕገዳ ቢኖር ተከራክሬ ለመመለስ እና ማንኛውም የመንግስት ዕዳ ካለ እኔ ሻጭ የምከፍል መሆኑን አረጋግጣለሁ::
እኔ ውል ተቀባይ /ገዢ/ ከዚህ  በላይ የሰሌዳና የሻንሲ ቁጥር የሞተር ቁጥሩ የተገለጸውን መኪና  ከሻጭ ላይ  በብር {SALE_PRICE} ({SALE_PRICE_WORDS}) የገዛኋቸው ሲሆን የገንዘቡንም አከፋፈል በተመለከተ በዛሬው እለት በዚህ  ውል ደረሰኝነት ቅድመ ክፍያ ብር {ADVANCE_PAYMENT} የከፈልኩ ሲሆን ቀሪውን ({REMAINING_PAYMENT_WORDS})  ደግሞ ሻጭ በሚመለከተው መ/ቤት ቀርበው ስም ሲያዞሩል  ልከፍል ተስማምተን በዛሬው እለት መኪናው እና ሊብሬውን ከሻጭ ላይ መረከቤን እና መግዛቴን በፊርማዬ አረጋግጣለሁ።
ይህ ውል በፍ/ብ/ሕ/ቁ 1731/2005 በሚያዘው መሠረት በሕግ ፊት የፀና ነው፡፡ ይህንን ውል እንደውሉ የማይፈፅም ወገን ቢኖር ውሉን ላከበረ ወገን ብር {PENALTY_AMOUNT} ለመንግስት ብር {GOVT_PENALTY_AMOUNT} ከፍሎ ውሉና ገደቡ በፍ/ብ/ሕ/ቁ 1889/1890 በሚያዘው መሠረት በህግ ፊት የፀና ይሆናል፡፡ 
ይህንን ውል ስንዋዋል የነበሩ ምስክሮች
1ኛ. {WITNESS1_NAME}  አድራሻ፡- {WITNESS1_ADDRESS}
2ኛ. {WITNESS2_NAME} አድራሻ፡- {WITNESS2_ADDRESS}
3ኛ. {WITNESS3_NAME} አድራሻ፡- {WITNESS3_ADDRESS}


የሻጭ ስምና ፊርማ                                 የገዢ ስምና ፊርማ                                           የምስክሮች ፊርማ
___________________                                 ______________________              	           1. ____________________
___________________                                 ______________________              	           2. ____________________
							                                                                                                       3. ______________________ `,
    variables: [
      { key: "AGREEMENT_DATE", label: "የውል ቀን", type: "text", required: true },
      {
        key: "SELLER_FULL_NAME",
        label: "የሻጭ ሙሉ ስም",
        type: "text",
        required: true,
      },
      {
        key: "SELLER_NATIONALITY",
        label: "የሻጭ ዜግነት",
        type: "text",
        required: true,
      },
      {
        key: "SELLER_REPRESENTATION",
        label: "በወኪል ነው? (ውክልና ካለ ይምረጡ)",
        type: "checkbox",
        required: true,
        truthyValue: "በወኪል",
        falsyValue: "በራሴ",
      },
      {
        key: "SELLER_AGENT_NAME",
        label: "የወኪል ስም",
        type: "text",
        required: false,
        dependsOn: "SELLER_REPRESENTATION",
      },
      {
        key: "SELLER_PO_NUMBER",
        label: "የውክልና ሰነድ ቁጥር",
        type: "text",
        required: false,
        dependsOn: "SELLER_REPRESENTATION",
      },
      {
        key: "SELLER_PO_DATE",
        label: "የውክልና የተሰጠበት ቀን",
        type: "text",
        required: false,
        dependsOn: "SELLER_REPRESENTATION",
      },
      {
        key: "SELLER_ADDRESS",
        label: "የሻጭ አድራሻ",
        type: "text",
        required: true,
      },
      {
        key: "BUYER_FULL_NAME",
        label: "የገዢ ሙሉ ስም",
        type: "text",
        required: true,
      },
      {
        key: "BUYER_NATIONALITY",
        label: "የገዢ ዜግነት",
        type: "text",
        required: true,
      },
      {
        key: "BUYER_REPRESENTATION",
        label: "በወኪል ነው? (ውክልና ካለ ይምረጡ)",
        type: "checkbox",
        required: true,
        truthyValue: "በወኪል",
        falsyValue: "በራሴ",
      },
      {
        key: "BUYER_AGENT_NAME",
        label: "የወኪል ስም",
        type: "text",
        required: false,
        dependsOn: "BUYER_REPRESENTATION",
      },
      {
        key: "BUYER_PO_NUMBER",
        label: "የውክልና ሰነድ ቁጥር",
        type: "text",
        required: false,
        dependsOn: "BUYER_REPRESENTATION",
      },
      {
        key: "BUYER_PO_DATE",
        label: "የውክልና የተሰጠበት ቀን",
        type: "text",
        required: false,
        dependsOn: "BUYER_REPRESENTATION",
      },
      { key: "BUYER_ADDRESS", label: "የገዢ አድራሻ", type: "text", required: true },
      {
        key: "REPRESENTED_NAME",
        label: "በማን ስም የተመዘገበ",
        type: "text",
        required: true,
      },
      { key: "VEHICLE_PLATE", label: "የሰሌዳ ቁጥር", type: "text", required: true },
      {
        key: "VEHICLE_TYPE",
        label: "የተሸከርካሪው ዓይነት",
        type: "text",
        required: true,
      },
      {
        key: "VEHICLE_COUNTRY",
        label: "የተሠራበት አገር",
        type: "text",
        required: true,
      },
      {
        key: "VEHICLE_CHASSIS",
        label: "የሻንሲ ቁጥር",
        type: "text",
        required: true,
      },
      {
        key: "VEHICLE_ENGINE",
        label: "የሞተር ቁጥር",
        type: "text",
        required: true,
      },
      {
        key: "SALE_PRICE",
        label: "ጠቅላላ የሽያጭ ዋጋ (ብር)",
        type: "number",
        required: true,
      },
      {
        key: "SALE_PRICE_WORDS",
        label: "የሽያጭ ዋጋ (በፊደል)",
        type: "text",
        required: true,
      },
      {
        key: "ADVANCE_PAYMENT",
        label: "ቅድመ ክፍያ ብር",
        type: "number",
        required: true,
      },
      {
        key: "REMAINING_PAYMENT",
        label: "ቀሪ የሽያጭ ዋጋ (ብር)",
        type: "number",
        required: true,
      },
      {
        key: "REMAINING_PAYMENT_WORDS",
        label: "ቀሪ ክፍያ ዋጋ (በፊደል)",
        type: "text",
        required: true,
      },
      {
        key: "PENALTY_AMOUNT",
        label: "የውል ማፍረሻ (ለወገን)",
        type: "number",
        required: true,
      },
      {
        key: "GOVT_PENALTY_AMOUNT",
        label: "የውል ማፍረሻ (ለመንግስት)",
        type: "number",
        required: true,
      },
      {
        key: "WITNESS1_NAME",
        label: "ምስክር 1 ስም",
        type: "text",
        required: true,
      },
      {
        key: "WITNESS1_ADDRESS",
        label: "ምስክር 1 አድራሻ",
        type: "text",
        required: true,
      },
      {
        key: "WITNESS2_NAME",
        label: "ምስክር 2 ስም",
        type: "text",
        required: true,
      },
      {
        key: "WITNESS2_ADDRESS",
        label: "ምስክር 2 አድራሻ",
        type: "text",
        required: true,
      },
      {
        key: "WITNESS3_NAME",
        label: "ምስክር 3 ስም",
        type: "text",
        required: true,
      },
      {
        key: "WITNESS3_ADDRESS",
        label: "ምስክር 3 አድራሻ",
        type: "text",
        required: true,
      },
    ],
  },
  {
    id: "car-rent-am",
    title: "የመኪና ኪራይ ውል ስምምነት",
    description: "የመኪና ኪራይ ውል ማዘጋጃ ቅጽ (Ethiopian Standard)",
    price: 150,
    language: "am",
    version: "v1",
    category: "Vehicle",
    content: `                                                                                                                                              ቀን {AGREEMENT_DATE} 
                                            የመኪና ኪራይ ውል ስምምነት

አከራይ ----------- {LANDLORD_FULL_NAME} 
      /ዜግነት {LANDLORD_NATIONALITY}/ {LANDLORD_REPRESENTATION} {?LANDLORD_REPRESENTATION=በወኪል}{LANDLORD_AGENT_NAME} የውክልና ስልጣን ቁጥር {LANDLORD_PO_NUMBER} በቀን {LANDLORD_PO_DATE} {/?}
      አድራሻ {LANDLORD_ADDRESS}
ተከራይ ----------- {TENANT_FULL_NAME} 
      /ዜግነት {TENANT_NATIONALITY}/ 
      አድራሻ {TENANT_ADDRESS}

እኔ አከራይ {LANDLORD_REPRESENTATION} {REPRESENTED_NAME} ስም ተመዝግቦ የሚገኘውን የሰሌዳ ቁጥር {VEHICLE_PLATE}፣ የተሸከርካሪው ዓይነት {VEHICLE_TYPE}፣ የተሠራበት አገር {VEHICLE_COUNTRY}፣ የሻንሲ ቁጥር {VEHICLE_CHASSIS} የሆነውን ለተከራይ ለ{VEHICLE_PURPOSE} እንዲጠቀሙበት ከዛሬ {RENT_START_DATE} ጀምሮ እስከ {RENT_END_DATE} ድረስ ለ{RENT_DURATION} ጊዜ በወር ብር {MONTHLY_RENT} ያከራየኋቸው ሲሆን የገንዘቡም አከፋፈል በተመለከተ የ{ADVANCE_PAYMENT_MONTHS} የወር ቅድሚያ ክፍያ ብር {ADVANCE_PAYMENT_AMOUNT} ተቀብያለሁ:: ቀጣዩንም በየወሩ ቅድሚያ ሊከፍሉኝ ተስማምተናል::

ተከራይ የተከራዩትን ተሸከርካሪ በሚገባ ተጠንቅቀው እንዲሰሩበት: የውል ጊዜ ሲጠናቀቅ ብንስማማ ውሉን አድሰን ልንቀጥል ካልተስማማን ግን ተከራይ ተሸከርካሪውን በተረከቡት ዓይነት ሊያስረክቡኝ ተስማምተናል:: ተከራይ ከተረከቡበት ጊዜ ጀምሮ የሚፈጠር ማንኛውም የትራፊክ ክስ: ህገወጥ ጭነት ወይም በንብረትና በሰው ላይ ለሚደርሰው ችግር ኃላፊነቱ የተከራይ ይሆናል:: በተጨማሪም አከራይም ሆነ ተከራይ ውል ለማቋረጥ ቢፈልጉ የ{TERMINATION_NOTICE_PERIOD} ቀናት ቅድመ ማስጠንቀቂያ በመስጠት ውሉ ሊቋረጥ ይችላል:: 

ይህም ውል በፍ/ብ/ሕ/ቁ 1731/2005 በሚያዘው መሠረት በሕግ ፊት የፀና ነው፡፡ 

ይህንን ውል እንደውሉ የማይፈፅም ወገን ቢኖር ውሉን ላከበረ ወገን ብር {PENALTY_AMOUNT} ለመንግስት ብር {GOVT_PENALTY_AMOUNT} ከፍሎ ውሉና ገደቡ በፍ/ብ/ሕ/ቁ 1889/1890 በሚያዘው መሠረት በህግ ፊት የፀና ይሆናል፡፡ ውሉም አይፈርስም ስንል ተስማምተን ተዋውለናል፡፡
                             
          ይህንን ውል ስንዋዋል የነበሩ ምስክሮች

1ኛ. {WITNESS1_NAME}  አድራሻ፡- {WITNESS1_ADDRESS}
2ኛ. {WITNESS2_NAME} አድራሻ፡- {WITNESS2_ADDRESS}
3ኛ. {WITNESS3_NAME} አድራሻ፡- {WITNESS3_ADDRESS}

የሻጭ ስምና ፊርማ                                 የገዢ ስምና ፊርማ                                           የምስክሮች ፊርማ
___________________                                 ______________________              	           1. ____________________
___________________                                 ______________________              	           2. ____________________
							                                                                                                       3. ______________________

`,
    variables: [
      { key: "AGREEMENT_DATE", label: "የውል ቀን", type: "text", required: true },
      {
        key: "LANDLORD_FULL_NAME",
        label: "አከራይ ሙሉ ስም",
        type: "text",
        required: true,
      },
      {
        key: "LANDLORD_NATIONALITY",
        label: "አከራይ ዜግነት",
        type: "text",
        required: true,
      },
      {
        key: "LANDLORD_REPRESENTATION",
        label: "በወኪል ነው? (ውክልና ካለ ይምረጡ)",
        type: "checkbox",
        required: true,
        truthyValue: "በወኪል",
        falsyValue: "በራሴ",
      },
      {
        key: "LANDLORD_AGENT_NAME",
        label: "የወኪል ስም",
        type: "text",
        required: false,
        dependsOn: "LANDLORD_REPRESENTATION",
      },
      {
        key: "LANDLORD_PO_NUMBER",
        label: "የውክልና ሰነድ ቁጥር",
        type: "text",
        required: false,
        dependsOn: "LANDLORD_REPRESENTATION",
      },
      {
        key: "LANDLORD_PO_DATE",
        label: "የውክልና የተሰጠበት ቀን",
        type: "text",
        required: false,
        dependsOn: "LANDLORD_REPRESENTATION",
      },
      {
        key: "LANDLORD_ADDRESS",
        label: "አከራይ አድራሻ",
        type: "text",
        required: true,
      },
      {
        key: "TENANT_FULL_NAME",
        label: "ተከራይ ሙሉ ስም",
        type: "text",
        required: true,
      },
      {
        key: "TENANT_NATIONALITY",
        label: "ተከራይ ዜግነት",
        type: "text",
        required: true,
      },
      {
        key: "TENANT_ADDRESS",
        label: "ተከራይ አድራሻ",
        type: "text",
        required: true,
      },
      {
        key: "REPRESENTED_NAME",
        label: "በማን ስም የተመዘገበ",
        type: "text",
        required: true,
      },
      { key: "VEHICLE_PLATE", label: "የሰሌዳ ቁጥር", type: "text", required: true },
      {
        key: "VEHICLE_TYPE",
        label: "የተሸከርካሪው ዓይነት",
        type: "text",
        required: true,
      },
      {
        key: "VEHICLE_COUNTRY",
        label: "የተሠራበት አገር",
        type: "text",
        required: true,
      },
      {
        key: "VEHICLE_CHASSIS",
        label: "የሻንሲ ቁጥር",
        type: "text",
        required: true,
      },
      {
        key: "VEHICLE_PURPOSE",
        label: "የኪራይ አገልግሎት",
        type: "text",
        required: true,
      },
      {
        key: "RENT_START_DATE",
        label: "የኪራይ መጀመሪያ ቀን",
        type: "text",
        required: true,
      },
      {
        key: "RENT_END_DATE",
        label: "የኪራይ ማብቂያ ቀን",
        type: "text",
        required: true,
      },
      { key: "RENT_DURATION", label: "የኪራይ ዘመን", type: "text", required: true },
      {
        key: "MONTHLY_RENT",
        label: "ወርሃዊ ኪራይ (ብር)",
        type: "number",
        required: true,
      },
      {
        key: "ADVANCE_PAYMENT_MONTHS",
        label: "የስንት ወር ቅድሚያ",
        type: "number",
        required: true,
      },
      {
        key: "ADVANCE_PAYMENT_AMOUNT",
        label: "የቅድሚያ ክፍያ መጠን (ብር)",
        type: "number",
        required: true,
      },
      {
        key: "TERMINATION_NOTICE_PERIOD",
        label: "የማሳወቂያ ጊዜ (በቀናት)",
        type: "text",
        required: true,
      },
      {
        key: "PENALTY_AMOUNT",
        label: "የውል ማፍረሻ (ለወገን)",
        type: "number",
        required: true,
      },
      {
        key: "GOVT_PENALTY_AMOUNT",
        label: "የውል ማፍረሻ (ለመንግስት)",
        type: "number",
        required: true,
      },
      {
        key: "WITNESS1_NAME",
        label: "ምስክር 1 ስም",
        type: "text",
        required: true,
      },
      {
        key: "WITNESS1_ADDRESS",
        label: "ምስክር 1 አድራሻ",
        type: "text",
        required: true,
      },
      {
        key: "WITNESS2_NAME",
        label: "ምስክር 2 ስም",
        type: "text",
        required: true,
      },
      {
        key: "WITNESS2_ADDRESS",
        label: "ምስክር 2 አድራሻ",
        type: "text",
        required: true,
      },
      {
        key: "WITNESS3_NAME",
        label: "ምስክር 3 ስም",
        type: "text",
        required: true,
      },
      {
        key: "WITNESS3_ADDRESS",
        label: "ምስክር 3 አድራሻ",
        type: "text",
        required: true,
      },
    ],
  },
  {
    id: "house-sale-am",
    title: "የቤት ሽያጭ ውል ስምምነት",
    description: "የቤት ሽያጭ ውል ማዘጋጃ ቅጽ (Ethiopian Standard)",
    price: 150,
    language: "am",
    version: "v1",
    category: "Real Estate",
    content: `                                                                                                                                                  ቀን {AGREEMENT_DATE} 
                                                              የቤት ሽያጭ ውል ስምምነት

ሻጭ ----------- {SELLER_FULL_NAME} 
    /ዜግነት {SELLER_NATIONALITY}/ {SELLER_REPRESENTATION} {?SELLER_REPRESENTATION=በወኪል}{SELLER_AGENT_NAME} የውክልና ስልጣን ቁጥር {SELLER_PO_NUMBER} በቀን {SELLER_PO_DATE} {/?} 
    አድራሻ፡- {SELLER_ADDRESS}

ገዢ ----------- {BUYER_FULL_NAME} 
    /ዜግነት {BUYER_NATIONALITY}/ {BUYER_REPRESENTATION} {?BUYER_REPRESENTATION=በወኪል}{BUYER_AGENT_NAME} የውክልና ስልጣን ቁጥር {BUYER_PO_NUMBER} በቀን {BUYER_PO_DATE} {/?} 
    አድራሻ፡- {BUYER_ADDRESS}

እኔ ሻጭ በስሜ ተመዝግቦ የሚገኘውን በአዲስ አበባ ከተማ አስተዳደር {PROPERTY_SUBCITY} ክ/ከተማ ወረዳ {PROPERTY_WOREDA} የቤት ቁጥር {PROPERTY_HOUSE_NUMBER} የካርታ ቁጥር {PROPERTY_MAP_NUMBER} የቦታው ስፋት {PROPERTY_LAND_AREA} ካሬ ሜትር የተሰጠበት ቀን {PROPERTY_DATE} የቤቱ አገልግሎት ለመኖሪያ የሆነውን መኖሪያ ቤት ለገዢ በዛሬው ዕለት በብር {SALE_PRICE} ({SALE_PRICE_WORDS}) የሸጥኩላቸው ሲሆን የገንዘብ አከፋፈል በተመለከተ በዚህ ውል ደረሰኝነት አማካኝነት ሙሉ ክፍያ ብር {SALE_PRICE} ({SALE_PRICE_WORDS}) ተቀብዬ መኖሪያ ቤቱን እና ቤቱን የሚመለከቱ ኦርጅናል ማስረጃዎችን ካርታ ጭምር አስረክቤ ተስማምቼ መሸጤን በፊርማዬ አረጋግጣለሁ፡፡

ይህንን የመኖሪያ ቤት ግዢ ከመረከባቸው በፊት በዕዳ ዕገዳ ይዠየዋለሁ አይሸጥም የሚል ተከራካሪ ወገን በመንግስትም ሆነ ከግለሰብ በኩል ቢቀርብ ተከራክሬ ለመመለስ የውል ግዴታ ገብቼ የሸጥኩላቸው መሆኑን በፊርማዬ አረጋግጣለሁ፡፡

እኔም ገዢ ከዚህ በላይ በተገለጸው የውል ቃል መሰረት ተስማምቼ በ{SELLER_FULL_NAME} ስም ተመዝግቦ የሚገኘውን በአዲስ አበባ ከተማ አስተዳደር {PROPERTY_SUBCITY} ክ/ከተማ ወረዳ {PROPERTY_WOREDA} የቤት ቁጥር {PROPERTY_HOUSE_NUMBER} የካርታ ቁጥር {PROPERTY_MAP_NUMBER} የቦታው ስፋት {PROPERTY_LAND_AREA} ካሬ ሜትር የተሰጠበት ቀን {PROPERTY_DATE} በዛሬው እለት ከሻጭ ላይ በብር {SALE_PRICE} ({SALE_PRICE_WORDS}) የገዛሁ ሲሆን የገንዘቡም አከፋፈል በተመለከተ በዚህ ውል ደረሰኝነት አማካኝ ሙሉ ክፍያ ብር {SALE_PRICE} ({SALE_PRICE_WORDS}) ከፍዬ የመኖሪያ ቤቱን እና ቤቱን የሚመለከቱ ኦርጅናል ዶክሚንቶችን ካርታ ተረክቤ ተስማምቼ መግዛቴን በፊርማዬ አረጋግጣለሁ፡፡

የስም ማዞሪያ አሹራን በተመለከተ መንግስት የሚጠይቀውን ክፍያ እኔ ገዢ ልከፍል ተስማምቻለሁ፡፡

            ይህንን የቤት ሽያጭ ውል ስምምነት ስናደርግ የነበሩ ምስክሮች

1. {WITNESS1_NAME}  አድራሻ፡- {WITNESS1_ADDRESS}
2. {WITNESS2_NAME} አድራሻ፡- {WITNESS2_ADDRESS}
3. {WITNESS3_NAME} አድራሻ፡- {WITNESS3_ADDRESS}

    እኛም ምስክሮች ከዚህ በላይ ስማቸው በአከራይ እና ተከራይ የመኪና ውል ስምምነት ተስማምተው ሲዋዋሉ ሲነጋገሩ አይተናል ሰምተናል ስንል በፊርማችን እናረጋግጣለን።

የሻጭ ስምና ፊርማ                                 የገዢ ስምና ፊርማ                                           የምስክሮች ፊርማ
___________________                                 ______________________              	           1. ____________________
___________________                                 ______________________              	           2. ____________________
							                                                                                                       3. ______________________`,
    variables: [
      { key: "AGREEMENT_DATE", label: "የውል ቀን", type: "text", required: true },
      {
        key: "SELLER_FULL_NAME",
        label: "የሻጭ ሙሉ ስም",
        type: "text",
        required: true,
      },
      {
        key: "SELLER_NATIONALITY",
        label: "የሻጭ ዜግነት",
        type: "text",
        required: true,
      },
      {
        key: "SELLER_ADDRESS",
        label: "የሻጭ አድራሻ",
        type: "text",
        required: true,
      },
      {
        key: "SELLER_REPRESENTATION",
        label: "በወኪል ነው? (ውክልና ካለ ይምረጡ)",
        type: "checkbox",
        required: true,
        truthyValue: "በወኪል",
        falsyValue: "በራሴ",
      },
      {
        key: "SELLER_AGENT_NAME",
        label: "የወኪል ስም",
        type: "text",
        required: false,
        dependsOn: "SELLER_REPRESENTATION",
      },
      {
        key: "SELLER_PO_NUMBER",
        label: "የውክልና ሰነድ ቁጥር",
        type: "text",
        required: false,
        dependsOn: "SELLER_REPRESENTATION",
      },
      {
        key: "SELLER_PO_DATE",
        label: "የውክልና የተሰጠበት ቀን",
        type: "text",
        required: false,
        dependsOn: "SELLER_REPRESENTATION",
      },
      {
        key: "BUYER_FULL_NAME",
        label: "የገዢ ሙሉ ስም",
        type: "text",
        required: true,
      },
      {
        key: "BUYER_NATIONALITY",
        label: "የገዢ ዜግነት",
        type: "text",
        required: true,
      },
      { key: "BUYER_ADDRESS", label: "የገዢ አድራሻ", type: "text", required: true },
      {
        key: "BUYER_REPRESENTATION",
        label: "በወኪል ነው? (ውክልና ካለ ይምረጡ)",
        type: "checkbox",
        required: true,
        truthyValue: "በወኪል",
        falsyValue: "በራሴ",
      },
      {
        key: "BUYER_AGENT_NAME",
        label: "የወኪል ስም",
        type: "text",
        required: false,
        dependsOn: "BUYER_REPRESENTATION",
      },
      {
        key: "BUYER_PO_NUMBER",
        label: "የውክልና ሰነድ ቁጥር",
        type: "text",
        required: false,
        dependsOn: "BUYER_REPRESENTATION",
      },
      {
        key: "BUYER_PO_DATE",
        label: "የውክልና የተሰጠበት ቀን",
        type: "text",
        required: false,
        dependsOn: "BUYER_REPRESENTATION",
      },
      {
        key: "PROPERTY_SUBCITY",
        label: "ክፍለ ከተማ",
        type: "text",
        required: true,
      },
      { key: "PROPERTY_WOREDA", label: "ወረዳ", type: "text", required: true },
      {
        key: "PROPERTY_HOUSE_NUMBER",
        label: "የቤት ቁጥር",
        type: "text",
        required: true,
      },
      {
        key: "PROPERTY_MAP_NUMBER",
        label: "የካርታ ቁጥር",
        type: "text",
        required: true,
      },
      {
        key: "PROPERTY_LAND_AREA",
        label: "የቦታው ስፋት (ካሬ ሜትር)",
        type: "text",
        required: true,
      },
      {
        key: "PROPERTY_DATE",
        label: "የካርታ የተሰጠበት ቀን",
        type: "text",
        required: true,
      },
      {
        key: "SALE_PRICE",
        label: "ጠቅላላ የሽያጭ ዋጋ (ብር)",
        type: "number",
        required: true,
      },
      {
        key: "SALE_PRICE_WORDS",
        label: "የሽያጭ ዋጋ (በፊደል)",
        type: "text",
        required: true,
      },
      {
        key: "WITNESS1_NAME",
        label: "ምስክር 1 ስም",
        type: "text",
        required: true,
      },
      {
        key: "WITNESS1_ADDRESS",
        label: "ምስክር 1 አድራሻ",
        type: "text",
        required: true,
      },
      {
        key: "WITNESS2_NAME",
        label: "ምስክር 2 ስም",
        type: "text",
        required: true,
      },
      {
        key: "WITNESS2_ADDRESS",
        label: "ምስክር 2 አድራሻ",
        type: "text",
        required: true,
      },
      {
        key: "WITNESS3_NAME",
        label: "ምስክር 3 ስም",
        type: "text",
        required: true,
      },
      {
        key: "WITNESS3_ADDRESS",
        label: "ምስክር 3 አድራሻ",
        type: "text",
        required: true,
      },
      { key: "SIGN_DATE", label: "ፊርማ ቀን", type: "date", required: true },
    ],
  },
  {
    id: "house-rent-am",
    title: "የቤት ኪራይ ውል ስምምነት",
    description: "የቤት ኪራይ ውል ማዘጋጃ ቅጽ (Ethiopian Standard)",
    price: 150,
    language: "am",
    version: "v1",
    category: "Real Estate",
    content: `                                                                                                                                       ቀን {AGREEMENT_DATE} 
                                                    የቤት ኪራይ ውል ስምምነት

አከራይ ----------- {LANDLORD_FULL_NAME} /
    ዜግነት {LANDLORD_NATIONALITY}/ {LANDLORD_REPRESENTATION} {?LANDLORD_REPRESENTATION=በወኪል}{LANDLORD_AGENT_NAME} የውክልና ስልጣን ቁጥር {LANDLORD_PO_NUMBER} በቀን {LANDLORD_PO_DATE} {/?} አድራሻ {LANDLORD_ADDRESS}
ተከራይ ----------- {TENANT_FULL_NAME} 
/ዜግነት {TENANT_NATIONALITY}/ አድራሻ {TENANT_ADDRESS}

እኔ አከራይ {LANDLORD_REPRESENTATION} {REPRESENTED_NAME} ስም ተመዝግቦ የሚገኘውን በአዲስ አበባ ከተማ አስተዳደር {PROPERTY_SUBCITY} ክፍለ ከተማ ወረዳ {PROPERTY_WOREDA} የካርታ ቁጥር {PROPERTY_MAP_NO} ካርታው የተሰጠበት ቀን {PROPERTY_MAP_DATE} የቦታው ስፋት {PROPERTY_AREA} ካሬ ሜትር አገልግሎቱ {PROPERTY_USAGE} የሆነውን {PROPERTY_LABEL} ቤት ተከራይ ለ{PROPERTY_PURPOSE} አገልግሎት እንዲጠቀሙበት ከዛሬ {RENT_START_DATE} ጀምሮ እስከ {RENT_END_DATE} ድረስ ለ{RENT_DURATION} ጊዜ በወር ብር {MONTHLY_RENT} ያከራየኋቸው ሲሆን የገንዘቡም አከፋፈል በተመለከተ የ{ADVANCE_PAYMENT_MONTHS} ወር ቅድሚያ ክፍያ ብር {ADVANCE_PAYMENT_AMOUNT} ተቀብያለሁ:: ቀጣዩንም በየወሩ ቅድሚያ ሊከፍሉኝ ተስማምተናል::

ሆኖም የዚህ ቤት የመብራት፣ የውሃ እና ሌሎችንም {UTILITIES_RESPONSIBILITY} በተመለከተ ተከራይ ቤቱን ከተረከቡበት ቀን ጀምሮ ያለውን እስከ ውል ፍፃሜ ጊዜ የሚፈለግበትን የፍጆታ ክፍያ በቢሉ መሰረት ለመክፈል የውል ግዴታ ገብተዋል:: ተከራይ ቤቱን ለቀው ሲሄዱ አስቀድሞ በነበረበት ሁኔታ አስተካክለው እንዲያስረክቡ ሁለታችንም ወገኖች ተስማምተናል:: 
እኔም ተከራይ ከላይ አድራሻው የተጠቀሰውን ቤት አገልግሎቱ {PROPERTY_USAGE} የሆነውን በብር ከቀን {RENT_START_DATE} ጀምሮ ብር {MONTHLY_RENT} በወር ልከፍል ተስማምቼ ለ{RENT_DURATION} የተከራየሁ ሲሆን አከፋፈሉንም በተመለከተ ቅድሚያ {ADVANCE_PAYMENT_AMOUNT} ከፍዬ ከዛም የወሩን ቅድሚያ ልከፍል ተስማምቼ በዚህ ውል ላይ ፈርሜያለሁ።
በተጨማሪም አከራይም ሆነ ተከራይ ውል ለማቋረጥ ቢፈልጉ የ{TERMINATION_NOTICE_PERIOD} ቀናት ቅድመ ማስጠንቀቂያ በመስጠት ውሉ ሊቋረጥ ይችላል:: ተከራይ የተከራዩትን ቤት ለሌላ ሶስተኛ ወገን ማስተላለፍ ወይም ማከራየት አይችሉም::

ይህም ውል በፍ/ብ/ሕ/ቁ 1731/2005 በሚያዘው መሠረት በሕግ ፊት የፀና ነው፡፡ ይህንን ውል እንደውሉ የማይፈፅም ወገን ቢኖር ውሉን ላከበረ ወገን ብር {PENALTY_AMOUNT} ለመንግስት ብር {GOVT_PENALTY_AMOUNT} ከፍሎ ውሉና ገደቡ በፍ/ብ/ሕ/ቁ 1889/1890 በሚያዘው መሠረት በህግ ፊት የፀና ይሆናል፡፡ ውሉም አይፈርስም ስንል ተስማምተን ተዋውለናል፡፡

                    ይህንን የቤት ኪራይ ውል ስምምነት ስናደርግ የነበሩ ምስክሮች

1.  {WITNESS1_NAME}  አድራሻ፡- {WITNESS1_ADDRESS}
2.  {WITNESS2_NAME} አድራሻ፡- {WITNESS2_ADDRESS}
3.  {WITNESS3_NAME} አድራሻ፡- {WITNESS3_ADDRESS}
    እኛም ምስክሮች ከዚህ በላይ ስማቸው በአከራይ እና ተከራይ የመኪና ውል ስምምነት ተስማምተው ሲዋዋሉ ሲነጋገሩ አይተናል ሰምተናል ስንል በፊርማችን እናረጋግጣለን።

የሻጭ ስምና ፊርማ                                 የገዢ ስምና ፊርማ                                           የምስክሮች ፊርማ
___________________                                 ______________________              	           1. ____________________
___________________                                 ______________________              	           2. ____________________
							                                                                                                       3. ______________________
`,
    variables: [
      { key: "AGREEMENT_DATE", label: "የውል ቀን", type: "text", required: true },
      {
        key: "LANDLORD_FULL_NAME",
        label: "አከራይ ሙሉ ስም",
        type: "text",
        required: true,
      },
      {
        key: "LANDLORD_NATIONALITY",
        label: "አከራይ ዜግነት",
        type: "text",
        required: true,
      },
      {
        key: "LANDLORD_REPRESENTATION",
        label: "በወኪል ነው? (ውክልና ካለ ይምረጡ)",
        type: "checkbox",
        required: true,
        truthyValue: "በወኪል",
        falsyValue: "በራሴ",
      },
      {
        key: "LANDLORD_AGENT_NAME",
        label: "የወኪል ስም (ካለ)",
        type: "text",
        required: false,
        dependsOn: "LANDLORD_REPRESENTATION",
      },
      {
        key: "LANDLORD_PO_NUMBER",
        label: "የውክልና ሰነድ ቁጥር",
        type: "text",
        required: false,
        dependsOn: "LANDLORD_REPRESENTATION",
      },
      {
        key: "LANDLORD_PO_DATE",
        label: "የውክልና የተሰጠበት ቀን",
        type: "text",
        required: false,
        dependsOn: "LANDLORD_REPRESENTATION",
      },
      {
        key: "LANDLORD_ADDRESS",
        label: "አከራይ አድራሻ",
        type: "text",
        required: true,
      },
      {
        key: "TENANT_FULL_NAME",
        label: "ተከራይ ሙሉ ስም",
        type: "text",
        required: true,
      },
      {
        key: "TENANT_NATIONALITY",
        label: "ተከራይ ዜግነት",
        type: "text",
        required: true,
      },
      {
        key: "TENANT_ADDRESS",
        label: "ተከራይ አድራሻ",
        type: "text",
        required: true,
      },
      {
        key: "REPRESENTED_NAME",
        label: "በማን ስም የተመዘገበ",
        type: "text",
        required: true,
      },
      {
        key: "PROPERTY_SUBCITY",
        label: "ክፍለ ከተማ",
        type: "text",
        required: true,
      },
      { key: "PROPERTY_WOREDA", label: "ወረዳ", type: "text", required: true },
      {
        key: "PROPERTY_MAP_NO",
        label: "የካርታ ቁጥር",
        type: "text",
        required: true,
      },
      {
        key: "PROPERTY_MAP_DATE",
        label: "ካርታ የተሰጠበት ቀን",
        type: "text",
        required: true,
      },
      {
        key: "PROPERTY_AREA",
        label: "የቦታው ስፋት (ካሬ ሜትር)",
        type: "text",
        required: true,
      },
      {
        key: "PROPERTY_PARCEL",
        label: "ፓርሴል ቁጥር",
        type: "text",
        required: true,
      },
      {
        key: "PROPERTY_USAGE",
        label: "የቦታው አገልግሎት",
        type: "text",
        required: true,
      },
      {
        key: "PROPERTY_LABEL",
        label: "መለያ ፊደል (ካለ)",
        type: "text",
        required: false,
      },
      {
        key: "PROPERTY_PURPOSE",
        label: "ለምን አገልግሎት እንደሚከራይ",
        type: "text",
        required: true,
        placeholder: "ለምሳሌ ለመኖሪያ፣ ለንግድ",
      },
      {
        key: "RENT_START_DATE",
        label: "የኪራይ መጀመሪያ ቀን",
        type: "text",
        required: true,
      },
      {
        key: "RENT_END_DATE",
        label: "የኪራይ ማብቂያ ቀን",
        type: "text",
        required: true,
      },
      { key: "RENT_DURATION", label: "የኪራይ ዘመን", type: "text", required: true },
      {
        key: "MONTHLY_RENT",
        label: "ወርሃዊ ኪራይ (ብር)",
        type: "number",
        required: true,
      },
      {
        key: "ADVANCE_PAYMENT_MONTHS",
        label: "የስንት ወር ቅድሚያ",
        type: "number",
        required: true,
      },
      {
        key: "ADVANCE_PAYMENT_AMOUNT",
        label: "የቅድሚያ ክፍያ መጠን (ብር)",
        type: "number",
        required: true,
      },
      {
        key: "UTILITIES_RESPONSIBILITY",
        label: "የመገልገያ ክፍያዎች ኃላፊነት",
        type: "text",
        required: true,
        placeholder: "ለምሳሌ መብራትና ውሃ",
      },
      {
        key: "TERMINATION_NOTICE_PERIOD",
        label: "የማሳወቂያ ጊዜ (በቀናት)",
        type: "text",
        required: true,
      },
      {
        key: "PENALTY_AMOUNT",
        label: "የውል ማፍረሻ (ለወገን)",
        type: "number",
        required: true,
      },
      {
        key: "GOVT_PENALTY_AMOUNT",
        label: "የውል ማፍረሻ (ለመንግስት)",
        type: "number",
        required: true,
      },
      {
        key: "WITNESS1_NAME",
        label: "ምስክር 1 ስም",
        type: "text",
        required: true,
      },
      {
        key: "WITNESS1_ADDRESS",
        label: "ምስክር 1 አድራሻ",
        type: "text",
        required: true,
      },
      {
        key: "WITNESS2_NAME",
        label: "ምስክር 2 ስም",
        type: "text",
        required: true,
      },
      {
        key: "WITNESS2_ADDRESS",
        label: "ምስክር 2 አድራሻ",
        type: "text",
        required: true,
      },
      {
        key: "WITNESS3_NAME",
        label: "ምስክር 3 ስም",
        type: "text",
        required: true,
      },
      {
        key: "WITNESS3_ADDRESS",
        label: "ምስክር 3 አድራሻ",
        type: "text",
        required: true,
      },
    ],
  },
  {
    id: "condo-sale-am",
    title: "የኮንዶሚኒየም ቤት ሽያጭ ውል",
    description: "የኮንዶሚኒየም ቤት ሽያጭ ውል ማዘጋጃ ቅጽ",
    price: 150,
    language: "am",
    version: "v1",
    category: "Real Estate",
    content: `                                                                                                                                            ቀን {AGREEMENT_DATE}
                                                               
                                                       የኮንዶሚኒየም ቤት ሽያጭ ውል ስምምነት

ሻጭ ----------- {SELLER_FULL_NAME} 
    /ዜግነት {SELLER_NATIONALITY}/ {SELLER_REPRESENTATION} {?SELLER_REPRESENTATION=በወኪል}{SELLER_AGENT_NAME} የውክልና ስልጣን ቁጥር {SELLER_PO_NUMBER} በቀን {SELLER_PO_DATE} {/?} 
    አድራሻ፡- {SELLER_ADDRESS}

ገዢ ----------- {BUYER_FULL_NAME} 
    /ዜግነት {BUYER_NATIONALITY}/ {BUYER_REPRESENTATION} {?BUYER_REPRESENTATION=በወኪል}{BUYER_AGENT_NAME} የውክልና ስልጣን ቁጥር {BUYER_PO_NUMBER} በቀን {BUYER_PO_DATE} {/?} 
    አድራሻ፡- {BUYER_ADDRESS}

እኔ ሻጭ በስሜ ተመዝግቦ የሚገኘውን በአዲስ አበባ ከተማ አስተዳደር {PROPERTY_SUBCITY} ክ/ከተማ ወረዳ {PROPERTY_WOREDA} {PROPERTY_SITE_NAME} ሳይት ብሎክ {PROPERTY_BLOCK} ፎቅ {PROPERTY_FLOOR} የቤት ቁጥር {PROPERTY_HOUSE_NUMBER} የሆነውን መኖሪያ ቤት ለገዢ በዛሬው ዕለት በብር {SALE_PRICE} ({SALE_PRICE_WORDS}) የሸጥኩላቸው ሲሆን የገንዘብ አከፋፈል በተመለከተ በዚህ ውል ደረሰኝነት አማካኝነት በዛሬው እለት ቅድሚያ  ክፍያ ብር {ADVANCE_PAYMENT}  ተቀብዬ ቀሪውን ክፍያ ብር በ {PAYMENT_TERM_MONTHS} {REMAINING_PAYMENT} ተቀብዬ የኮንዶሚኒየም መኖሪያ ቤቱን እና ቤቱን የሚመለከቱ ኦርጅናል ማስረጃዎችን ካርታ ጭምር አስረክቤ ተስማምቼ መሸጤን በፊርማዬ አረጋግጣለሁ፡፡
ይህንን የኮንዶሚኒየም ቤት ግዢ ከመረከባቸው በፊት በዕዳ ዕገዳ ይዠየዋለሁ አይሸጥም የሚል ተከራካሪ ወገን በመንግስትም ሆነ ከግለሰብ በኩል ቢቀርብ ተከራክሬ ለመመለስ የውል ግዴታ ገብቼ የሸጥኩላቸው መሆኑን በፊርማዬ አረጋግጣለሁ፡፡
እኔም ገዢ ከዚህ በላይ በተገለጸው የውል ቃል መሰረት ተስማምቼ በ{SELLER_FULL_NAME} ስም ተመዝግቦ የሚገኘውን በአዲስ አበባ ከተማ አስተዳደር {PROPERTY_SUBCITY} ክ/ከተማ ወረዳ {PROPERTY_WOREDA} {PROPERTY_SITE_NAME} ሳይት ብሎክ {PROPERTY_BLOCK} ፎቅ {PROPERTY_FLOOR} የቤት ቁጥር {PROPERTY_HOUSE_NUMBER} በዚህ ውል ደረሰኝነት አማካኝነት በዛሬው እለት ቅድሚያ  ክፍያ ብር {ADVANCE_PAYMENT}  ከፍዬ ቀሪውን ክፍያ ብር በ {PAYMENT_TERM_MONTHS} {REMAINING_PAYMENT} ልከፍል እና የኮንዶሚኒየም መኖሪያ ቤቱን እና ቤቱን የሚመለከቱ ኦርጅናል ማስረጃዎችን ካርታ ጭምር አስረክቤ ተስማምቼ መሸጤን በፊርማዬ አረጋግጣለሁ፡፡



ይህንን ውል ስንዋዋል የነበሩ ምስክሮች
1ኛ. {WITNESS1_NAME}  አድራሻ፡- {WITNESS1_ADDRESS}
2ኛ. {WITNESS2_NAME} አድራሻ፡- {WITNESS2_ADDRESS}
3ኛ. {WITNESS3_NAME} አድራሻ፡- {WITNESS3_ADDRESS}

የሻጭ ስምና ፊርማ                                 የገዢ ስምና ፊርማ                                           የምስክሮች ፊርማ
___________________                                 ______________________              	           1. ____________________
___________________                                 ______________________              	           2. ____________________
							                                                                                                       3. ______________________
`,
    variables: [
      { key: "AGREEMENT_DATE", label: "የውል ቀን", type: "text", required: true },
      {
        key: "SELLER_FULL_NAME",
        label: "የሻጭ ሙሉ ስም",
        type: "text",
        required: true,
      },
      {
        key: "SELLER_NATIONALITY",
        label: "የሻጭ ዜግነት",
        type: "text",
        required: true,
      },
      {
        key: "SELLER_REPRESENTATION",
        label: "በወኪል ነው? (ውክልና ካለ ይምረጡ)",
        type: "checkbox",
        required: true,
        truthyValue: "በወኪል",
        falsyValue: "በራሴ",
      },
      {
        key: "SELLER_AGENT_NAME",
        label: "የወኪል ስም",
        type: "text",
        required: false,
        dependsOn: "SELLER_REPRESENTATION",
      },
      {
        key: "SELLER_PO_NUMBER",
        label: "የውክልና ሰነድ ቁጥር",
        type: "text",
        required: false,
        dependsOn: "SELLER_REPRESENTATION",
      },
      {
        key: "SELLER_PO_DATE",
        label: "የውክልና የተሰጠበት ቀን",
        type: "text",
        required: false,
        dependsOn: "SELLER_REPRESENTATION",
      },
      {
        key: "SELLER_ADDRESS",
        label: "የሻጭ አድራሻ",
        type: "text",
        required: true,
      },
      {
        key: "BUYER_FULL_NAME",
        label: "የገዢ ሙሉ ስም",
        type: "text",
        required: true,
      },
      {
        key: "BUYER_NATIONALITY",
        label: "የገዢ ዜግነት",
        type: "text",
        required: true,
      },
      {
        key: "BUYER_REPRESENTATION",
        label: "በወኪል ነው? (ውክልና ካለ ይምረጡ)",
        type: "checkbox",
        required: true,
        truthyValue: "በወኪል",
        falsyValue: "በራሴ",
      },
      {
        key: "BUYER_AGENT_NAME",
        label: "የወኪል ስም",
        type: "text",
        required: false,
        dependsOn: "BUYER_REPRESENTATION",
      },
      {
        key: "BUYER_PO_NUMBER",
        label: "የውክልና ሰነድ ቁጥር",
        type: "text",
        required: false,
        dependsOn: "BUYER_REPRESENTATION",
      },
      {
        key: "BUYER_PO_DATE",
        label: "የውክልና የተሰጠበት ቀን",
        type: "text",
        required: false,
        dependsOn: "BUYER_REPRESENTATION",
      },
      { key: "BUYER_ADDRESS", label: "የገዢ አድራሻ", type: "text", required: true },
      {
        key: "PROPERTY_SUBCITY",
        label: "ክፍለ ከተማ",
        type: "text",
        required: true,
      },
      { key: "PROPERTY_WOREDA", label: "ወረዳ", type: "text", required: true },
      {
        key: "PROPERTY_SITE_NAME",
        label: "የሳይቱ ስም",
        type: "text",
        required: true,
      },
      { key: "PROPERTY_BLOCK", label: "ብሎክ ቁጥር", type: "text", required: true },
      { key: "PROPERTY_FLOOR", label: "ፎቅ", type: "text", required: true },
      {
        key: "PROPERTY_HOUSE_NUMBER",
        label: "የቤት ቁጥር",
        type: "text",
        required: true,
      },
      {
        key: "SALE_PRICE",
        label: "ጠቅላላ የሽያጭ ዋጋ (ብር)",
        type: "number",
        required: true,
      },
      {
        key: "SALE_PRICE_WORDS",
        label: "የሽያጭ ዋጋ (በፊደል)",
        type: "text",
        required: true,
      },
      {
        key: "ADVANCE_PAYMENT",
        label: "ቅድመ ክፍያ ብር",
        type: "number",
        required: true,
      },
      {
        key: "PAYMENT_TERM_MONTHS",
        label: "ቀሪው የሚከፈልበት ጊዜ (ወር ውስጥ)",
        type: "text",
        required: true,
      },
      {
        key: "REMAINING_PAYMENT",
        label: "ቀሪ የሽያጭ ዋጋ (ብር)",
        type: "number",
        required: true,
      },
      {
        key: "WITNESS1_NAME",
        label: "ምስክር 1 ስም",
        type: "text",
        required: true,
      },
      {
        key: "WITNESS1_ADDRESS",
        label: "ምስክር 1 አድራሻ",
        type: "text",
        required: true,
      },
      {
        key: "WITNESS2_NAME",
        label: "ምስክር 2 ስም",
        type: "text",
        required: true,
      },
      {
        key: "WITNESS2_ADDRESS",
        label: "ምስክር 2 አድራሻ",
        type: "text",
        required: true,
      },
      {
        key: "WITNESS3_NAME",
        label: "ምስክር 3 ስም",
        type: "text",
        required: true,
      },
      {
        key: "WITNESS3_ADDRESS",
        label: "ምስክር 3 አድራሻ",
        type: "text",
        required: true,
      },
    ],
  },
  {
    id: "condo-rent-am",
    title: "የኮንዶሚኒየም ቤት ኪራይ ውል",
    description: "የኮንዶሚኒየም ቤት ኪራይ ውል ማዘጋጃ ቅጽ",
    price: 150,
    language: "am",
    version: "v1",
    category: "Real Estate",
    content: `                                                                                                                                         ቀን {AGREEMENT_DATE} 
                                        የኮንዶሚኒየም ቤት ኪራይ ውል ስምምነት

አከራይ ----------- {LANDLORD_FULL_NAME} 
    /ዜግነት {LANDLORD_NATIONALITY}/ {LANDLORD_REPRESENTATION} {?LANDLORD_REPRESENTATION=በወኪል}{LANDLORD_AGENT_NAME} የውክልና ስልጣን ቁጥር {LANDLORD_PO_NUMBER} በቀን {LANDLORD_PO_DATE}{/?} 
    አድራሻ፡- {LANDLORD_ADDRESS}

ተከራይ ----------- {TENANT_FULL_NAME} 
    /ዜግነት {TENANT_NATIONALITY}/ አድራሻ፡- {TENANT_ADDRESS}

እኔ አከራይ በስሜ ተመዝግቦ የሚገኘውን በአዲስ አበባ ከተማ አስተዳደር {PROPERTY_SUBCITY} ክ/ከተማ ወረዳ {PROPERTY_WOREDA} {PROPERTY_SITE_NAME} ሳይት ብሎክ {PROPERTY_BLOCK} ፎቅ {PROPERTY_FLOOR} የቤት ቁጥር {PROPERTY_HOUSE_NUMBER} የሆነውን መኖሪያ ቤት ተከራይ ለ{RENT_PURPOSE} አገልግሎት እንዲጠቀሙበት ከዛሬ {RENT_START_DATE} ጀምሮ እስከ {RENT_END_DATE} ድረስ ለ{RENT_DURATION} ጊዜ በወር ብር {MONTHLY_RENT} ያከራየኋቸው ሲሆን የገንዘቡም አከፋፈል በተመለከተ የ{ADVANCE_PAY_MONTHS} ወር ቅድሚያ ክፍያ ብር {ADVANCE_PAY_AMOUNT} ተቀብያለሁ:: ቀጣዩንም በየወሩ ቅድሚያ ሊከፍሉኝ ተስማምተናል::

ሆኖም የዚህ ቤት የመብራት፣ የውሃ እና ሌሎችንም {UTILITIES_RESPONSIBILITY} በተመለከተ ተከራይ ቤቱን ከተረከቡበት ቀን ጀምሮ ያለውን እስከ ውል ፍፃሜ ጊዜ የሚፈለግበትን የፍጆታ ክፍያ በቢሉ መሰረት ለመክፈል የውል ግዴታ ገብተዋል:: ተከራይ ቤቱን ለቀው ሲሄዱ አስቀድሞ በነበረበት ሁኔታ አስተካክለው እንዲያስረክቡ ሁለታችንም ወገኖች ተስማምተናል::

በተጨማሪም አከራይም ሆነ ተከራይ ውል ለማቋረጥ ቢፈልጉ የ{NOTICE_PERIOD} ቀናት ቅድመ ማስጠንቀቂያ በመስጠት ውሉ ሊቋረጥ ይችላል:: ተከራይ የተከራዩትን ቤት ለሌላ ሶስተኛ ወገን ማስተላለፍ ወይም ማከራየት አይችሉም::

            ይህንን የኮንዶሚኒየም ቤት ኪራይ ውል ስምምነት ስናደርግ የነበሩ ምስክሮች
እኛ ምስክሮች ሁለቱ ወገኖች ተስማምተው ሲያከራዩና ሲከራዩ አይተናል፡፡

1. {WITNESS1_NAME}  አድራሻ፡- {WITNESS1_ADDRESS}
2. {WITNESS2_NAME} አድራሻ፡- {WITNESS2_ADDRESS}
3. {WITNESS3_NAME} አድራሻ፡- {WITNESS3_ADDRESS}

የሻጭ ስምና ፊርማ                                                                            
___________________                                             	         
___________________                                 
የገዢ ስምና ፊርማ     
____________________
____________________
የምስክሮች ፊርማ
1. ______________________
2. ______________________
3. ______________________`,
    variables: [
      { key: "AGREEMENT_DATE", label: "የውል ቀን", type: "text", required: true },
      {
        key: "LANDLORD_FULL_NAME",
        label: "አከራይ ሙሉ ስም",
        type: "text",
        required: true,
      },
      {
        key: "LANDLORD_NATIONALITY",
        label: "አከራይ ዜግነት",
        type: "text",
        required: true,
      },
      {
        key: "LANDLORD_ADDRESS",
        label: "አከራይ አድራሻ",
        type: "text",
        required: true,
      },
      {
        key: "LANDLORD_REPRESENTATION",
        label: "በወኪል ነው? (ውክልና ካለ ይምረጡ)",
        type: "checkbox",
        required: true,
        truthyValue: "በወኪል",
        falsyValue: "በራሴ",
      },
      {
        key: "LANDLORD_AGENT_NAME",
        label: "የወኪል ስም",
        type: "text",
        required: false,
        dependsOn: "LANDLORD_REPRESENTATION",
      },
      {
        key: "LANDLORD_PO_NUMBER",
        label: "የውክልና ሰነድ ቁጥር",
        type: "text",
        required: false,
        dependsOn: "LANDLORD_REPRESENTATION",
      },
      {
        key: "LANDLORD_PO_DATE",
        label: "የውክልና የተሰጠበት ቀን",
        type: "text",
        required: false,
        dependsOn: "LANDLORD_REPRESENTATION",
      },
      {
        key: "TENANT_FULL_NAME",
        label: "ተከራይ ሙሉ ስም",
        type: "text",
        required: true,
      },
      {
        key: "TENANT_NATIONALITY",
        label: "ተከራይ ዜግነት",
        type: "text",
        required: true,
      },
      {
        key: "TENANT_ADDRESS",
        label: "ተከራይ አድራሻ",
        type: "text",
        required: true,
      },
      {
        key: "PROPERTY_SUBCITY",
        label: "ክፍለ ከተማ",
        type: "text",
        required: true,
      },
      { key: "PROPERTY_WOREDA", label: "ወረዳ", type: "text", required: true },
      {
        key: "PROPERTY_SITE_NAME",
        label: "የሳይቱ ስም",
        type: "text",
        required: true,
      },
      { key: "PROPERTY_BLOCK", label: "ብሎክ ቁጥር", type: "text", required: true },
      { key: "PROPERTY_FLOOR", label: "ፎቅ", type: "text", required: true },
      {
        key: "PROPERTY_HOUSE_NUMBER",
        label: "የቤት ቁጥር",
        type: "text",
        required: true,
      },
      {
        key: "RENT_PURPOSE",
        label: "የኪራዩ አገልግሎት",
        type: "text",
        required: true,
        placeholder: "ለምሳሌ ለመኖሪያ",
      },
      {
        key: "RENT_START_DATE",
        label: "የኪራይ መጀመሪያ ቀን",
        type: "text",
        required: true,
      },
      {
        key: "RENT_END_DATE",
        label: "የኪራይ ማብቂያ ቀን",
        type: "text",
        required: true,
      },
      { key: "RENT_DURATION", label: "የኪራይ ዘመን", type: "text", required: true },
      {
        key: "MONTHLY_RENT",
        label: "ወርሃዊ ኪራይ (ብር)",
        type: "number",
        required: true,
      },
      {
        key: "ADVANCE_PAY_MONTHS",
        label: "የስንት ወር ቅድሚያ",
        type: "number",
        required: true,
      },
      {
        key: "ADVANCE_PAY_AMOUNT",
        label: "የቅድሚያ ክፍያ መጠን (ብር)",
        type: "number",
        required: true,
      },
      {
        key: "UTILITIES_RESPONSIBILITY",
        label: "የመገልገያ ክፍያዎች ኃላፊነት",
        type: "text",
        required: true,
        placeholder: "ለምሳሌ መብራትና ውሃ",
      },
      {
        key: "NOTICE_PERIOD",
        label: "የማሳወቂያ ጊዜ (በቀናት)",
        type: "text",
        required: true,
      },
      {
        key: "WITNESS1_NAME",
        label: "ምስክር 1 ስም",
        type: "text",
        required: true,
      },
      {
        key: "WITNESS1_ADDRESS",
        label: "ምስክር 1 አድራሻ",
        type: "text",
        required: true,
      },
      {
        key: "WITNESS2_NAME",
        label: "ምስክር 2 ስም",
        type: "text",
        required: true,
      },
      {
        key: "WITNESS2_ADDRESS",
        label: "ምስክር 2 አድራሻ",
        type: "text",
        required: true,
      },
      {
        key: "WITNESS3_NAME",
        label: "ምስክር 3 ስም",
        type: "text",
        required: true,
      },
      {
        key: "WITNESS3_ADDRESS",
        label: "ምስክር 3 አድራሻ",
        type: "text",
        required: true,
      },
    ],
  },
];
