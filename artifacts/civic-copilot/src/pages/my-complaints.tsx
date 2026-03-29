import { useState } from "react";
import { Link } from "wouter";
import { useListComplaints } from "@workspace/api-client-react";
import { ComplaintStatus } from "@workspace/api-client-react";
import { PageHeader, Card, StatusBadge, PriorityBadge } from "@/components/shared";
import { format } from "date-fns";
import { Search, Filter, Plus } from "lucide-react";

export default function MyComplaints() {
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const { data: complaints, isLoading } = useListComplaints(
    filterStatus !== "ALL" ? { status: filterStatus as ComplaintStatus } : undefined
  );

  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader 
        title="My Complaints" 
        description="Track the status and history of your submitted grievances."
        action={
          <Link href="/complaints/new" className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm hover:bg-primary/90 transition-all">
            <Plus className="w-4 h-4" /> New
          </Link>
        }
      />

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search complaints..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-gray-400 w-5 h-5" />
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none font-medium text-gray-700 min-w-[140px]"
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
          <div className="p-12 text-center text-muted-foreground">Loading complaints...</div>
        ) : complaints && complaints.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-sm font-semibold text-gray-500">
                  <th className="p-4 pl-6">ID & Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="p-4 pl-6">
                      <Link href={`/complaints/${c.id}`} className="block">
                        <span className="text-xs font-mono text-gray-400 mb-1 block">#{c.id}</span>
                        <span className="font-semibold text-gray-900 group-hover:text-primary transition-colors">{c.title}</span>
                      </Link>
                    </td>
                    <td className="p-4 text-sm text-gray-600 capitalize">{c.category.toLowerCase()}</td>
                    <td className="p-4"><PriorityBadge priority={c.priority} /></td>
                    <td className="p-4 text-sm text-gray-600">{format(new Date(c.createdAt), 'MMM dd, yyyy')}</td>
                    <td className="p-4"><StatusBadge status={c.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No complaints found</h3>
            <p className="text-gray-500 mb-6">You haven't submitted any complaints that match this filter.</p>
            <Link href="/complaints/new" className="text-primary font-medium hover:underline">Submit a new complaint</Link>
          </div>
        )}
      </Card>
    </div>
  );
}
