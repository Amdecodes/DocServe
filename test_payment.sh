#!/bin/bash
echo "Creating Order..."
RESPONSE=$(curl -s -X POST http://localhost:3000/api/orders -H "Content-Type: application/json" -d '{"service_type":"premium_resume"}')
echo "Response: $RESPONSE"

# Extract Order ID using grep/sed simply (since we don't assume jq is installed)
ORDER_ID=$(echo $RESPONSE | grep -o '"orderId":"[^"]*"' | cut -d'"' -f4)
echo "Order ID: $ORDER_ID"

if [ -z "$ORDER_ID" ]; then
  echo "❌ Failed to get Order ID"
  exit 1
fi

echo "Initializing Payment for Order: $ORDER_ID"
INIT_RES=$(curl -s -X POST http://localhost:3000/api/payment/chapa/init -H "Content-Type: application/json" -d "{\"orderId\":\"$ORDER_ID\"}")
echo "Init Response: $INIT_RES"

if [[ $INIT_RES == *"checkout_url"* ]]; then
  echo "✅ Payment Initialization Successful!"
else
  echo "❌ Payment Initialization Failed!"
fi
