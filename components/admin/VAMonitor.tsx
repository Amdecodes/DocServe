"use client";

import { useState } from "react";
import { updateVAStatus } from "@/actions/admin";
import { MinimalModal } from "./ui-minimal";
import {
  VirtualAssistanceRequest,
  VirtualAssistanceStatus,
} from "@prisma/client";
import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import {
  Phone,
  Mail,
  Send,
  Clock,
  User,
  Briefcase,
  Loader2,
  GraduationCap,
  FileText,
  Download,
  Trash2,
} from "lucide-react";

export default function VAMonitor({
  requests,
}: {
  requests: VirtualAssistanceRequest[];
}) {
  const [selectedRequest, setSelectedRequest] =
    useState<VirtualAssistanceRequest | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "contacted"
  >("all");

  const filteredRequests = requests.filter((req) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "pending") return req.status === "PENDING";
    if (filterStatus === "contacted") return req.status === "CONTACTED";
    return true;
  });

  const handleStatusChange = async (id: string, newStatus: string) => {
    if (newStatus !== "PENDING" && newStatus !== "CONTACTED") return;

    setUpdatingId(id);
    await updateVAStatus(id, newStatus as VirtualAssistanceStatus);
    setUpdatingId(null);
  };

  const handleDeleteFile = async (requestId: string, fileUrl: string) => {
    if (!confirm("Are you sure you want to delete this file? This action cannot be undone.")) {
      return;
    }

    setDeletingFileId(requestId);
    try {
      const response = await fetch(`/api/virtual-assistance/${requestId}/file`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl }),
      });

      if (response.ok) {
        window.location.reload(); // Refresh to show updated data
      } else {
        alert("Failed to delete file");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Error deleting file");
    } finally {
      setDeletingFileId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Virtual Assistance
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage incoming requests and track contact status.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-white p-2 rounded-lg border shadow-sm">
          <span className="text-sm font-medium pl-2">Status:</span>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={filterStatus === "all" ? "default" : "ghost"}
              onClick={() => setFilterStatus("all")}
              className="h-7 text-xs"
            >
              All
            </Button>
            <Button
              size="sm"
              variant={filterStatus === "pending" ? "default" : "ghost"}
              onClick={() => setFilterStatus("pending")}
              className={`h-7 text-xs ${filterStatus === "pending" ? "bg-yellow-600 hover:bg-yellow-700 text-white" : ""}`}
            >
              Pending
            </Button>
            <Button
              size="sm"
              variant={filterStatus === "contacted" ? "default" : "ghost"}
              onClick={() => setFilterStatus("contacted")}
              className={`h-7 text-xs ${filterStatus === "contacted" ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
            >
              Contacted
            </Button>
          </div>
        </div>
      </div>

      <Card className="border-0 shadow-sm ring-1 ring-gray-950/5">
        <CardHeader className="px-6 py-4">
          <CardTitle className="text-lg">Requests</CardTitle>
          <CardDescription>
            Viewing {filteredRequests.length} requests
          </CardDescription>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/50 text-gray-500 border-b border-gray-100">
              <tr>
                <th className="h-10 px-6 text-xs font-medium uppercase tracking-wider">
                  Applicant
                </th>
                <th className="h-10 px-6 text-xs font-medium uppercase tracking-wider">
                  Target Job
                </th>
                <th className="h-10 px-6 text-xs font-medium uppercase tracking-wider">
                  Education
                </th>
                <th className="h-10 px-6 text-xs font-medium uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="h-10 px-6 text-xs font-medium uppercase tracking-wider">
                  Status
                </th>
                <th className="h-10 px-6 text-xs font-medium uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No requests found matching filters.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">
                          {req.full_name}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(req.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-col">
                        <Badge
                          variant="outline"
                          className="w-fit mb-1 capitalize border-gray-200"
                        >
                          {req.job_category.replace(/_/g, " ")}
                        </Badge>
                        <span className="text-xs text-muted-foreground capitalize pl-1">
                          {req.experience_level} Level
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                        <span className="capitalize">
                          {req.education_level?.replace(/_/g, " ") || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center text-xs">
                          <Phone className="w-3.5 h-3.5 mr-2 text-gray-400" />
                          <span className="font-mono text-gray-600">
                            {req.phone_number}
                          </span>
                        </div>
                        {req.email && (
                          <div className="flex items-center text-xs">
                            <Mail className="w-3.5 h-3.5 mr-2 text-gray-400" />
                            <span
                              className="truncate max-w-37.5 text-gray-600"
                              title={req.email}
                            >
                              {req.email}
                            </span>
                          </div>
                        )}
                        {req.telegram_username && (
                          <div className="flex items-center text-xs">
                            <Send className="w-3.5 h-3.5 mr-2 text-blue-400" />
                            <span className="text-blue-600">
                              @{req.telegram_username.replace("@", "")}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="relative inline-block text-left w-32">
                        <select
                          value={req.status}
                          onChange={(e) =>
                            handleStatusChange(req.id, e.target.value)
                          }
                          disabled={updatingId === req.id}
                          className={`
                                                appearance-none w-full pl-3 pr-8 py-1.5 text-xs font-semibold rounded-md border transition-all
                                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1
                                                ${
                                                  req.status === "CONTACTED"
                                                    ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 focus-visible:ring-green-500"
                                                    : "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 focus-visible:ring-yellow-500"
                                                }
                                                ${updatingId === req.id ? "opacity-50 cursor-wait" : "cursor-pointer"}
                                            `}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONTACTED">CONTACTED</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                          {updatingId === req.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <svg
                              className="h-3 w-3 fill-current opacity-50"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs font-normal"
                        onClick={() => setSelectedRequest(req)}
                      >
                        Details
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedRequest && (
        <MinimalModal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          title="Application Details"
        >
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-900">
                  {selectedRequest.full_name}
                </h3>
                <div className="flex gap-2">
                  <Badge variant="outline" className="capitalize">
                    {selectedRequest.job_category.replace(/_/g, " ")}
                  </Badge>
                  <Badge variant="secondary" className="capitalize">
                    {selectedRequest.experience_level}
                  </Badge>
                </div>
              </div>
              <div
                className={`
                            px-3 py-1 rounded-full text-xs font-bold border
                            ${selectedRequest.status === "CONTACTED" ? "bg-green-100 text-green-700 border-green-200" : "bg-yellow-100 text-yellow-700 border-yellow-200"}
                         `}
              >
                {selectedRequest.status}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-gray-50 rounded-lg space-y-3">
                <div className="font-semibold text-gray-900 flex items-center mb-2">
                  <User className="w-4 h-4 mr-2" /> Contact Info
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-3 h-3 mr-2" />
                    <a
                      href={`tel:${selectedRequest.phone_number}`}
                      className="hover:underline"
                    >
                      {selectedRequest.phone_number}
                    </a>
                  </div>
                  {selectedRequest.email && (
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-3 h-3 mr-2" />
                      <a
                        href={`mailto:${selectedRequest.email}`}
                        className="hover:underline"
                      >
                        {selectedRequest.email}
                      </a>
                    </div>
                  )}
                  {selectedRequest.telegram_username && (
                    <div className="flex items-center text-gray-600">
                      <Send className="w-3 h-3 mr-2" />
                      <span>
                        @{selectedRequest.telegram_username.replace("@", "")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg space-y-3">
                <div className="font-semibold text-gray-900 flex items-center mb-2">
                  <Briefcase className="w-4 h-4 mr-2" /> Metadata
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-gray-500 block">Education Level</span>
                    <span className="font-medium capitalize">
                      {selectedRequest.education_level?.replace(/_/g, " ") || "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Location</span>
                    <span className="font-medium">
                      {selectedRequest.location}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Submitted</span>
                    <span className="font-medium">
                      {new Date(selectedRequest.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Language</span>
                    <span className="font-medium uppercase">
                      {selectedRequest.language}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Source</span>
                    <span className="font-medium capitalize">
                      {selectedRequest.source}
                    </span>
                  </div>
                  {selectedRequest.disclaimer_accepted_at && (
                    <div>
                      <span className="text-gray-500 block">
                        Disclaimer Accepted
                      </span>
                      <span className="font-medium">
                        {new Date(
                          selectedRequest.disclaimer_accepted_at,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <span className="block text-gray-500 text-xs uppercase mb-2 font-semibold">
                Additional Notes
              </span>
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-lg text-sm text-gray-700 whitespace-pre-wrap leading-relaxed min-h-20">
                {selectedRequest.notes || (
                  <span className="text-gray-400 italic">
                    No additional notes provided.
                  </span>
                )}
              </div>
            </div>

            {selectedRequest.resume_url && (
              <div>
                <span className="block text-gray-500 text-xs uppercase mb-2 font-semibold">
                  Uploaded Resume
                </span>
                <div className="flex items-center justify-between p-4 bg-teal-50 border border-teal-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-teal-600" />
                    <div>
                      <p className="text-sm font-medium text-teal-900">Resume File</p>
                      <p className="text-xs text-teal-600">Uploaded by applicant</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs border-teal-300 hover:bg-teal-100"
                      onClick={() => window.open(selectedRequest.resume_url!, "_blank")}
                    >
                      <Download className="w-3.5 h-3.5 mr-1" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteFile(selectedRequest.id, selectedRequest.resume_url!)}
                      disabled={deletingFileId === selectedRequest.id}
                    >
                      {deletingFileId === selectedRequest.id ? (
                        <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                      )}
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </MinimalModal>
      )}
    </div>
  );
}
