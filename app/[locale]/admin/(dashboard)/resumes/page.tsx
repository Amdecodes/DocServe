import { getResumeOrders } from "@/actions/admin";
import ResumeMonitor from "@/components/admin/ResumeMonitor";

// Revalidate every 60 seconds or force dynamic to see latest
export const dynamic = "force-dynamic";

export default async function ResumesPage() {
  const orders = await getResumeOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Resume Orders</h1>
        <p className="text-sm text-gray-500">
          Track paid and generated resume orders.
        </p>
      </div>
      <ResumeMonitor orders={orders} />
    </div>
  );
}
