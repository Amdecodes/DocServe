import { getVARequests } from "@/actions/admin";
import VAMonitor from "@/components/admin/VAMonitor";

// Revalidate every 60 seconds or force dynamic
export const dynamic = "force-dynamic";

export default async function VirtualAssistancePage() {
  const requests = await getVARequests();

  return <VAMonitor requests={requests} />;
}
