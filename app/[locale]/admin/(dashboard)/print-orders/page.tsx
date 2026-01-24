import { getPrintOrders } from "@/actions/admin";
import OrdersTable from "@/components/admin/OrdersTable";

// Disable caching for admin data
export const dynamic = "force-dynamic";

export default async function PrintOrdersPage() {
  const orders = await getPrintOrders();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div>
            <h1 className="text-2xl font-bold text-gray-900">Print Orders</h1>
            <p className="text-sm text-gray-500">Manage and track customer print orders.</p>
         </div>
      </div>

      <OrdersTable orders={orders} />
    </div>
  );
}
