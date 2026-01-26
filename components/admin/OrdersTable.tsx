"use client";

import { useState } from "react";
import { updatePrintOrderStatus } from "@/actions/admin";
import { PrintOrderStatus } from "@prisma/client";
import { format } from "date-fns";
import { Search, MapPin, Phone, Loader2, Eye, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";

interface PrintOrder {
  id: string;
  product_name: string;
  variation_name?: string | null;
  full_name: string;
  phone: string;
  location: string;
  quantity: number;
  status: PrintOrderStatus;
  created_at: Date;
  notes: string | null;
  email: string | null;
}

interface OrdersTableProps {
  orders: PrintOrder[];
}

export default function OrdersTable({ orders }: OrdersTableProps) {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<PrintOrder | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;
    const matchesSearch =
      order.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone?.includes(searchTerm) ||
      order.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (id: string, newStatus: PrintOrderStatus) => {
    setUpdatingId(id);
    await updatePrintOrderStatus(id, newStatus);
    setUpdatingId(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    contacted: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="space-y-4">
      {/* Filters & Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <select
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-teal-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {order.product_name}
                      </div>
                      {order.variation_name && (
                        <div className="text-xs text-gray-500">
                          {order.variation_name}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 mt-0.5">
                        Qty: {order.quantity}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {order.full_name}
                      </div>
                      <div
                        className="text-xs text-gray-500 flex items-center gap-1 cursor-pointer hover:text-teal-600"
                        onClick={() => copyToClipboard(order.phone)}
                        title="Click to copy"
                      >
                        <Phone className="w-3 h-3" /> {order.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {order.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        {updatingId === order.id && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                            <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                          </div>
                        )}
                        <select
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer appearance-none pr-6 w-28 focus:ring-0",
                            statusColors[order.status] ||
                              "bg-gray-100 text-gray-800",
                          )}
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value as PrintOrderStatus)
                          }
                          disabled={updatingId === order.id}
                        >
                          <option value="pending">Pending</option>
                          <option value="contacted">Contacted</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500 whitespace-nowrap">
                      {format(new Date(order.created_at), "MMM d, HH:mm")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    No orders found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order Details #${selectedOrder?.id.slice(0, 8)}`}
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 font-medium uppercase">
                  Customer
                </label>
                <div className="font-semibold text-gray-900">
                  {selectedOrder.full_name}
                </div>
                <div className="text-sm text-gray-600">
                  {selectedOrder.phone}
                </div>
                {selectedOrder.email && (
                  <div className="text-sm text-gray-600">
                    {selectedOrder.email}
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium uppercase">
                  Product
                </label>
                <div className="font-semibold text-gray-900">
                  {selectedOrder.product_name}
                </div>
                {selectedOrder.variation_name && (
                  <div className="text-sm text-gray-600">
                    {selectedOrder.variation_name}
                  </div>
                )}
                <div className="text-sm text-gray-600">
                  Qty: {selectedOrder.quantity}
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 font-medium uppercase">
                Delivery Location
              </label>
              <div className="text-sm text-gray-900 border p-2 rounded-lg bg-gray-50 mt-1">
                {selectedOrder.location}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 font-medium uppercase">
                Notes
              </label>
              <div className="text-sm text-gray-900 border p-2 rounded-lg bg-gray-50 mt-1 min-h-15">
                {selectedOrder.notes || "No notes provided."}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
