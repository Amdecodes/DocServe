# UUID Order System - Quick Reference

## 🎯 Core Principle

**`order.id` is the payment reference. Never change it. Never reuse it.**

## 📋 Quick Commands

### Create Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"service_type":"cv"}'
```

### Check Database
```bash
psql -U amde -d local -c "SELECT * FROM \"Order\" ORDER BY created_at DESC LIMIT 5;"
```

### Regenerate Prisma Client
```bash
pnpm prisma generate
```

### Push Schema Changes
```bash
pnpm prisma db push
```

## 🔑 Key Rules

1. ✅ Server generates UUID (never frontend)
2. ✅ `order.id` = `tx_ref` (always)
3. ✅ New payment = new order
4. ✅ UUID is immutable
5. ✅ Status: DRAFT → PENDING → PAID/FAILED

## 📊 Order Status Flow

```
DRAFT    → Order created, no payment yet
PENDING  → Payment initiated with Chapa
PAID     → Payment successful
FAILED   → Payment failed
```

## 🔧 Common Operations

### Create Order (API)
```typescript
const { orderId, tx_ref } = await fetch('/api/orders', {
  method: 'POST',
  body: JSON.stringify({ service_type: 'cv' }),
}).then(r => r.json());
```

### Update Status
```typescript
await prisma.order.update({
  where: { id: orderId },
  data: { status: "PENDING" },
});
```

### Find Order
```typescript
const order = await prisma.order.findUnique({
  where: { id: orderId },
});
```

## ⚠️ Never Do This

❌ Reuse an order ID for a new payment  
❌ Change `order.id` after creation  
❌ Generate UUIDs on frontend  
❌ Set `tx_ref` to anything other than `order.id`  
❌ Skip creating a new order for payment retries

## ✅ Always Do This

✅ Create new order for each payment attempt  
✅ Validate `service_type` on server  
✅ Use `order.id` as Chapa's `tx_ref`  
✅ Update order status through payment flow  
✅ Store order ID in localStorage for frontend

## 📁 File Locations

- **Schema**: `prisma/schema.prisma`
- **API Route**: `app/api/orders/route.ts`
- **Prisma Client**: `lib/prisma.ts`
- **Full Docs**: `docs/uuid-order-system.md`

## 🐛 Troubleshooting

**TypeScript errors about missing fields?**
```bash
pnpm prisma generate
```

**Database schema mismatch?**
```bash
pnpm prisma db push
```

**UUIDs not matching?**
- Check that `pnpm prisma generate` completed
- Verify the two-step create/update logic in `/api/orders`

## 📞 Next Steps

After UUID Order system is working:

1. Implement `POST /api/payment/chapa/init`
2. Implement `POST /api/payment/chapa/webhook`
3. Add PDF generation after successful payment
