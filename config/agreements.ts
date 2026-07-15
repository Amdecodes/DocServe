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
  category: "Vehicle" | "Real Estate" | "Employment" | "Service" | "Other";
}

export const AGREEMENT_TEMPLATES: AgreementTemplate[] = [
  /*
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
እኔ ሻጭ {SELLER_REPRESENTATION} {REPRESENTED_NAME} በስም ተመዝግቦ የሚገኘውን የሰሌዳ ቁጥር {VEHICLE_PLATE}፣ የተሸከርካሪው ዓይነት {VEHICLE_TYPE}፣ የተሠራበት አገር {VEHICLE_COUNTRY}፣ የሻንሲ ቁጥር {VEHICLE_CHASSIS}፣ የሞተር ቁጥር {VEHICLE_ENGINE} የሆነውን ተሸከርካሪ ለገዢ ባለበት በብር {SALE_PRICE} ({SALE_PRICE_WORDS}) የሸጥኩላቸው ሲሆን የገንዘብ አከፋፈል በተመለከተ በዚህ ውል ደረሰኝነት አማካኝነት በዛሬው እለት ቅድሚያ  ክፍያ ብር {ADVANCE_PAYMENT}  ተቀብዬ ቀሪውን ክፍያ ብር {REMAINING_PAYMENT} ደግሞ በሚመለከተው መ/ቤት ቀርቤ ስም ሳዞርላቸው ሲከፍሉኝ መኪናውንና መኪናውን የሚመለከቱ {DOCUMENT_TYPE} ዶክመንቶችን ለገዢ ማስረከቤንና እና መሸጤን በፊርማዬ አረጋግጣለሁ፡፡

ይህ ተሸከርካሪ ከመሸጡ በፊት የነበረ ዕዳ ዕገዳ ቢኖር ተከራክሬ ለመመለስ እና ማንኛውም የመንግስት ዕዳ ካለ እኔ ሻጭ የምከፍል መሆኑን አረጋግጣለሁ::

እኔ ውል ተቀባይ /ገዢ/ ከዚህ  በላይ የሰሌዳና የሻንሲ ቁጥር የሞተር ቁጥሩ የተገለጸውን መኪና  ከሻጭ ላይ  በብር {SALE_PRICE} ({SALE_PRICE_WORDS}) የገዛኋቸው ሲሆን የገንዘቡም አከፋፈል በተመለከተ በዛሬው እለት በዚህ  ውል ደረሰኝነት ቅድመ ክፍያ ብር {ADVANCE_PAYMENT} የከፈልኩ ሲሆን ቀሪውን ({REMAINING_PAYMENT_WORDS})  ደግሞ ሻጭ በሚመለከተው መ/ቤት ቀርበው ስም ሲያዞሩል  ልከፍል ተስማምተን በዛሬው እለት መኪናውንና መኪናውን የሚመለከቱ {DOCUMENT_TYPE} ዶክመንቶችን ከሻጭ ላይ መረከቤን እና መግዛቴን በፊርማዬ አረጋግጣለሁ።

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
      { key: "DOCUMENT_TYPE", label: "ኦርጅናል ሰነድ ነው?", type: "checkbox", required: true, truthyValue: "ኦርጅናል", falsyValue: "ኮፒ" },
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
  */
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

እኔ ሻጭ በስሜ ተመዝግቦ የሚገኘውን በአዲስ አበባ ከተማ አስተዳደር {PROPERTY_SUBCITY} ክ/ከተማ ወረዳ {PROPERTY_WOREDA} {PROPERTY_SITE_NAME} ሳይት ብሎክ {PROPERTY_BLOCK} ፎቅ {PROPERTY_FLOOR} የቤት ቁጥር {PROPERTY_HOUSE_NUMBER} የሆነውን መኖሪያ ቤት ለገዢ በዛሬው ዕለት በብር {SALE_PRICE} ({SALE_PRICE_WORDS}) የሸጥኩላቸው ሲሆን የገንዘብ አከፋፈል በተመለከተ በዚህ ውል ደረሰኝነት አማካኝነት በዛሬው እለት ቅድሚያ  ክፍያ ብር {ADVANCE_PAYMENT}  ተቀብዬ ቀሪውን ክፍያ ብር በ {PAYMENT_TERM_MONTHS} {REMAINING_PAYMENT} ተቀብዬ የኮንዶሚኒየም መኖሪያ ቤቱን እና ቤቱን የሚመለከቱ {DOCUMENT_TYPE} ማስረጃዎችን ካርታ ጭምር አስረክቤ ተስማምቼ መሸጤን በፊርማዬ አረጋግጣለሁ፡፡
ይህንን የኮንዶሚኒየም ቤት ግዢ ከመረከባቸው በፊት በዕዳ ዕገዳ ይዠየዋለሁ አይሸጥም አይለወጥም የሚል ተከራካሪ ወገን በመንግስትም ሆነ ከግለሰብ በኩል ቢቀርብ ተከራክሬ ለመመለስ የውል ግዴታ ገብቼ የሸጥኩላቸው መሆኑን በፊርማዬ አረጋግጣለሁ፡፡
እኔም ገዢ ከዚህ በላይ በተገለጸው የውል ቃል መሰረት ተስማምቼ በ{SELLER_FULL_NAME} ስም ተመዝግቦ የሚገኘውን በአዲስ አበባ ከተማ አስተዳደር {PROPERTY_SUBCITY} ክ/ከተማ ወረዳ {PROPERTY_WOREDA} {PROPERTY_SITE_NAME} ሳይት ብሎክ {PROPERTY_BLOCK} ፎቅ {PROPERTY_FLOOR} የቤት ቁጥር {PROPERTY_HOUSE_NUMBER} በዚህ ውል ደረሰኝነት አማካኝነት በዛሬው እለት ቅድሚያ  ክፍያ ብር {ADVANCE_PAYMENT}  ከፍዬ ቀሪውን ክፍያ ብር በ {PAYMENT_TERM_MONTHS} {REMAINING_PAYMENT} ልከፍል እና የኮንዶሚኒየም መኖሪያ ቤቱን እና ቤቱን የሚመለከቱ {DOCUMENT_TYPE} ማስረጃዎችን ካርታ ጭምር ተረክቤ ተስማምቼ መግዛቴን በፊርማዬ አረጋግጣለሁ፡፡



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
      { key: "DOCUMENT_TYPE", label: "ኦርጅናል ሰነድ ነው?", type: "checkbox", required: true, truthyValue: "ኦርጅናል", falsyValue: "ኮፒ" },
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
  {
    id: "car-sale-am-v2",
    title: "የመኪና ሽያጭ ውል ስምምነት",
    description: "የመኪና ሽያጭ ውል ማዘጋጃ ቅጽ (Ethiopian Standard)",
    price: 150,
    language: "am",
    version: "v1",
    category: "Vehicle",
    content: `{AGREEMENT_DATE} ዓ.ም
የመኪና ሽያጭ ውል ስምምነት

ውል ሰጭ /ሻጭ/: {SELLER_FULL_NAME} /ዜግነት {SELLER_NATIONALITY}/
አድራሻ፡- {SELLER_ADDRESS}

ውል ተቀባይ/ገዢ/: {BUYER_FULL_NAME} /ዜግነት {BUYER_NATIONALITY}/
አድራሻ፡- {BUYER_ADDRESS}

እኔ ውል ሰጪ /ሻጭ/ በስሜ ተመዝግቦ የሚገኘውን የሰሌዳ ቁጥር {VEHICLE_PLATE_NUMBER} የሻንሲ ቁጥር {VEHICLE_CHASSIS_NUMBER}፣ የሞተር ቁጥር {VEHICLE_ENGINE_NUMBER} የተሸከርካሪው አይነት {VEHICLE_TYPE} የሆነውን መኪና ለገዢ ባለበት ሁኔታ በብር {TOTAL_SALE_PRICE} ({TOTAL_SALE_PRICE_WORDS}) የሸጥኩላቸው ሲሆን የገንዘቡም አከፋፈል በተመለከተ በዛሬው እለት በዚህ ውል ደረሰኝነት የሽያጩን ቀብድ ክፍያ ብር {DOWN_PAYMENT_AMOUNT} ({DOWN_PAYMENT_WORDS}) ተቀብዬ በዛሬው እለት መኪናውንና መኪናውን የሚመለከቱ {DOCUMENT_TYPE} ዶክመንቶች ለገዢ ማስረከቤን በፊርማዬ አረጋግጣለሁ፡፡ ቀሪውንና የመጨረሻውን ክፍያ {REMAINING_PAYMENT_AMOUNT} ({REMAINING_PAYMENT_WORDS}) ደግሞ በኢፌድሪ ሰነዶች ምዝገባ ጽ/ቤት ቀርበን ስሙን በስማቸው ሳዘዋውርላቸው ሊከፍሉኝ ተስማምተን ተፈራርመናል፡፡  

ይህን መኪና ገዢ ከመረከባቸው በፊት በእዳ እገዳ ይዠየዋለሁ አይሸጥም አይለወጥም የሚል ተከራካሪ ወገን በመንግስትም ሆነ በግለሰብ ቢቀርብ፤ በትራፊክ ክስም ቢኖርበት ኃላፊነቱ የሻጭ ሲሆን መኪናውን ከተረከቡ በኋላ ያለው ኃላፊነት ግን የገዢ ይሆናል፡፡

እኔም ውል ተቀባይ /ገዢ/ ከዚህ በላይ የሰሌዳ ቁጥሩ፣ የሻንሲ ቁጥሩና የሞተር ቁጥሩ የተገለፀውን መኪና በብር {TOTAL_SALE_PRICE} ({TOTAL_SALE_PRICE_WORDS}) ባለበት ሁኔታ የገዛሁ ሲሆን የገንዘቡም አከፋፈል በተመለከተ በዛሬው እለት በዚህ ውል ደረሰኝነት የሽያጩን ቀብድ ክፍያ ብር {DOWN_PAYMENT_AMOUNT} ({DOWN_PAYMENT_WORDS}) ከፍዬ መኪናውንና መኪናውን የሚመለከቱ {DOCUMENT_TYPE} ዶክመንቶች ከሻጭ ላይ መረከቤን በፊርማዬ አረጋግጣለሁ፡፡ ቀሪውንና የመጨረሻውን ክፍያ {REMAINING_PAYMENT_AMOUNT} ({REMAINING_PAYMENT_WORDS}) ደግሞ በኢፌድሪ ሰነዶች ምዝገባና ጽ/ቤት ቀርበን ስሙ በስሜ ሲዘዋወርልኝ ልከፍል ተስማምተን ተፈራርመናል፡፡  

ይህ ውል በፍ/ብ/ሕ/ቁጥር 1731/2005/2266 መሰረት የተደረገ ሲሆን ይህንን የሽያጭ ውል ስምምነት ለማፍረስ የሚሞክር ወገን ቢኖር ውሉን ላከበረ ወገን ገደብና ኪሣራ ብር {PARTY_PENALTY_AMOUNT} ({PARTY_PENALTY_WORDS}) ለመንግስት ብር {GOVERNMENT_PENALTY_AMOUNT} ({GOVERNMENT_PENALTY_WORDS}) ከፍሎ ውሉና ገደቡ በፍ/ብ/ሕ/ቁ. 1889/1890 መሰረት በሕግ ፊት የጸና ይሆናል፡፡ ውሉም አይፈርስም፡፡

ይህንን የመኪና ሽያጭ ውል ስንዋዋል የነበሩ ምስክሮች

1. {WITNESS1_TITLE} {WITNESS1_NAME}
አድራሻ፡- {WITNESS1_ADDRESS}

2. {WITNESS2_TITLE} {WITNESS2_NAME}
አድራሻ፡- {WITNESS2_ADDRESS}

3. {WITNESS3_TITLE} {WITNESS3_NAME}
አድራሻ፡- {WITNESS3_ADDRESS}

እኛም ምስክሮች ይህንን የመኪና ሽያጭ ውል ስምምነት ሲያደርጉና የሽያጩን ቀብድ ክፍያ ገንዘብ ሲቀባበሉ አይተን በእማኝነት ፈርመናል፡፡ 

የውል ሰጭ /የሻጭ/ ፊርማ     የውል ተቀባይ /የገዢ/ ፊርማ           የምስክሮች ፊርማ

________________________          ________________________          1ኛ/________________________

				                        2ኛ/________________________
                                                          
                                                          3ኛ/________________________
`,
    variables: [
      { key: "AGREEMENT_DATE", label: "የውል ቀን", type: "text", required: true },
      { key: "SELLER_FULL_NAME", label: "ሻጭ ሙሉ ስም", type: "text", required: true },
      { key: "SELLER_NATIONALITY", label: "ሻጭ ዜግነት", type: "text", required: true },
      { key: "SELLER_ADDRESS", label: "ሻጭ አድራሻ", type: "text", required: true },
      { key: "BUYER_FULL_NAME", label: "ገዢ ሙሉ ስም", type: "text", required: true },
      { key: "BUYER_NATIONALITY", label: "ገዢ ዜግነት", type: "text", required: true },
      { key: "BUYER_ADDRESS", label: "ገዢ አድራሻ", type: "text", required: true },
      { key: "VEHICLE_PLATE_NUMBER", label: "የሰሌዳ ቁጥር", type: "text", required: true },
      { key: "VEHICLE_CHASSIS_NUMBER", label: "የሻንሲ ቁጥር", type: "text", required: true },
      { key: "VEHICLE_ENGINE_NUMBER", label: "የሞተር ቁጥር", type: "text", required: true },
      { key: "VEHICLE_TYPE", label: "የተሸከርካሪው አይነት", type: "text", required: true },
      { key: "TOTAL_SALE_PRICE", label: "ጠቅላላ የሽያጭ ዋጋ (ብር)", type: "number", required: true },
      { key: "TOTAL_SALE_PRICE_WORDS", label: "ጠቅላላ የሽያጭ ዋጋ (በፊደል)", type: "text", required: true },
      { key: "DOWN_PAYMENT_AMOUNT", label: "ቀብድ ክፍያ መጠን (ብር)", type: "number", required: true },
      { key: "DOWN_PAYMENT_WORDS", label: "ቀብድ ክፍያ (በፊደል)", type: "text", required: true },
      { key: "DOCUMENT_TYPE", label: "ኦርጅናል ሰነድ ነው?", type: "checkbox", required: true, truthyValue: "ኦርጅናል", falsyValue: "ኮፒ" },
      { key: "REMAINING_PAYMENT_AMOUNT", label: "ቀሪ ክፍያ መጠን (ብር)", type: "number", required: true },
      { key: "REMAINING_PAYMENT_WORDS", label: "ቀሪ ክፍያ (በፊደል)", type: "text", required: true },
      { key: "PARTY_PENALTY_AMOUNT", label: "የውል ማፍረሻ (ለወገን) መጠን (ብር)", type: "number", required: true },
      { key: "PARTY_PENALTY_WORDS", label: "የውል ማፍረሻ (ለወገን) (በፊደል)", type: "text", required: true },
      { key: "GOVERNMENT_PENALTY_AMOUNT", label: "የውል ማፍረሻ (ለመንግስት) መጠን (ብር)", type: "number", required: true },
      { key: "GOVERNMENT_PENALTY_WORDS", label: "የውል ማፍረሻ (ለመንግስት) (በፊደል)", type: "text", required: true },
      { 
        key: "WITNESS1_TITLE", 
        label: "ምስክር 1 መወሰኛ", 
        type: "text", 
        required: true,
        placeholder: "አቶ/ወ/ሮ/ወ/ሪት" 
      },
      { key: "WITNESS1_NAME", label: "ምስክር 1 ስም", type: "text", required: true },
      { key: "WITNESS1_ADDRESS", label: "ምስክር 1 አድራሻ", type: "text", required: true },
      { 
        key: "WITNESS2_TITLE", 
        label: "ምስክር 2 መወሰኛ", 
        type: "text", 
        required: true,
        placeholder: "አቶ/ወ/ሮ/ወ/ሪት" 
      },
      { key: "WITNESS2_NAME", label: "ምስክር 2 ስም", type: "text", required: true },
      { key: "WITNESS2_ADDRESS", label: "ምስክር 2 አድራሻ", type: "text", required: true },
      { 
        key: "WITNESS3_TITLE", 
        label: "ምስክር 3 መወሰኛ", 
        type: "text", 
        required: true,
        placeholder: "አቶ/ወ/ሮ/ወ/ሪት" 
      },
      { key: "WITNESS3_NAME", label: "ምስክር 3 ስም", type: "text", required: true },
      { key: "WITNESS3_ADDRESS", label: "ምስክር 3 አድራሻ", type: "text", required: true },
      { key: "SIGN_DATE", label: "ፊርማ ቀን", type: "date", required: true },
    ],
  },
  /*
  {
    id: "condominium-rent-am",
    title: "የኮንዶሚኒየም ቤት ኪራይ ውል ስምምነት",
    description: "የኮንዶሚኒየም ቤት ኪራይ ውል ማዘጋጃ ቅጽ (Ethiopian Standard)",
    price: 150,
    language: "am",
    version: "v1",
    category: "Real Estate",
    content: `ቀን {AGREEMENT_DATE} ዓ.ም
የኮንዶሚኒየም ቤት ኪራይ ውል ስምምነት

አከራይ፡- {LANDLORD_NAME} ዜግነት {LANDLORD_NATIONALITY}
አድራሻ፡- {LANDLORD_ADDRESS}

ተከራይ፡- {TENANT_NAME} ዜግነት {TENANT_NATIONALITY}
አድራሻ፡- {TENANT_ADDRESS}

እኔ አከራይ በስሜ ተመዝግቦ በ {CITY} ከተማ {SUBCITY} ክ/ከተማ {WOREDA} ወረዳ የቤት ቁጥር {HOUSE_NUMBER} ህንፃ ቁጥር {BUILDING_NUMBER} የቤቱ ስፋት {AREA_SIZE} ካ.ሜትር የወለል ቁጥር {FLOOR_NUMBER} የሳይቱ ስም {SITE_NAME} የሚገኘውን {CONDO_TYPE} ኮንዲሚኒየም መኖሪያ ቤት ተከራይ ለመኖሪያ አገልግሎት ሊገለገሉበት በወር ብር {MONTHLY_RENT} ({MONTHLY_RENT_WORDS}) እየከፈሉ ከዛሬ {RENT_START_DATE} ቀን ጀምሮ ለ {CONTRACT_YEARS} አመት አከራይቻቸዋለሁ፡፡ የገንዘቡም አከፋፈል በተመለከተ በቅድሚያ የ {ADVANCE_PAYMENT_MONTHS} ወሩን ቅድሚያ ክፍያ ብር {ADVANCE_PAYMENT_AMOUNT} በዛሬዉ እለት ተቀብዬ ቀጣይ ክፍያ በየ {PAYMENT_CYCLE} ወሩ በቅድሚያ ለመክፈል ተስማምተዋል፡፡ ይህ ዉል እስከ {CONTRACT_DURATION} ዓመት ድረስ የፀና ነዉ፡፡

እኔ ተከራይ በአከራይ ስም ተመዝግቦ በ {CITY} ከተማ {SUBCITY} ክ/ከተማ {WOREDA} ወረዳ የቤት ቁጥር {HOUSE_NUMBER} ህንፃ ቁጥር {BUILDING_NUMBER} የቤቱ ስፋት {AREA_SIZE} ካ.ሜትር የወለል ቁጥር {FLOOR_NUMBER} የሳይቱ ስም {SITE_NAME} የሆነውን {CONDO_TYPE} ኮንዲሚኒየም ለመኖሪያ አገልግሎት ልገለገልበት በወር ብር {MONTHLY_RENT} ({MONTHLY_RENT_WORDS}) እየከፈልኩ ልጠቀምበት ከዛሬ {RENT_START_DATE} ቀን ጀምሮ ለ {CONTRACT_YEARS} ተከራይቻቸዋለሁ፡፡ የገንዘቡም አከፋፈል በተመለከተ በቅድሚያ የ {ADVANCE_PAYMENT_MONTHS} ወሩን በዛሬዉ እለት የከፈልኩ ሲሆን ቀጣይ ክፍያ በየ {PAYMENT_CYCLE} ወሩ በቅድሚያ ለመክፈል ተስማምተዋል፡፡

ተከራይ ይህንን የተከራዩትን ቤት ለሌላ ሶስተኛ ወገን ማከራየትም ሆነ በሌላ መልኩ ማስተላለፍ አይችሉም፡፡ ይህንን ውል የውሉ ጊዜ ገደብ እንዳለቀ ከተስማማን ውሉን አሻሽለን ለማደስ ካልተስማማን ግን ውሉን በስምምነት ለማፍረስ ተስማምተናል፡፡ አከራይም ሆነ ተከራይ ቤቱን መልቀቅም ሆነ ማስለቀቅ ሲፈልጉ ሁለቱም ወገኖች የ {TERMINATION_NOTICE_MONTHS} ወር ጊዜ ገደብ በቅድሚያ ማስጠንቀቂያ መስጠት ይኖርብናል፡፡ ተከራይ የመብራት የውሃ ሂሳብ በየወሩ የቆጠረውን ሊከፍሉ ተስማምተን ተዋውለናል፡፡ 

ተከራይ የተገለገሉበትን የቤት ኪራይ አጠናቀው በመክፈል ቤቱን በአያያዝ ወይም በአጠቃቀም ጉድለት የተነሳ ለሚደረሰው ማንኛውም ብልሽት ተከራይ በግል ወጪያቸው አድሰውና አስተካክለው የተሰበረና የተበላሸ ቢኖር ጉድለቱን አሟልተው ሊያስረክቡኝ ተስማምተን ማከራየቴን በፊርማዬ አረጋግጣለሁ፡፡

ይህም ውል በፍ/ብ/ሕ/ቁ 1731/2005 በሚያዘው መሠረት በሕግ ፊት የፀና ነው፡፡ ነገር ግን እንደውሉ መሠረት የማይፈፅም ወገን ቢኖር ውሉን ላከበረ ወገን ብር {PARTY_PENALTY_AMOUNT} ({PARTY_PENALTY_WORDS}) ለመንግስት ብር {GOVT_PENALTY_AMOUNT} ({GOVT_PENALTY_WORDS}) በፍ/ብ/ሕ/ቁ 1889/1890 መሠረት ገደብና ኪሳራ ከፍሎ ውሉ የፀና ይሆናል፡፡ 

ይህንን የኮንዶሚኒዬም መኖሪያ ቤት ኪራይ ውል ስንዋዋል የነበሩ ምስክሮች

1/ {WITNESS1_NAME} /ዜግነት {WITNESS1_NATIONALITY}/
አድራሻ፡- {WITNESS1_ADDRESS}

2/ {WITNESS2_NAME} /ዜግነት {WITNESS2_NATIONALITY}/
አድራሻ፡- {WITNESS2_ADDRESS}

3/ {WITNESS3_NAME} /ዜግነት {WITNESS3_NATIONALITY}/
አድራሻ፡- {WITNESS3_ADDRESS}

እኛም ምስክሮች አከራይና ተከራይ ከላይ በተገለጸው መሠረት ሲዋዋሉና ሲፈራረሙ አይተን በምስክርነት ፈርመናል፡፡

የአከራይ ፊርማ              የተከራይ ፊርማ               የምስክሮች ፊርማ 
________________________            ________________________               1/________________________
                                                                     2/________________________
                                                                      3/________________________
`,
    variables: [
      { key: "AGREEMENT_DATE", label: "የውል ቀን", type: "text", required: true },
      { key: "LANDLORD_NAME", label: "አከራይ ሙሉ ስም", type: "text", required: true },
      { key: "LANDLORD_NATIONALITY", label: "አከራይ ዜግነት", type: "text", required: true },
      { key: "LANDLORD_ADDRESS", label: "አከራይ አድራሻ", type: "text", required: true },
      { key: "TENANT_NAME", label: "ተከራይ ሙሉ ስም", type: "text", required: true },
      { key: "TENANT_NATIONALITY", label: "ተከራይ ዜግነት", type: "text", required: true },
      { key: "TENANT_ADDRESS", label: "ተከራይ አድራሻ", type: "text", required: true },
      { key: "CITY", label: "ከተማ", type: "text", required: true },
      { key: "SUBCITY", label: "ክፍለ ከተማ", type: "text", required: true },
      { key: "WOREDA", label: "ወረዳ", type: "text", required: true },
      { key: "HOUSE_NUMBER", label: "የቤት ቁጥር", type: "text", required: true },
      { key: "BUILDING_NUMBER", label: "ህንፃ ቁጥር", type: "text", required: true },
      { key: "AREA_SIZE", label: "የቤቱ ስፋት (ካ.ሜ)", type: "text", required: true },
      { key: "FLOOR_NUMBER", label: "የወለል ቁጥር", type: "text", required: true },
      { key: "SITE_NAME", label: "የሳይቱ ስም", type: "text", required: true },
      { key: "CONDO_TYPE", label: "የኮንዶሚኒየም አይነት", type: "text", required: true },
      { key: "MONTHLY_RENT", label: "ወርሃዊ ኪራይ (ብር)", type: "number", required: true },
      { key: "MONTHLY_RENT_WORDS", label: "ወርሃዊ ኪራይ (በፊደል)", type: "text", required: true },
      { key: "RENT_START_DATE", label: "የኪራይ መጀመሪያ ቀን", type: "date", required: true },
      { key: "CONTRACT_YEARS", label: "የውል ዘመን (በዓመት)", type: "number", required: true },
      { key: "ADVANCE_PAYMENT_MONTHS", label: "የስንት ወር ቅድሚያ", type: "number", required: true },
      { key: "ADVANCE_PAYMENT_AMOUNT", label: "የቅድሚያ ክፍያ መጠን (ብር)", type: "number", required: true },
      { key: "PAYMENT_CYCLE", label: "የክፍያ ዑደት (ወር/ግማሽ ወር)", type: "text", required: true },
      { key: "CONTRACT_DURATION", label: "የውል የቆይታ ጊዜ (ዓመት)", type: "number", required: true },
      { key: "TERMINATION_NOTICE_MONTHS", label: "የማቋረጫ ማስጠንቀቂያ ጊዜ (ወር)", type: "number", required: true },
      { key: "PARTY_PENALTY_AMOUNT", label: "የውል ማፍረሻ (ለወገን) መጠን (ብር)", type: "number", required: true },
      { key: "PARTY_PENALTY_WORDS", label: "የውል ማፍረሻ (ለወገን) (በፊደል)", type: "text", required: true },
      { key: "GOVT_PENALTY_AMOUNT", label: "የውል ማፍረሻ (ለመንግስት) መጠን (ብር)", type: "number", required: true },
      { key: "GOVT_PENALTY_WORDS", label: "የውል ማፍረሻ (ለመንግስት) (በፊደል)", type: "text", required: true },
      { key: "WITNESS1_NAME", label: "ምስክር 1 ስም", type: "text", required: true },
      { key: "WITNESS1_NATIONALITY", label: "ምስክር 1 ዜግነት", type: "text", required: true },
      { key: "WITNESS1_ADDRESS", label: "ምስክር 1 አድራሻ", type: "text", required: true },
      { key: "WITNESS2_NAME", label: "ምስክር 2 ስም", type: "text", required: true },
      { key: "WITNESS2_NATIONALITY", label: "ምስክር 2 ዜግነት", type: "text", required: true },
      { key: "WITNESS2_ADDRESS", label: "ምስክር 2 አድራሻ", type: "text", required: true },
      { key: "WITNESS3_NAME", label: "ምስክር 3 ስም", type: "text", required: true },
      { key: "WITNESS3_NATIONALITY", label: "ምስክር 3 ዜግነት", type: "text", required: true },
      { key: "WITNESS3_ADDRESS", label: "ምስክር 3 አድራሻ", type: "text", required: true },
      { key: "SIGN_DATE", label: "ፊርማ ቀን", type: "date", required: true },
    ],
  },
  */
  {
    id: "marriage-contract-am",
    title: "የጋብቻ ውል ስምምነት",
    description: "በሀገር ባህል መሰረት የተደረገ የጋብቻ ውል ስምምነት",
    price: 150,
    language: "am",
    version: "v1",
    category: "Other",
    content: `ቀን {AGREEMENT_DATE} ዓ.ም
በሀገር ባህል መሰረት የተደረገ የጋብቻ ውል ስምምነት

የጋብቻ ውል ፈጻሚዎች:
1/ አቶ {GROOM_NAME} (ዜግነት {GROOM_NATIONALITY})
   አድራሻ: {GROOM_ADDRESS}

2/ ወ/ሪት {BRIDE_NAME} (ዜግነት {BRIDE_NATIONALITY})
   አድራሻ: {BRIDE_ADDRESS}

እኛ የጋብቻ ውል ፈጻሚዎች ያለማንም አስገዳጅነት በራሳችን ፈቃድ ወደን ይህንን የጋብቻ ውል ስምምነት አድርገናል፡፡

እኔ አንደኛ የጋብቻ ውል አድራጊ አቶ {GROOM_NAME} ከወ/ሪት {BRIDE_NAME} ጋር ዛሬ {AGREEMENT_DAY_NAME} ቀን {AGREEMENT_DATE} ዓ.ም ይህንን የጋብቻ ውል ስምምነት ያደረኩ ሲሆን በጋብቻችንም ውስጥ ከባለቤቴ ጋር ወደፊት በጋራ ሰርተን በምናገኘው ገቢ ልንተዳደር ተስማምቻለሁ፡፡ ከጋብቻውም በኋላ ማንኛውንም የምናፈራውን የሚንቀሳቀስም ሆነ የማይንቀሳቀስ ንብረት የጋራ ንብረታችን እንዲሆን ተስማምቼ ይህንን የጋብቻ ውል በፍቃደኝነት የፈፀምኩ መሆኔን በፊርማዬ አረጋግጣለሁ፡፡ 

እኔ ሁለተኛ የጋብቻ ውል አድራጊ ወ/ሪት {BRIDE_NAME} ከአቶ {GROOM_NAME} ጋር ዛሬ {AGREEMENT_DAY_NAME} ቀን {AGREEMENT_DATE} ዓ.ም ይህንን የጋብቻ ውል ስምምነት ያደረኩ ሲሆን በጋብቻችንም ውስጥ ከባለቤቴ ጋር ወደፊት በጋራ ሰርተን በምናገኘው ገቢ ልንተዳደር ተስማምቻለሁ፡፡ ከጋብቻውም በኋላ ማንኛውንም የምናፈራውን የሚንቀሳቀስም ሆነ የማይንቀሳቀስ ንብረት የጋራ ንብረታችን እንዲሆን ተስማምቼ ይህንን የጋብቻ ውል በፍቃደኝነት የፈፀምኩ መሆኔን በፊርማዬ አረጋግጣለሁ፡፡ 

ይህ የጋብቻ ውል ስምምነት በፍ/ብ/ሕ/ቁጥር 529/625 መሰረት የተፈፀመ የጋብቻ ውል ስምምነት ነው፡፡ 

ይህንን የጋብቻ ውል ስናደርግ የነበሩ ምስክሮች:

በ 1ኛ ተዋዋይ በአቶ {GROOM_NAME} በኩል:
1/ አቶ {GROOM_WITNESS1_NAME} (ዜግነት {GROOM_WITNESS1_NATIONALITY})
   አድራሻ: {GROOM_WITNESS1_ADDRESS}

2/ አቶ {GROOM_WITNESS2_NAME} (ዜግነት {GROOM_WITNESS2_NATIONALITY})
   አድራሻ: {GROOM_WITNESS2_ADDRESS}

በ 2ኛ ተዋዋይ በወ/ሪት {BRIDE_NAME} በኩል:
1/ አቶ {BRIDE_WITNESS1_NAME} (ዜግነት {BRIDE_WITNESS1_NATIONALITY})
   አድራሻ: {BRIDE_WITNESS1_ADDRESS}

2/ አቶ {BRIDE_WITNESS2_NAME} (ዜግነት {BRIDE_WITNESS2_NATIONALITY})
   አድራሻ: {BRIDE_WITNESS2_ADDRESS}

እኛም ምስክሮች አቶ {GROOM_NAME} ከወ/ሪት {BRIDE_NAME} ዛሬ {AGREEMENT_DAY_NAME} ቀን {AGREEMENT_DATE} ዓ.ም በራሳቸው ፈቃድ ተዋደው የጋብቻ ውል ስምምነታቸውን ሲያደርጉ እና ሲዋዋሉ ተገኘተን ያየን መሆናችንን በፊርማችን እናረጋግጣለን፡፡ ይህ ውል በአራት ኮፒ ተዘጋጅቶ አንደኛ እና ሁለተኛ ኮፒ በሁለቱ ተዋዋዮች እጅ ይገኛል፡፡ ሶስተኛው እና አራተኛው በሁለቱ ሽማግሌዎች እጅ ይገኛል፡፡ 

የተጋቢዎች ስምና ፈርማ
1. ________________________ ({GROOM_NAME})
2. ________________________ ({BRIDE_NAME})

የምስክሮች ፈርማ በ 2ኛ ተዋዋይ በኩል          የምስክሮች ፈርማ በ 1ኛ ተዋዋይ በኩል
1. ________________________                1. ________________________
2. ________________________                2. ________________________
`,
    variables: [
      { key: "AGREEMENT_DATE", label: "የውል ቀን", type: "text", required: true },
      { key: "AGREEMENT_DAY_NAME", label: "የውል ቀን ስም", type: "text", required: true, placeholder: "ለምሳሌ: ሰኞ, ማክሰኞ" },
      { key: "GROOM_NAME", label: "ጋብቻ ሰው ስም", type: "text", required: true },
      { key: "GROOM_NATIONALITY", label: "ጋብቻ ሰው ዜግነት", type: "text", required: true },
      { key: "GROOM_ADDRESS", label: "ጋብቻ ሰው አድራሻ", type: "text", required: true },
      { key: "BRIDE_NAME", label: "ጋብቻ ሴት ስም", type: "text", required: true },
      { key: "BRIDE_NATIONALITY", label: "ጋብቻ ሴት ዜግነት", type: "text", required: true },
      { key: "BRIDE_ADDRESS", label: "ጋብቻ ሴት አድራሻ", type: "text", required: true },
      { key: "GROOM_WITNESS1_NAME", label: "ጋብቻ ሰው ምስክር 1 ስም", type: "text", required: true },
      { key: "GROOM_WITNESS1_NATIONALITY", label: "ጋብቻ ሰው ምስክር 1 ዜግነት", type: "text", required: true },
      { key: "GROOM_WITNESS1_ADDRESS", label: "ጋብቻ ሰው ምስክር 1 አድራሻ", type: "text", required: true },
      { key: "GROOM_WITNESS2_NAME", label: "ጋብቻ ሰው ምስክር 2 ስም", type: "text", required: true },
      { key: "GROOM_WITNESS2_NATIONALITY", label: "ጋብቻ ሰው ምስክር 2 ዜግነት", type: "text", required: true },
      { key: "GROOM_WITNESS2_ADDRESS", label: "ጋብቻ ሰው ምስክር 2 አድራሻ", type: "text", required: true },
      { key: "BRIDE_WITNESS1_NAME", label: "ጋብቻ ሴት ምስክር 1 ስም", type: "text", required: true },
      { key: "BRIDE_WITNESS1_NATIONALITY", label: "ጋብቻ ሴት ምስክር 1 ዜግነት", type: "text", required: true },
      { key: "BRIDE_WITNESS1_ADDRESS", label: "ጋብቻ ሴት ምስክር 1 አድራሻ", type: "text", required: true },
      { key: "BRIDE_WITNESS2_NAME", label: "ጋብቻ ሴት ምስክር 2 ስም", type: "text", required: true },
      { key: "BRIDE_WITNESS2_NATIONALITY", label: "ጋብቻ ሴት ምስክር 2 ዜግነት", type: "text", required: true },
      { key: "BRIDE_WITNESS2_ADDRESS", label: "ጋብቻ ሴት ምስክር 2 አድራሻ", type: "text", required: true },
      { key: "SIGN_DATE", label: "ፊርማ ቀን", type: "date", required: true },
    ],
  },
  {
    id: "guarantee-letter-am",
    title: "የዋስትና ደብዳቤ",
    description: "የዋስትና ደብዳቤ ማዘጋጃ ቅጽ (Ethiopian Standard)",
    price: 150,
    language: "am",
    version: "v1",
    category: "Service",
    content: `ስልክ፦ {PHONE_NUMBER}

ቀን {AGREEMENT_DATE}

ለ {RECIPIENT_ORGANIZATION}

የዋስትና ደብዳቤ

ለ {GUARANTEE_FOR_NAME} ዋስ ለመሆን ይህንን ደብዳቤ እንጽፋለን። 

{EMPLOYEE_NAME} በ {COMPANY_NAME} የስራ መደብ {JOB_TITLE} ተቀጥረው በወር የተጣራ {NET_SALARY_AMOUNT} ({NET_SALARY_WORDS}) ብር እየተከፈላቸው እያገለገሉ የሚገኙ ሲሆን ለ አቶ/ወ/ሮ/ወ/ሪት {GUARANTEE_FOR_NAME} ለተባሉት ግለሰብ ዋስ ለመሆን ደብዳቤ ለ {RECIPIENT_ORGANIZATION} እንዲፃፍላቸው የጠየቁን ሲሆን ይህንን መረጃ ሰጥተናቸዋል። 

በመሆኑም ተቀጣሪው {EMPLOYEE_NAME} በማናቸውም ሁኔታ ከስራ ቢወጡ ወይም አድራሻ ቢቀይሩ የምናሳውቅ መሆናችንን እንገልፃለን። 




ከሰላምታ ጋር

{COMPANY_NAME}
{COMPANY_ADDRESS}
{COMPANY_PHONE}

የሥራ አስኪያጅ ፊርማ፡ __________________
ስም፡ {EMPLOYER_NAME}
ቀን፡ {SIGN_DATE}
`,
    variables: [
      { key: "PHONE_NUMBER", label: "ስልክ ቁጥር", type: "text", required: true },
      { key: "AGREEMENT_DATE", label: "የደብዳቤ ቀን", type: "text", required: true },
      { key: "RECIPIENT_ORGANIZATION", label: "ለ (የተቀበል ድርጅት/ባለስልጣን)", type: "text", required: true },
      { key: "GUARANTEE_FOR_NAME", label: "የዋስ ሰጭ ስም", type: "text", required: true },
      { key: "EMPLOYEE_NAME", label: "የተቀጣሪ ስም", type: "text", required: true },
      { key: "COMPANY_NAME", label: "የድርጅት ስም", type: "text", required: true },
      { key: "JOB_TITLE", label: "የስራ መደብ", type: "text", required: true },
      { key: "NET_SALARY_AMOUNT", label: "የተጣራ ደመወዝ መጠን (ብር)", type: "number", required: true },
      { key: "NET_SALARY_WORDS", label: "የተጣራ ደመወዝ (በፊደል)", type: "text", required: true },
      { key: "COMPANY_ADDRESS", label: "የድርጅት አድራሻ", type: "text", required: true },
      { key: "COMPANY_PHONE", label: "የድርጅት ስልክ", type: "text", required: true },
      { key: "EMPLOYER_NAME", label: "የሥራ አስኪያጅ ስም", type: "text", required: true },
      { key: "SIGN_DATE", label: "ፊርማ ቀን", type: "date", required: true },
    ],
  },
  {
    id: "employment-contract-am",
    title: "የሥራ ቅጥር ስምምነት ውል",
    description: "የሥራ ቅጥር (Employment) ውል ማዘጋጃ ቅጽ (Ethiopian Standard)",
    price: 150,
    language: "am",
    version: "v1",
    category: "Employment",
    content: `ቀን {AGREEMENT_DATE} ዓ.ም

የሥራ ቅጥር ስምምነት ውል

ቀጣሪ (የሥራ ሰጭ)፡- {EMPLOYER_NAME} /ዜግነት {EMPLOYER_NATIONALITY}/
አድራሻ፡- {EMPLOYER_ADDRESS}
የንግድ ምዝገባ ቁጥር፡ {EMPLOYER_REGISTRATION_NUMBER}

ተቀጣሪ (ሰራተኛ)፡- {EMPLOYEE_NAME} /ዜግነት {EMPLOYEE_NATIONALITY}/
አድራሻ፡- {EMPLOYEE_ADDRESS}

እኔ ቀጣሪ በስሜ ተመዝግቦ በ {EMPLOYER_CITY} ከተማ {EMPLOYER_SUBCITY} ክ/ከተማ {EMPLOYER_WOREDA} ወረዳ የቤት ቁጥር {EMPLOYER_HOUSE_NUMBER} የንግድ ምዝገባ ቁጥር {EMPLOYER_REGISTRATION_NUMBER} የንግድ ስራ ፈቃድ ቁጥር {BUSINESS_LICENSE_NUMBER} የተሰጠበት ቀን {LICENSE_ISSUE_DATE} የግብር ከፋይ መለያ ቁጥር {TIN_NUMBER} የንግድ ስራ መስኩ {BUSINESS_TYPE} ለሆነው ንግድ ድርጅቴ ተቀጣሪ {EMPLOYEE_NAME} በድርጅቴ ውስጥ {JOB_TITLE} የስራ ዘርፍ እንዲያገለግሉ በወር ብር {MONTHLY_SALARY} ({MONTHLY_SALARY_WORDS}) ሂሳብ እየከፈልኳቸው ከዛሬ {CONTRACT_START_DATE} ቀን ጀምሮ እስከ {CONTRACT_END_DATE} ድረስ ለ {CONTRACT_DURATION_MONTHS} ወር በሚቆይ የቅጥር ውል መሠረት የቀጠርኳቸው ሲሆን ተቀጣሪም በተቀጠሩበት ሙያ ስራቸውን በአግባቡ እንዲያከናውኑ ለዚህ ለተቀጠሩበት የስራ መስክ ሙሉ ሃላፊነት እንዳለባቸው ስምምነት አድርገን የቀጠርኳቸው መሆኔን በፊርማዬ አረጋግጣለሁ፡፡ 
ተቀጣሪው በሙያው ድርጅቱን የሚያገለግል ሲሆን ቀጣሪም የወር ደመወዛቸውን በወቅቱ የምከፍላቸው መሆኑን ተስማምተን ቀጥሬአቸዋለሁ፡፡

   እኔም ተቀጣሪ ከዚህ በላይ በተገለፀው መሰረት በቀጣሪ {EMPLOYER_NAME} ድርጅት ውስጥ በ {JOB_TITLE} የስራ ዘርፍ በየወሩ ብር {MONTHLY_SALARY} ({MONTHLY_SALARY_WORDS}) እየተከፈለኝ ከዛሬ {CONTRACT_START_DATE} ቀን ጀምሮ እስከ {CONTRACT_END_DATE} ድረስ ለ {CONTRACT_DURATION_MONTHS} ወር እንድሠራ የተቀጠርኩ ሲሆን እኔም ለተቀጠርኩበት ሙያ ስራዬን በሚገባ የምወጣና ቀጣሪውም የወር ደመወዜን በወቅቱ እየከፈሉኝ ለመስራት ተዋውያለሁ፡፡ 

ተቀጣሪ ይህንን የስራ ቅጥር ውል የውሉ ጊዜ እንዳለቀ ከተስማማን ውሉን አሻሽለን ለማደስ ካልተስማማን ግን ውሉን በስምምነት ለማፍረስ ተስማምተናል፡፡ ቀጣሪም ሆነ ተቀጣሪ ይህን የስራ ቅጥር ውል መልቀቅም ሆነ ማስለቀቅ ሲፈልጉ ሁለቱም ወገኖች የ {TERMINATION_NOTICE_DAYS} ቀን ጊዜ ገደብ በቅድሚያ ማስጠንቀቂያ መስጠት ይኖርበታል፡፡ ተቀጣሪ በድርጅቱ ውስጥ ሲሰሩ የደህንነት ስራ ልብሶችና አስፈላጊ መሳሪያዎች {EMPLOYER_PROVIDES_EQUIPMENT} በቀጣሪ ወጪ ይሰጣል፡፡

ይህም ውል በፍ/ብ/ሕ/ቁ 1156/2019 (የሥራ ሕግ) በሚያዘው መሠረት በሕግ ፊት የፀና ነው፡፡ ነገር ግን እንደውሉ መሠረት የማይፈፅም ወገን ቢኖር ውሉን ላከበረ ወገን ብር {PARTY_PENALTY_AMOUNT} ({PARTY_PENALTY_WORDS}) ለመንግስት ብር {GOVT_PENALTY_AMOUNT} ({GOVT_PENALTY_WORDS}) በፍ/ብ/ሕ/ቁ 1156/2019 መሠረት ገደብና ኪሳራ ከፍሎ ውሉ የፀና ይሆናል፡፡ 

ይህንን የሥራ ቅጥር ውል ስንዋዋል የነበሩ ምስክሮች

1/ {WITNESS1_NAME} /ዜግነት {WITNESS1_NATIONALITY}/
አድራሻ፡- {WITNESS1_ADDRESS}

2/ {WITNESS2_NAME} /ዜግነት {WITNESS2_NATIONALITY}/
አድራሻ፡- {WITNESS2_ADDRESS}

3/ {WITNESS3_NAME} /ዜግነት {WITNESS3_NATIONALITY}/
አድራሻ፡- {WITNESS3_ADDRESS}

እኛም ምስክሮች ቀጣሪና ተቀጣሪ ከላይ በተገለጸው መሠረት ሲዋዋሉና ሲፈራረሙ አይተን በምስክርነት ፈርመናል፡፡

የቀጣሪ ፊርማ              የተቀጣሪ ፊርማ               የምስክሮች ፊርማ 
________________________            ________________________               1/________________________
                                                                     2/________________________
                                                                      3/________________________
`,
    variables: [
      { key: "AGREEMENT_DATE", label: "የውል ቀን", type: "date", required: true },
      { key: "EMPLOYER_NAME", label: "ቀጣሪ (የሥራ ሰጭ) ሙሉ ስም/ድርጅት ስም", type: "text", required: true },
      { key: "EMPLOYER_NATIONALITY", label: "ቀጣሪ ዜግነት", type: "text", required: true },
      { key: "EMPLOYER_ADDRESS", label: "ቀጣሪ አድራሻ", type: "text", required: true },
      { key: "EMPLOYER_REGISTRATION_NUMBER", label: "የቀጣሪ ንግድ ምዝገባ ቁጥር", type: "text", required: true },
      { key: "EMPLOYEE_NAME", label: "ተቀጣሪ (ሰራተኛ) ሙሉ ስም", type: "text", required: true },
      { key: "EMPLOYEE_NATIONALITY", label: "ተቀጣሪ ዜግነት", type: "text", required: true },
      { key: "EMPLOYEE_ADDRESS", label: "ተቀጣሪ አድራሻ", type: "text", required: true },
      { key: "EMPLOYER_CITY", label: "የቀጣሪ ከተማ", type: "text", required: true },
      { key: "EMPLOYER_SUBCITY", label: "የቀጣሪ ክፍለ ከተማ", type: "text", required: true },
      { key: "EMPLOYER_WOREDA", label: "የቀጣሪ ወረዳ", type: "text", required: true },
      { key: "EMPLOYER_HOUSE_NUMBER", label: "የቀጣሪ የቤት ቁጥር", type: "text", required: true },
      { key: "BUSINESS_LICENSE_NUMBER", label: "የንግድ ስራ ፈቃድ ቁጥር", type: "text", required: true },
      { key: "LICENSE_ISSUE_DATE", label: "የፈቃድ ቀን", type: "date", required: true },
      { key: "TIN_NUMBER", label: "የግብር ከፋይ መለያ ቁጥር (TIN)", type: "text", required: true },
      { key: "BUSINESS_TYPE", label: "የንግድ ስራ መስክ/አይነት", type: "text", required: true },
      { key: "JOB_TITLE", label: "የስራ መደብ/ማዕረግ", type: "text", required: true },
      { key: "MONTHLY_SALARY", label: "ወርሃዊ ደመወዝ (ብር)", type: "number", required: true },
      { key: "MONTHLY_SALARY_WORDS", label: "ወርሃዊ ደመወዝ (በፊደል)", type: "text", required: true },
      { key: "CONTRACT_START_DATE", label: "የስራ መጀመሪያ ቀን", type: "date", required: true },
      { key: "CONTRACT_END_DATE", label: "የስራ መጨረሻ ቀን", type: "date", required: true },
      { key: "CONTRACT_DURATION_MONTHS", label: "የውል ዘመን (በወር)", type: "number", required: true },
      { key: "TERMINATION_NOTICE_DAYS", label: "የማቋረጫ ማስጠንቀቂያ ጊዜ (በቀን)", type: "number", required: true },
      { key: "EMPLOYER_PROVIDES_EQUIPMENT", label: "የሥራ መሳሪያዎች (የሚሰጡ/የማይሰጡ)", type: "text", required: true },
      { key: "PARTY_PENALTY_AMOUNT", label: "የውል ማፍረሻ (ለወገን) መጠን (ብር)", type: "number", required: true },
      { key: "PARTY_PENALTY_WORDS", label: "የውል ማፍረሻ (ለወገን) (በፊደል)", type: "text", required: true },
      { key: "GOVT_PENALTY_AMOUNT", label: "የውል ማፍረሻ (ለመንግስት) መጠን (ብር)", type: "number", required: true },
      { key: "GOVT_PENALTY_WORDS", label: "የውል ማፍረሻ (ለመንግስት) (በፊደል)", type: "text", required: true },
      { key: "WITNESS1_NAME", label: "ምስክር 1 ስም", type: "text", required: true },
      { key: "WITNESS1_NATIONALITY", label: "ምስክር 1 ዜግነት", type: "text", required: true },
      { key: "WITNESS1_ADDRESS", label: "ምስክር 1 አድራሻ", type: "text", required: true },
      { key: "WITNESS2_NAME", label: "ምስክር 2 ስም", type: "text", required: true },
      { key: "WITNESS2_NATIONALITY", label: "ምስክር 2 ዜግነት", type: "text", required: true },
      { key: "WITNESS2_ADDRESS", label: "ምስክር 2 አድራሻ", type: "text", required: true },
      { key: "WITNESS3_NAME", label: "ምስክር 3 ስም", type: "text", required: true },
      { key: "WITNESS3_NATIONALITY", label: "ምስክር 3 ዜግነት", type: "text", required: true },
      { key: "WITNESS3_ADDRESS", label: "ምስክር 3 አድራሻ", type: "text", required: true }
    ]
  },
  {
    id: "contract-labor-am",
    title: "የኮንትራት ስራ ቅጥር ውል ስምምነት",
    description: "የኮንትራት ስራ ቅጥር ውል ማዘጋጃ ቅጽ (Ethiopian Standard)",
    price: 150,
    language: "am",
    version: "v1",
    category: "Service",
    content: `ቀን {AGREEMENT_DATE} ዓ.ም

የኮንትራት ስራ ቅጥር ውል ስምምነት

ውል ሰጪ: {EMPLOYER_NAME} / ዜግነት {EMPLOYER_NATIONALITY}/
የሥራ ድርሻ: {EMPLOYER_ROLE}
አድራሻ: {EMPLOYER_ADDRESS}

ውል ተቀባይ: {EMPLOYEE_NAME} / ዜግነት {EMPLOYEE_NATIONALITY}/
አድራሻ: {EMPLOYEE_ADDRESS}

ውል ሰጪ ውል ተቀባይ በመባል ስማችንና አድራሻችን ከላይ የተጠቀስነው ተዋዋይ ወገኖች ወደንና ፈቅደን ይህንን የስራ ቅጥር ውል ፈጽመናል፡፡

እኔ ውል ሰጪ አቶ/ወ/ሮ {EMPLOYER_NAME} የ {COMPANY_NAME} ስሆን ለ {WORK_TYPE} ስራ ውል ተቀባይ ባላቸው ሙያ እና ማሽን እንዲሰሩ በኮንትራት ከ {CONTRACT_START_DATE} ቀን ጀምሮ እስከ {CONTRACT_END_DATE} ቀን ድረስ የቀጠርኳቸው ሲሆን ለአሁኑ ቀብድ ብር {DOWN_PAYMENT_AMOUNT} ({DOWN_PAYMENT_WORDS}) የከፍለኳቸው መሆኑን መክፈሌን በፊርማዬ አረጋግጣለሁ፡፡

እኔም ውል ተቀባይ ከዚህ በላይ በተጠቀሰው መሰረት ውል ሰጪ ለ {WORK_TYPE} ስራ በኮንትራት ከ {CONTRACT_START_DATE} ቀን ጀምሮ እስከ {CONTRACT_END_DATE} ቀን ድረስ የተቀጠርኩኝ ሲሆን ለዚሁም አገልግሎቴ ውል ሰጪ በ {PAYMENT_CONDITION} ብር {CONTRACT_AMOUNT} ({CONTRACT_AMOUNT_WORDS}) ኮንትራት ሥራ የተስማማንበትን ብር {CONTRACT_AMOUNT} ({CONTRACT_AMOUNT_WORDS}) የከፈሉኝ መሆኑን በፊርማዬ አረጋግጣለሁ።

እንዲሁም ውል ሰጪም ሆነ ውል ተቀባይ ውሉን ለማቋረጥ ሚፈልግ ወገን ቢኖር ውሉ ከመቋረጡ አንድ ወር በፊት በጽሁፍ ደብዳቤ ማሳወቅ አለበት፡፡

ይህንን የቅጥር ስምምነት ውል ከሁለት አንዳችን ወገን ለማፍረስ ብንሞክር በፍ/ብ/ሕ/ቁ 1889/1890 መሰረት ውል ለፈረሰበት ወገን ብር {PENALTY_AMOUNT} ({PENALTY_AMOUNT_WORDS}) ከፍሎ ውል እና ገደቡ በፍ/ብ/ሕ/ቁ 1731/2005 መሰረት በህግ ፊት የጸና ነው አይፈርስም፡፡

የውል ሰጪ ፊርማ						የውል ተቀባይ ፊርማ
________________________						________________________

ምስክሮች:
1. {WITNESS1_NAME} 
   አድራሻ: {WITNESS1_ADDRESS}
   ፊርማ: ________________________

2. {WITNESS2_NAME}
   አድራሻ: {WITNESS2_ADDRESS}
   ፊርማ: ________________________

የፊርማ ቀን: {SIGN_DATE}
`,
    variables: [
      { key: "AGREEMENT_DATE", label: "የውል ቀን", type: "text", required: true },
      { key: "EMPLOYER_NAME", label: "ውል ሰጪ ሙሉ ስም", type: "text", required: true },
      { key: "EMPLOYER_ROLE", label: "የውል ሰጪ የስራ ድርሻ", type: "text", required: true },
      { key: "EMPLOYER_NATIONALITY", label: "ውል ሰጪ ዜግነት", type: "text", required: true },
      { key: "EMPLOYER_ADDRESS", label: "ውል ሰጪ አድራሻ", type: "text", required: true },
      { key: "EMPLOYEE_NAME", label: "ውል ተቀባይ ሙሉ ስም", type: "text", required: true },
      { key: "EMPLOYEE_NATIONALITY", label: "ውል ተቀባይ ዜግነት", type: "text", required: true },
      { key: "EMPLOYEE_ADDRESS", label: "ውል ተቀባይ አድራሻ", type: "text", required: true },
      { key: "COMPANY_NAME", label: "የድርጅት ስም", type: "text", required: true },
      { key: "WORK_TYPE", label: "የስራ አይነት", type: "text", required: true },
      { key: "CONTRACT_START_DATE", label: "የኮንትራት መጀመሪያ ቀን", type: "date", required: true },
      { key: "CONTRACT_END_DATE", label: "የኮንትራት መጨረሻ ቀን", type: "date", required: true },
      { key: "DOWN_PAYMENT_AMOUNT", label: "ቀብድ ክፍያ መጠን (ብር)", type: "number", required: true },
      { key: "DOWN_PAYMENT_WORDS", label: "ቀብድ ክፍያ (በፊደል)", type: "text", required: true },
      { key: "PAYMENT_CONDITION", label: "የክፍያ ሁኔታ", type: "text", required: true, placeholder: "ለምሳሌ: በሰዓት, በወር, በሥራ" },
      { key: "CONTRACT_AMOUNT", label: "የኮንትራት ጠቅላላ መጠን (ብር)", type: "number", required: true },
      { key: "CONTRACT_AMOUNT_WORDS", label: "የኮንትራት ጠቅላላ መጠን (በፊደል)", type: "text", required: true },
      { key: "PENALTY_AMOUNT", label: "የውል ማፍረሻ መጠን (ብር)", type: "number", required: true },
      { key: "PENALTY_AMOUNT_WORDS", label: "የውል ማፍረሻ መጠን (በፊደል)", type: "text", required: true },
      { key: "WITNESS1_NAME", label: "ምስክር 1 ስም", type: "text", required: true },
      { key: "WITNESS1_ADDRESS", label: "ምስክር 1 አድራሻ", type: "text", required: true },
      { key: "WITNESS2_NAME", label: "ምስክር 2 ስም", type: "text", required: true },
      { key: "WITNESS2_ADDRESS", label: "ምስክር 2 አድራሻ", type: "text", required: true },
      { key: "SIGN_DATE", label: "ፊርማ ቀን", type: "date", required: true },
    ],
  },
];
