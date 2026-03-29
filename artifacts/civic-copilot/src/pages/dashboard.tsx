import { useAuth } from "@/hooks/use-auth";
import { useListComplaints } from "@workspace/api-client-react";
import { ComplaintStatus } from "@workspace/api-client-react";
import { PageHeader, Card, StatusBadge } from "@/components/shared";
import { FileText, Send, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: complaints, isLoading } = useListComplaints();

  const stats = {
    total: complaints?.length || 0,
    active: complaints?.filter(c => c.status === ComplaintStatus.SUBMITTED || c.status === ComplaintStatus.IN_PROGRESS).length || 0,
    resolved: complaints?.filter(c => c.status === ComplaintStatus.RESOLVED).length || 0,
    rejected: complaints?.filter(c => c.status === ComplaintStatus.REJECTED).length || 0,
  };

  const recentComplaints = complaints?.slice(0, 3) || [];

  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader 
        title={`Welcome back, ${user?.name.split(' ')[0]}`} 
        description="Here is an overview of your civic activity."
        action={
          <Link href="/complaints/new" className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm hover:bg-primary/90 transition-all hover:scale-105 active:scale-95">
            <Send className="w-4 h-4" />
            New Complaint
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Total Complaints</p>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-display font-bold mt-4">{isLoading ? "-" : stats.total}</p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Active</p>
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-display font-bold mt-4">{isLoading ? "-" : stats.active}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Resolved</p>
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-display font-bold mt-4">{isLoading ? "-" : stats.resolved}</p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Rejected</p>
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-display font-bold mt-4">{isLoading ? "-" : stats.rejected}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-display">Recent Activity</h3>
            <Link href="/complaints" className="text-sm font-semibold text-primary hover:underline">
              View all
            </Link>
          </div>
          
          <Card>
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading...</div>
            ) : recentComplaints.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center">
                <FileText className="w-12 h-12 text-gray-300 mb-3" />
                <h4 className="text-lg font-semibold text-foreground">No complaints yet</h4>
                <p className="text-muted-foreground mt-1 mb-4">You haven't submitted any complaints.</p>
                <Link href="/complaints/new" className="text-primary font-medium hover:underline">Submit your first complaint</Link>
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {recentComplaints.map(complaint => (
                  <Link key={complaint.id} href={`/complaints/${complaint.id}`} className="block p-5 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-foreground truncate pr-4">{complaint.title}</h4>
                      <StatusBadge status={complaint.status} />
                    </div>
                    <div className="flex gap-3 text-sm text-muted-foreground">
                      <span className="capitalize">{complaint.category.toLowerCase()}</span>
                      <span>•</span>
                      <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div>
          <h3 className="text-lg font-bold font-display mb-4">Quick Links</h3>
          <div className="space-y-4">
            <Link href="/schemes" className="block p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white hover:shadow-lg transition-all hover:-translate-y-0.5">
              <h4 className="font-bold text-lg mb-1">Discover Schemes</h4>
              <p className="text-blue-100 text-sm">Find government programs you might be eligible for.</p>
            </Link>
            
            <Card hover className="p-5 flex items-start gap-4 cursor-pointer" onClick={() => window.location.href = '/complaints/new'}>
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <Send className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold">Submit Feedback</h4>
                <p className="text-sm text-muted-foreground mt-1">Help us improve the community.</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
