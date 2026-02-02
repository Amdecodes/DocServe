import { getProducts } from "@/actions/admin";
import ProductsTable from "@/components/admin/ProductsTable";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <p className="text-sm text-gray-500">
          Manage print products, prices, and availability.
        </p>
      </div>

      <ProductsTable products={products} />
    </div>
  );
}
