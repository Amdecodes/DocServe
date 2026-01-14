#!/bin/bash

# APP ROUTES (i18n)
mkdir -p app/[locale]/{services,form/[service]/review,checkout,payment/{success,failed},admin/orders/[id]}

# API ROUTES
mkdir -p app/api/{orders,payment/chapa,pdf,upload}

# COMPONENTS
mkdir -p components/{layout,landing,form,admin,ui}

# CORE DIRECTORIES
mkdir -p lib messages prisma config types validators public/{icons,previews,uploads}

# ROOT APP FILES
touch app/layout.tsx
touch app/globals.css
touch app/not-found.tsx

# LOCALE FILES
touch app/[locale]/layout.tsx
touch app/[locale]/page.tsx

# SERVICE PAGES
touch app/[locale]/services/page.tsx
touch app/[locale]/form/[service]/page.tsx
touch app/[locale]/form/[service]/review/page.tsx

# PAYMENT PAGES
touch app/[locale]/checkout/page.tsx
touch app/[locale]/payment/success/page.tsx
touch app/[locale]/payment/failed/page.tsx

# ADMIN
touch app/[locale]/admin/layout.tsx
touch app/[locale]/admin/page.tsx
touch app/[locale]/admin/orders/page.tsx
touch app/[locale]/admin/orders/[id]/page.tsx

# API ROUTES
touch app/api/orders/route.ts
touch app/api/payment/chapa/route.ts
touch app/api/pdf/route.ts
touch app/api/upload/route.ts

# COMPONENT FILES
touch components/layout/{Header.tsx,Footer.tsx,LanguageSwitcher.tsx}
touch components/landing/{Hero.tsx,HowItWorks.tsx,Services.tsx,WhyChooseUs.tsx,Preview.tsx,PaymentTrust.tsx,CTA.tsx}
touch components/form/{StepOne.tsx,StepTwo.tsx,Review.tsx}
touch components/admin/{OrdersTable.tsx,OrderStatus.tsx,ServiceManager.tsx}
touch components/ui/{Button.tsx,Input.tsx,Select.tsx,Card.tsx,Modal.tsx,Badge.tsx}

# LIB FILES
touch lib/{db.ts,prisma.ts,payment.ts,pdf.ts,upload.ts,auth.ts,utils.ts}

# CONFIG & DATA
touch config/i18n.ts
touch prisma/schema.prisma
touch types/{order.ts,service.ts}
touch validators/{order.schema.ts,form.schema.ts}

# i18n MESSAGES
touch messages/en.json
touch messages/am.json

# PUBLIC ASSETS
touch public/logo.svg

echo "✅ Paperless project structure created successfully."
