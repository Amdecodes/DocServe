import { getWebDevRequests } from "@/actions/admin";
import WebDevRequestsTable from "@/components/admin/WebDevRequestsTable";

export const dynamic = "force-dynamic";

export default async function WebDevAdminPage() {
  const requests = await getWebDevRequests();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Web Development Requests</h1>
        <p className="text-gray-500">
          Manage inquiries for custom website and software development.
        </p>
      </div>

      <WebDevRequestsTable requests={requests} />
    </div>
  );
}
