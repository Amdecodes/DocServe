import prisma from "@/lib/prisma";
import { Link } from "@/lib/navigation";
import { 
  Printer, 
  Headset, 
  FileText, 
  Clock, 
  AlertCircle,
  TrendingUp,
  ArrowRight
} from "lucide-react";

async function getStats() {
  try {
    const [
      totalPrintOrders, 
      pendingPrintOrders,
      pendingVA,
      resumesPaid
    ] = await Promise.all([
      prisma.printOrder.count(),
      prisma.printOrder.count({ where: { status: "pending" } }),
      prisma.virtualAssistanceRequest.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "PAID" } })
    ]);

    return { totalPrintOrders, pendingPrintOrders, pendingVA, resumesPaid };
  } catch (error: any) {
    console.error("Failed to fetch dashboard stats:", error);
    if (error.message?.includes("Can't reach database server")) {
      throw new Error("System Offline: Unable to connect to the database server.");
    }
    throw error;
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    {
      title: "Pending Print Orders",
      value: stats.pendingPrintOrders,
      icon: Printer,
      color: "bg-teal-500",
      href: "/admin/print-orders",
      subtext: `${stats.totalPrintOrders} total lifetime`
    },
    {
      title: "VA Requests (New)",
      value: stats.pendingVA,
      icon: Headset,
      color: "bg-blue-500",
      href: "/admin/virtual-assistance",
      subtext: "Waiting for contact"
    },
    {
      title: "Paid Resumes",
      value: stats.resumesPaid,
      icon: FileText,
      color: "bg-purple-500",
      href: "/admin/resumes",
      subtext: "Successful payments"
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back, Admin. Here is what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <Link 
            key={i} 
            href={card.href}
            className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <div className="mt-2 text-3xl font-bold text-gray-900">{card.value}</div>
              </div>
              <div className={`p-3 rounded-xl text-white ${card.color} shadow-sm group-hover:scale-110 transition-transform`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between text-xs">
               <span className="text-gray-400 font-medium">{card.subtext}</span>
               <div className="flex items-center text-teal-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity translate-x-3 group-hover:translate-x-0">
                  View <ArrowRight className="w-3 h-3 ml-1" />
               </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions / Recent Activity Section can go here */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-75 flex items-center justify-center text-gray-400">
           <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>System Alerts & Notifications (Empty)</p>
           </div>
         </div>
      </div>
    </div>
  );
}
