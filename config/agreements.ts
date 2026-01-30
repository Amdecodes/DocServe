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
    price: 150,
    language: "am",
    version: "v1",
    category: "Vehicle",
    content: `{AGREEMENT_DATE} የመኪና ሽያጭ ውል ስምምነት

ሻጭ ----------- {SELLER_FULL_NAME} 
  /ዜግነት {SELLER_NATIONALITY}/ {SELLER_REPRESENTATION} {SELLER_AGENT_NAME} የውክልና ስልጣን ቁጥር {SELLER_PO_NUMBER} በቀን {SELLER_PO_DATE} አድራሻ {SELLER_ADDRESS}
ገዢ ----------- {BUYER_FULL_NAME} /ዜግነት {BUYER_NATIONALITY}/ {BUYER_REPRESENTATION} {BUYER_AGENT_NAME} የውክልና ስልጣን ቁጥር {BUYER_PO_NUMBER} በቀን {BUYER_PO_DATE} አድራሻ {BUYER_ADDRESS}

እኔ ሻጭ {SELLER_REPRESENTATION} {REPRESENTED_NAME} ስም ተመዝግቦ የሚገኘውን የሰሌዳ ቁጥር {VEHICLE_PLATE}፣ የተሸከርካሪው ዓይነት {VEHICLE_TYPE}፣ የተሠራበት አገር {VEHICLE_COUNTRY}፣ የሻንሲ ቁጥር {VEHICLE_CHASSIS}፣ የሞተር ቁጥር {VEHICLE_ENGINE} የሆነውን ተሸከርካሪ ለገዢ በዛሬው ዕለት በብር {SALE_PRICE} ({SALE_PRICE_WORDS}) የሸጥኩላቸው ሲሆን የገንዘብ አከፋፈል በተመለከተ በዚህ ውል ደረሰኝነት አማካኝነት ሙሉ ክፍያ ብር {SALE_PRICE} ተቀብዬ ተሸከርካሪውን እና ኦርጅናል ማስረጃዎችን አስረክቤ ተስማምቼ መሸጤን በፊርማዬ አረጋግጣለሁ፡፡

ይህ ተሸከርካሪ ከመሸጡ በፊት የነበረ ዕዳ ዕገዳ ቢኖር ተከራክሬ ለመመለስ እና ማንኛውም የመንግስት ዕዳ ካለ እኔ ሻጭ የምከፍል መሆኑን አረጋግጣለሁ:: ገዢም ተሸከርካሪውን በተገለጸው ሁኔታ ተረክበው መግዛታቸውን በፊርማቸው ያረጋግጣሉ::

እኛ ምስክሮች ሁለቱ ወገኖች ተስማምተው ሲሸጡና ሲገዙ አይተናል፡፡
1. የምስክር ስም {WITNESS1_NAME}  አድራሻ፡- {WITNESS1_ADDRESS}
2. የምስክር ስም {WITNESS2_NAME} አድራሻ፡- {WITNESS2_ADDRESS}

          የሻጭ ፊርማ ________________              የገዢ ፊርማ ________________

          የምስክሮች ፊርማ
1. ________________

2. ________________

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
        label: "ውክልና (በራሴ/በወኪል)",
        type: "text",
        required: true,
        placeholder: "በራሴ ወይም በወኪል",
      },
      {
        key: "SELLER_AGENT_NAME",
        label: "የወኪል ስም (ካለ)",
        type: "text",
        required: false,
      },
      {
        key: "SELLER_PO_NUMBER",
        label: "የውክልና ሰነድ ቁጥር",
        type: "text",
        required: false,
      },
      {
        key: "SELLER_PO_DATE",
        label: "የውክልና የተሰጠበት ቀን",
        type: "text",
        required: false,
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
        label: "ውክልና (በራሴ/በወኪል)",
        type: "text",
        required: true,
        placeholder: "በራሴ ወይም በወኪል",
      },
      {
        key: "BUYER_AGENT_NAME",
        label: "የወኪል ስም (ካለ)",
        type: "text",
        required: false,
      },
      {
        key: "BUYER_PO_NUMBER",
        label: "የውክልና ሰነድ ቁጥር",
        type: "text",
        required: false,
      },
      {
        key: "BUYER_PO_DATE",
        label: "የውክልና የተሰጠበት ቀን",
        type: "text",
        required: false,
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
      { key: "SIGN_DATE", label: "ፊርማ ቀን", type: "date", required: true },
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
    content: `{AGREEMENT_DATE} የመኪና ኪራይ ውል ስምምነት

አከራይ ----------- {LANDLORD_FULL_NAME} /ዜግነት {LANDLORD_NATIONALITY}/ {LANDLORD_REPRESENTATION} {LANDLORD_AGENT_NAME} የውክልና ስልጣን ቁጥር {LANDLORD_PO_NUMBER} በቀን {LANDLORD_PO_DATE} አድራሻ {LANDLORD_ADDRESS}
ተከራይ ----------- {TENANT_FULL_NAME} /ዜግነት {TENANT_NATIONALITY}/ አድራሻ {TENANT_ADDRESS}

እኔ አከራይ {LANDLORD_REPRESENTATION} {REPRESENTED_NAME} ስም ተመዝግቦ የሚገኘውን የሰሌዳ ቁጥር {VEHICLE_PLATE}፣ የተሸከርካሪው ዓይነት {VEHICLE_TYPE}፣ የተሠራበት አገር {VEHICLE_COUNTRY}፣ የሻንሲ ቁጥር {VEHICLE_CHASSIS} የሆነውን ለተከራይ ለ{VEHICLE_PURPOSE} እንዲጠቀሙበት ከዛሬ {RENT_START_DATE} ጀምሮ እስከ {RENT_END_DATE} ድረስ ለ{RENT_DURATION} ጊዜ በወር ብር {MONTHLY_RENT} ያከራየኋቸው ሲሆን የገንዘቡም አከፋፈል በተመለከተ የ{ADVANCE_PAYMENT_MONTHS} ወር ቅድሚያ ክፍያ ብር {ADVANCE_PAYMENT_AMOUNT} ተቀብያለሁ:: ቀጣዩንም በየወሩ ቅድሚያ ሊከፍሉኝ ተስማምተናል::

ተከራይ የተከራዩትን ተሸከርካሪ በሚገባ ተጠንቅቀው እንዲሰሩበት: የውል ጊዜ ሲጠናቀቅ ብንስማማ ውሉን አድሰን ልንቀጥል ካልተስማማን ግን ተከራይ ተሸከርካሪውን በተረከቡት ዓይነት ሊያስረክቡኝ ተስማምተናል:: ተከራይ ከተረከቡበት ጊዜ ጀምሮ የሚፈጠር ማንኛውም የትራፊክ ክስ: ህገወጥ ጭነት ወይም በንብረትና በሰው ላይ ለሚደርሰው ችግር ኃላፊነቱ የተከራይ ይሆናል:: በተጨማሪም አከራይም ሆነ ተከራይ ውል ለማቋረጥ ቢፈልጉ የ{TERMINATION_NOTICE_PERIOD} ቀናት ቅድመ ማስጠንቀቂያ በመስጠት ውሉ ሊቋረጥ ይችላል::

ይህም ውል በፍ/ብ/ሕ/ቁ 1731/2005 በሚያዘው መሠረት በሕግ ፊት የፀና ነው፡፡ ይህንን ውል እንደውሉ የማይፈፅም ወገን ቢኖር ውሉን ላከበረ ወገን ብር {PENALTY_AMOUNT} ለመንግስት ብር {GOVT_PENALTY_AMOUNT} ከፍሎ ውሉና ገደቡ በፍ/ብ/ሕ/ቁ 1889/1890 በሚያዘው መሠረት በህግ ፊት የፀና ይሆናል፡፡ ውሉም አይፈርስም ስንል ተስማምተን ተዋውለናል፡፡

የአከራይ ፊርማ: __________  የተከራይ ፊርማ: __________
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
        label: "ውክልና (በራሴ/በወኪል)",
        type: "text",
        required: true,
        placeholder: "በራሴ ወይም በወኪል",
      },
      {
        key: "LANDLORD_AGENT_NAME",
        label: "የወኪል ስም (ካለ)",
        type: "text",
        required: false,
      },
      {
        key: "LANDLORD_PO_NUMBER",
        label: "የውክልና ሰነድ ቁጥር",
        type: "text",
        required: false,
      },
      {
        key: "LANDLORD_PO_DATE",
        label: "የውክልና የተሰጠበት ቀን",
        type: "text",
        required: false,
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
        type: "date",
        required: true,
      },
      {
        key: "RENT_END_DATE",
        label: "የኪራይ ማብቂያ ቀን",
        type: "date",
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
      { key: "SIGN_DATE", label: "ፊርማ ቀን", type: "date", required: true },
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
    content: `{AGREEMENT_DATE} የቤት ሽያጭ ውል ስምምነት

ሻጭ ----------- {SELLER_FULL_NAME} /ዜግነት {SELLER_NATIONALITY}/ {SELLER_REPRESENTATION} {SELLER_AGENT_NAME} የውክልና ስልጣን ቁጥር {SELLER_PO_NUMBER} በቀን {SELLER_PO_DATE} አድራሻ፡- {SELLER_ADDRESS}

ገዢ ----------- {BUYER_FULL_NAME} /ዜግነት {BUYER_NATIONALITY}/ {BUYER_REPRESENTATION} {BUYER_AGENT_NAME} የውክልና ስልጣን ቁጥር {BUYER_PO_NUMBER} በቀን {BUYER_PO_DATE} አድራሻ፡- {BUYER_ADDRESS}

እኔ ሻጭ በስም ተመዝግቦ የሚገኘውን በአዲስ አበባ ከተማ አስተዳደር {PROPERTY_SUBCITY} ክ/ከተማ ወረዳ {PROPERTY_WOREDA} የቤት ቁጥር {PROPERTY_HOUSE_NUMBER} የካርታ ቁጥር {PROPERTY_MAP_NUMBER} የቦታው ስፋት {PROPERTY_LAND_AREA} ካሬ ሜትር የተሰጠበት ቀን {PROPERTY_DATE} የቤቱ አገልግሎት ለመኖሪያ የሆነውን መኖሪያ ቤት ለገዢ በዛሬው ዕለት በብር {SALE_PRICE} ({SALE_PRICE_WORDS}) የሸጥኩላቸው ሲሆን የገንዘብ አከፋፈል በተመለከተ በዚህ ውል ደረሰኝነት አማካኝነት ሙሉ ክፍያ ብር {SALE_PRICE} ({SALE_PRICE_WORDS}) ተቀብዬ መኖሪያ ቤቱን እና ቤቱን የሚመለከቱ ኦርጅናል ማስረጃዎችን ካርታ ጭምር አስረክቤ ተስማምቼ መሸጤን በፊርማዬ አረጋግጣለሁ፡፡

ይህንን የመኖሪያ ቤት ግዢ ከመረከባቸው በፊት በዕዳ ዕገዳ ይዠየዋለሁ አይሸጥም የሚል ተከራካሪ ወገን በመንግስትም ሆነ ከግለሰብ በኩል ቢቀርብ ተከራክሬ ለመመለስ የውል ግዴታ ገብቼ የሸጥኩላቸው መሆኑን በፊርማዬ አረጋግጣለሁ፡፡

እኔም ገዢ ከዚህ በላይ በተገለጸው የውል ቃል መሰረት ተስማምቼ በ{SELLER_FULL_NAME} ስም ተመዝግቦ የሚገኘውን በአዲስ አበባ ከተማ አስተዳደር {PROPERTY_SUBCITY} ክ/ከተማ ወረዳ {PROPERTY_WOREDA} የቤት ቁጥር {PROPERTY_HOUSE_NUMBER} የካርታ ቁጥር {PROPERTY_MAP_NUMBER} የቦታው ስፋት {PROPERTY_LAND_AREA} ካሬ ሜትር የተሰጠበት ቀን {PROPERTY_DATE} በዛሬው እለት ከሻጭ ላይ በብር {SALE_PRICE} ({SALE_PRICE_WORDS}) የገዛሁ ሲሆን የገንዘቡም አከፋፈል በተመለከተ በዚህ ውል ደረሰኝነት አማካኝ ሙሉ በሙሉ ክፍያ ብር {SALE_PRICE} ({SALE_PRICE_WORDS}) ከፍዬ የመኖሪያ ቤቱን እና ቤቱን የሚመለከቱ ኦርጅናል ዶክሚንቶችን ካርታ ተረክቤ ተስማምቼ መግዛቴን በፊርማዬ አረጋግጣለሁ፡፡

የስም ማዞሪያ አሹራን በተመለከተ መንግስት የሚጠይቀውን ክፍያ እኔ ገዢ ልከፍል ተስማምቻለሁ፡፡

እኛ ምስክሮች ሁለቱ ወገኖች ተስማምተው ሲሸጡና ሲገዙ አይተናል፡፡
1. የምስክር ስም {WITNESS1_NAME} /ዜግነት {WITNESS1_NATIONALITY}/ አድራሻ፡- {WITNESS1_ADDRESS}
2. የምስክር ስም {WITNESS2_NAME} /ዜግነት {WITNESS2_NATIONALITY}/ አድራሻ፡- {WITNESS2_ADDRESS}

የሻጭ ፊርማ ________________
የገዢ ፊርማ ________________
የምስክሮች ፊርማ
1. ________________
2. ________________`,
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
        label: "ውክልና (በራሴ/በወኪል)",
        type: "text",
        required: true,
        placeholder: "በራሴ ወይም በወኪል",
      },
      {
        key: "SELLER_AGENT_NAME",
        label: "የወኪል ስም (ካለ)",
        type: "text",
        required: false,
      },
      {
        key: "SELLER_PO_NUMBER",
        label: "የውክልና ሰነድ ቁጥር",
        type: "text",
        required: false,
      },
      {
        key: "SELLER_PO_DATE",
        label: "የውክልና የተሰጠበት ቀን",
        type: "text",
        required: false,
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
        label: "ውክልና (በራሴ/በወኪል)",
        type: "text",
        required: true,
        placeholder: "በራሴ ወይም በወኪል",
      },
      {
        key: "BUYER_AGENT_NAME",
        label: "የወኪል ስም (ካለ)",
        type: "text",
        required: false,
      },
      {
        key: "BUYER_PO_NUMBER",
        label: "የውክልና ሰነድ ቁጥር",
        type: "text",
        required: false,
      },
      {
        key: "BUYER_PO_DATE",
        label: "የውክልና የተሰጠበት ቀን",
        type: "text",
        required: false,
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
        key: "WITNESS1_NATIONALITY",
        label: "ምስክር 1 ዜግነት",
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
        key: "WITNESS2_NATIONALITY",
        label: "ምስክር 2 ዜግነት",
        type: "text",
        required: true,
      },
      {
        key: "WITNESS2_ADDRESS",
        label: "ምስክር 2 አድራሻ",
        type: "text",
        required: true,
      },
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
    content: `{AGREEMENT_DATE} የቤት ኪራይ ውል ስምምነት

አከራይ ----------- {LANDLORD_FULL_NAME} /ዜግነት {LANDLORD_NATIONALITY}/ {LANDLORD_REPRESENTATION} {LANDLORD_AGENT_NAME} የውክልና ስልጣን ቁጥር {LANDLORD_PO_NUMBER} በቀን {LANDLORD_PO_DATE} አድራሻ {LANDLORD_ADDRESS}
ተከራይ ----------- {TENANT_FULL_NAME} /ዜግነት {TENANT_NATIONALITY}/ አድራሻ {TENANT_ADDRESS}

እኔ አከራይ {LANDLORD_REPRESENTATION} {REPRESENTED_NAME} ስም ተመዝግቦ የሚገኘውን በአዲስ አበባ ከተማ አስተዳደር {PROPERTY_SUBCITY} ክፍለ ከተማ ወረዳ {PROPERTY_WOREDA} የካርታ ቁጥር {PROPERTY_MAP_NO} ካርታው የተሰጠበት ቀን {PROPERTY_MAP_DATE} የቦታው ስፋት {PROPERTY_AREA} ካሬ ሜትር ፓርሴል ቁጥር {PROPERTY_PARCEL} አገልግሎቱ {PROPERTY_USAGE} የሆነውን መለያ {PROPERTY_LABEL} የተለየውን ቤት ተከራይ ለ{PROPERTY_PURPOSE} አገልግሎት እንዲጠቀሙበት ከዛሬ {RENT_START_DATE} ጀምሮ እስከ {RENT_END_DATE} ድረስ ለ{RENT_DURATION} ጊዜ በወር ብር {MONTHLY_RENT} ያከራየኋቸው ሲሆን የገንዘቡም አከፋፈል በተመለከተ የ{ADVANCE_PAYMENT_MONTHS} ወር ቅድሚያ ክፍያ ብር {ADVANCE_PAYMENT_AMOUNT} ተቀብያለሁ:: ቀጣዩንም በየወሩ ቅድሚያ ሊከፍሉኝ ተስማምተናል::

ሆኖም የዚህ ቤት የመብራት፣ የውሃ እና ሌሎችንም {UTILITIES_RESPONSIBILITY} በተመለከተ ተከራይ ቤቱን ከተረከቡበት ቀን ጀምሮ ያለውን እስከ ውል ፍፃሜ ጊዜ የሚፈለግበትን የፍጆታ ክፍያ በቢሉ መሰረት ለመክፈል የውል ግዴታ ገብተዋል:: ተከራይ ቤቱን ለቀው ሲሄዱ አስቀድሞ በነበረበት ሁኔታ አስተካክለው እንዲያስረክቡ ሁለታችንም ወገኖች ተስማምተናል:: በተጨማሪም አከራይም ሆነ ተከራይ ውል ለማቋረጥ ቢፈልጉ የ{TERMINATION_NOTICE_PERIOD} ቀናት ቅድመ ማስጠንቀቂያ በመስጠት ውሉ ሊቋረጥ ይችላል:: ተከራይ የተከራዩትን ቤት ለሌላ ሶስተኛ ወገን ማስተላለፍ ወይም ማከራየት አይችሉም::

ይህም ውል በፍ/ብ/ሕ/ቁ 1731/2005 በሚያዘው መሠረት በሕግ ፊት የፀና ነው፡፡ ይህንን ውል እንደውሉ የማይፈፅም ወገን ቢኖር ውሉን ላከበረ ወገን ብር {PENALTY_AMOUNT} ለመንግስት ብር {GOVT_PENALTY_AMOUNT} ከፍሎ ውሉና ገደቡ በፍ/ብ/ሕ/ቁ 1889/1890 በሚያዘው መሠረት በህግ ፊት የፀና ይሆናል፡፡ ውሉም አይፈርስም ስንል ተስማምተን ተዋውለናል፡፡

                    የአከራይ ፊርማ: __________                  የተከራይ ፊርማ: __________
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
        label: "ውክልና (በራሴ/በወኪል)",
        type: "text",
        required: true,
        placeholder: "በራሴ ወይም በወኪል",
      },
      {
        key: "LANDLORD_AGENT_NAME",
        label: "የወኪል ስም (ካለ)",
        type: "text",
        required: false,
      },
      {
        key: "LANDLORD_PO_NUMBER",
        label: "የውክልና ሰነድ ቁጥር",
        type: "text",
        required: false,
      },
      {
        key: "LANDLORD_PO_DATE",
        label: "የውክልና የተሰጠበት ቀን",
        type: "text",
        required: false,
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
        type: "date",
        required: true,
      },
      {
        key: "RENT_END_DATE",
        label: "የኪራይ ማብቂያ ቀን",
        type: "date",
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
      { key: "SIGN_DATE", label: "ፊርማ ቀን", type: "date", required: true },
    ],
  },
];
