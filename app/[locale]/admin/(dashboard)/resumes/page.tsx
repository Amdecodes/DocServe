import { getOrders } from "@/actions/admin";
import ResumeMonitor from "@/components/admin/ResumeMonitor";

// Revalidate every 60 seconds or force dynamic to see latest
export const dynamic = "force-dynamic";

export default async function ResumesPage() {
  const orders = await getOrders();

  return <ResumeMonitor orders={orders} />;
}
