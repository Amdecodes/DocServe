"use client";

import { useState } from "react";
import { AdminOrder } from "@/actions/admin";
import { MinimalModal } from "./ui-minimal";
import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Check, X, AlertCircle } from "lucide-react";

export default function ResumeMonitor({ orders }: { orders: AdminOrder[] }) {
  const [filterPaid, setFilterPaid] = useState<"all" | "yes" | "no">("all");
  const [filterGen, setFilterGen] = useState<"all" | "yes" | "no">("all");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  const filteredOrders = orders.filter((order) => {
    const isPaid = order.status === "PAID";
    const isGenerated = order.ai_generated;

    if (filterPaid === "yes" && !isPaid) return false;
    if (filterPaid === "no" && isPaid) return false;
    if (filterGen === "yes" && !isGenerated) return false;
    if (filterGen === "no" && isGenerated) return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <Badge className="bg-green-500 hover:bg-green-600">PAID</Badge>;
      case "PENDING":
        return (
          <Badge
            variant="secondary"
            className="text-yellow-600 bg-yellow-100 hover:bg-yellow-200"
          >
            PENDING
          </Badge>
        );
      case "FAILED":
        return <Badge variant="destructive">FAILED</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resume Builder</h1>
          <p className="text-muted-foreground mt-1">
            Monitor payments, generation status, and order details.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center space-x-2 bg-white p-2 rounded-lg border shadow-sm">
            <span className="text-sm font-medium pl-2">Paid:</span>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={filterPaid === "all" ? "default" : "ghost"}
                onClick={() => setFilterPaid("all")}
                className="h-7 text-xs"
              >
                All
              </Button>
              <Button
                size="sm"
                variant={filterPaid === "yes" ? "default" : "ghost"}
                onClick={() => setFilterPaid("yes")}
                className={`h-7 text-xs ${filterPaid === "yes" ? "bg-green-600 hover:bg-green-700" : ""}`}
              >
                Yes
              </Button>
              <Button
                size="sm"
                variant={filterPaid === "no" ? "default" : "ghost"}
                onClick={() => setFilterPaid("no")}
                className={`h-7 text-xs ${filterPaid === "no" ? "bg-red-600 hover:bg-red-700" : ""}`}
              >
                No
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-white p-2 rounded-lg border shadow-sm">
            <span className="text-sm font-medium pl-2">Generated:</span>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={filterGen === "all" ? "default" : "ghost"}
                onClick={() => setFilterGen("all")}
                className="h-7 text-xs"
              >
                All
              </Button>
              <Button
                size="sm"
                variant={filterGen === "yes" ? "default" : "ghost"}
                onClick={() => setFilterGen("yes")}
                className={`h-7 text-xs ${filterGen === "yes" ? "bg-green-600 hover:bg-green-700" : ""}`}
              >
                Yes
              </Button>
              <Button
                size="sm"
                variant={filterGen === "no" ? "default" : "ghost"}
                onClick={() => setFilterGen("no")}
                className={`h-7 text-xs ${filterGen === "no" ? "bg-red-600 hover:bg-red-700" : ""}`}
              >
                No
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Card className="border-0 shadow-sm ring-1 ring-gray-950/5">
        <CardHeader className="px-6 py-4">
          <CardTitle className="text-lg">Recent Orders</CardTitle>
          <CardDescription>
            Viewing {filteredOrders.length} orders
          </CardDescription>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/50 text-gray-500 border-b border-gray-100">
              <tr>
                <th className="h-10 px-6 text-xs font-medium uppercase tracking-wider">
                  Order ID / Date
                </th>
                <th className="h-10 px-6 text-xs font-medium uppercase tracking-wider">
                  Customer
                </th>
                <th className="h-10 px-6 text-xs font-medium uppercase tracking-wider">
                  Status
                </th>
                <th className="h-10 px-6 text-xs font-medium uppercase tracking-wider">
                  Generation
                </th>
                <th className="h-10 px-6 text-xs font-medium uppercase tracking-wider">
                  References
                </th>
                <th className="h-10 px-6 text-right text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No orders matching the filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-col gap-1">
                        <span
                          className="font-mono text-xs text-gray-500 select-all"
                          title={order.id}
                        >
                          #{order.id.slice(0, 8)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {order.customer_name || "—"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Lang: {order.language}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 align-top">
                      {order.ai_generated ? (
                        <div className="flex items-center text-green-700 text-xs font-medium bg-green-50 px-2 py-1 rounded-md w-fit border border-green-100">
                          <Check className="w-3 h-3 mr-1.5" /> Generated
                        </div>
                      ) : (
                        <div className="flex items-center text-red-700 text-xs font-medium bg-red-50 px-2 py-1 rounded-md w-fit border border-red-100">
                          <X className="w-3 h-3 mr-1.5" /> Not Generated
                        </div>
                      )}
                      {order.ai_generated_at && (
                        <div className="text-[10px] text-muted-foreground mt-1.5 pl-1">
                          {new Date(order.ai_generated_at).toLocaleTimeString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-col gap-1.5">
                        {order.chapa_ref && (
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-gray-400 font-medium">
                              REF
                            </span>
                            <span className="font-mono bg-gray-50 px-1.5 py-0.5 rounded text-gray-600">
                              {order.chapa_ref.slice(0, 10)}...
                            </span>
                          </div>
                        )}
                        {order.pdf_url && (
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-gray-400 font-medium">
                              PDF
                            </span>
                            <a
                              href={order.pdf_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 hover:underline flex items-center font-medium"
                            >
                              Preview
                            </a>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.pdf_url && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-gray-900"
                            asChild
                          >
                            <a
                              href={order.pdf_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Download PDF"
                            >
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs font-normal"
                          onClick={() => setSelectedOrder(order)}
                        >
                          Details
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedOrder && (
        <MinimalModal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title="Order Details"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-gray-500 text-xs uppercase mb-1">
                  Status
                </span>
                {getStatusBadge(selectedOrder.status)}
              </div>
              <div>
                <span className="block text-gray-500 text-xs uppercase mb-1">
                  AI Status
                </span>
                {selectedOrder.ai_generated ? (
                  <span className="text-green-600 text-sm font-medium flex items-center">
                    <Check className="w-3 h-3 mr-1" /> Generated
                  </span>
                ) : (
                  <span className="text-red-500 text-sm font-medium flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" /> Pending/Failed
                  </span>
                )}
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-3">
              <div>
                <span className="block text-gray-500 text-xs uppercase mb-1">
                  Full Order ID
                </span>
                <span className="font-mono text-xs break-all selectable">
                  {selectedOrder.id}
                </span>
              </div>
              {selectedOrder.chapa_ref && (
                <div>
                  <span className="block text-gray-500 text-xs uppercase mb-1">
                    Chapa Reference
                  </span>
                  <span className="font-mono text-xs break-all">
                    {selectedOrder.chapa_ref}
                  </span>
                </div>
              )}
            </div>

            <div>
              <span className="block text-gray-500 text-xs uppercase mb-1">
                Customer info
              </span>
              <div className="text-sm bg-gray-50 p-2 rounded border border-gray-100">
                <div className="font-medium text-gray-900">
                  {selectedOrder.customer_name || "N/A"}
                </div>
                {selectedOrder.customer_phone && (
                  <div className="text-gray-600 text-xs flex items-center mt-1">
                    <span className="mr-1">📞</span>{" "}
                    {selectedOrder.customer_phone}
                  </div>
                )}
                {selectedOrder.customer_email && (
                  <div className="text-gray-600 text-xs flex items-center mt-1">
                    <span className="mr-1">✉️</span>{" "}
                    {selectedOrder.customer_email}
                  </div>
                )}
                <div className="text-gray-500 text-xs mt-2 pt-2 border-t border-gray-200">
                  Language: {selectedOrder.language}
                </div>
              </div>
            </div>

            <div>
              <span className="block text-gray-500 text-xs uppercase mb-1">
                Timestamps
              </span>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Created:</span>
                  <span>
                    {new Date(selectedOrder.created_at).toLocaleString()}
                  </span>
                </div>
                {selectedOrder.ai_generated_at && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Generated:</span>
                    <span>
                      {new Date(selectedOrder.ai_generated_at).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {selectedOrder.pdf_url && (
              <div className="pt-2">
                <Button className="w-full" asChild>
                  <a
                    href={selectedOrder.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText className="w-4 h-4 mr-2" /> View PDF
                  </a>
                </Button>
              </div>
            )}
          </div>
        </MinimalModal>
      )}
    </div>
  );
}
