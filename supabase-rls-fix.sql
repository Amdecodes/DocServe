-- Enable Row Level Security (RLS) on the new tables
ALTER TABLE "print_products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "print_product_variations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "print_orders" ENABLE ROW LEVEL SECURITY;

-- 1. Print Products Policies
-- Allow anyone to view active products
create policy "Enable read access for all users"
on "public"."print_products"
as PERMISSIVE
for SELECT
to public
using ( true );

-- 2. Print Product Variations Policies
-- Allow anyone to view variations
create policy "Enable read access for all users"
on "public"."print_product_variations"
as PERMISSIVE
for SELECT
to public
using ( true );

-- 3. Print Orders Policies
-- Allow anyone to create an order (Guest Checkout)
create policy "Enable insert for all users"
on "public"."print_orders"
as PERMISSIVE
for INSERT
to public
with check ( true );

-- Note: We do NOT add a SELECT policy for print_orders for public, 
-- ensuring customers can't scrape other people's orders. 
-- Admin access is handled by Prisma (Server Side) which bypasses RLS.
