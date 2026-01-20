#!/usr/bin/env bash
set -e

BASE_URL="http://localhost:3000"

echo "🚀 Starting Payment Gate Test..."

# 1️⃣ Create Order
echo "➡️ Creating order..."
ORDER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/orders" \
  -H "Content-Type: application/json" \
  -d '{"service_type":"cv-writing"}')

ORDER_ID=$(echo "$ORDER_RESPONSE" | jq -r '.orderId')

if [[ "$ORDER_ID" == "null" || -z "$ORDER_ID" ]]; then
  echo "❌ Order creation failed"
  exit 1
fi

echo "✅ Order created: $ORDER_ID"

# 2️⃣ Try downloading PDF before payment
echo "➡️ Testing PDF access before payment..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  "$BASE_URL/api/pdf/download?orderId=$ORDER_ID")

if [[ "$HTTP_CODE" != "403" ]]; then
  echo "❌ PDF accessible before payment (HTTP $HTTP_CODE)"
  exit 1
fi

echo "✅ PDF correctly blocked before payment"

# 3️⃣ Initialize payment
echo "➡️ Initializing payment..."
PAYMENT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/payment/chapa/init" \
  -H "Content-Type: application/json" \
  -d "{\"orderId\":\"$ORDER_ID\"}")

CHECKOUT_URL=$(echo "$PAYMENT_RESPONSE" | jq -r '.checkout_url')

if [[ "$CHECKOUT_URL" == "null" || -z "$CHECKOUT_URL" ]]; then
  echo "❌ Payment initialization failed"
  exit 1
fi

echo "🧾 Checkout URL:"
echo "$CHECKOUT_URL"

echo ""
echo "⚠️ MANUAL STEP REQUIRED"
echo "👉 Open the checkout URL above and complete payment"
read -p "Press ENTER after payment is completed..."

# 4️⃣ Verify payment
echo "➡️ Verifying payment..."
VERIFY_RESPONSE=$(curl -s "$BASE_URL/api/payment/verify-json?orderId=$ORDER_ID")


STATUS=$(echo "$VERIFY_RESPONSE" | jq -r '.status')

if [[ "$STATUS" != "PAID" ]]; then
  echo "❌ Payment not verified. Status: $STATUS"
  exit 1
fi

echo "✅ Payment verified"

# 5️⃣ Download PDF after payment
echo "➡️ Downloading PDF after payment..."
curl -s -o cv-test.pdf \
  "$BASE_URL/api/pdf/download?orderId=$ORDER_ID"

if [[ ! -f "cv-test.pdf" ]]; then
  echo "❌ PDF not downloaded"
  exit 1
fi

echo "🎉 SUCCESS: PDF downloaded as cv-test.pdf"
echo "✅ Payment gate fully validated"
