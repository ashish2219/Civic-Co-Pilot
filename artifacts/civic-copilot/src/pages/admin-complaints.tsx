import { useState } from "react";
import { Link } from "wouter";
import { useAdminListComplaints, useUpdateComplaintStatus, getAdminListComplaintsQueryKey } from "@workspace/api-client-react";
import { ComplaintStatus, AdminListComplaintsPriority } from "@workspace/api-client-react";
import { PageHeader, Card, StatusBadge, PriorityBadge } from "@/components/shared";
import { format } from "date-fns";
import { Search, Filter, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminComplaints() {
  const queryClient = useQueryClient();
  const [filterPriority, setFilterPriority] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  
  const queryParams = {
    ...(filterPriority !== "ALL" && { priority: filterPriority as AdminListComplaintsPriority }),
    ...(filterStatus !== "ALL" && { status: filterStatus as ComplaintStatus })
  };
  
  const { data: complaints, isLoading } = useAdminListComplaints(queryParams);
  
  const { mutateAsync: updateStatus, isPending } = useUpdateComplaintStatus({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getAdminListComplaintsQueryKey() });
      }
    }
  });

  const handleStatusChange = async (id: number, newStatus: ComplaintStatus) => {
    try {
      await updateStatus({ id, data: { status: newStatus, note: "Status updated by admin" } });
    } catch (e) {
      console.error(e);
      alert("Failed to update status");
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader 
        title="All Complaints" 
        description="Manage, route, and update citizen grievances across the system."
      />

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by ID or title..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-5 h-5 hidden sm:block" />
            <select 
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none font-medium text-gray-700"
            >
              <option value="ALL">All Priorities</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none font-medium text-gray-700"
          >
            <option value="ALL">All Status</option>
            <option value={ComplaintStatus.SUBMITTED}>Submitted</option>
            <option value={ComplaintStatus.IN_PROGRESS}>In Progress</option>
            <option value={ComplaintStatus.RESOLVED}>Resolved</option>
            <option value={ComplaintStatus.REJECTED}>Rejected</option>
          </select>
        </div>
      </div>

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading data...
          </div>
        ) : complaints && complaints.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-xs uppercase tracking-wider font-bold text-gray-500">
                  <th className="p-4 pl-6">ID</th>
                  <th className="p-4">Complaint Title</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 pl-6 text-sm font-mono text-gray-500">#{c.id}</td>
                    <td className="p-4">
                      <Link href={`/complaints/${c.id}`} className="font-semibold text-gray-900 hover:text-primary transition-colors block max-w-xs truncate">
                        {c.title}
                      </Link>
                      <div className="text-xs text-gray-500 mt-1 capitalize">{c.category.toLowerCase()} • {c.department}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{c.userName || `User ${c.userId}`}</td>
                    <td className="p-4"><PriorityBadge priority={c.priority} /></td>
                    <td className="p-4 text-sm text-gray-600">{format(new Date(c.createdAt), 'MMM dd')}</td>
                    <td className="p-4">
                      <select
                        value={c.status}
                        disabled={isPending}
                        onChange={(e) => handleStatusChange(c.id, e.target.value as ComplaintStatus)}
                        className={`text-sm font-bold rounded-lg px-3 py-1.5 border appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20
                          ${c.status === ComplaintStatus.SUBMITTED ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                          ${c.status === ComplaintStatus.IN_PROGRESS ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
                          ${c.status === ComplaintStatus.RESOLVED ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
                          ${c.status === ComplaintStatus.REJECTED ? 'bg-red-50 text-red-700 border-red-200' : ''}
                        `}
                      >
                        <option value={ComplaintStatus.SUBMITTED}>Submitted</option>
                        <option value={ComplaintStatus.IN_PROGRESS}>In Progress</option>
                        <option value={ComplaintStatus.RESOLVED}>Resolved</option>
                        <option value={ComplaintStatus.REJECTED}>Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No complaints found</h3>
            <p className="text-gray-500">There are no complaints matching your current filters.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
