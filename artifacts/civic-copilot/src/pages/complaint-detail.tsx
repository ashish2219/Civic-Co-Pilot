import { useParams } from "wouter";
import { useGetComplaint } from "@workspace/api-client-react";
import { PageHeader, Card, StatusBadge, PriorityBadge } from "@/components/shared";
import { format } from "date-fns";
import { MapPin, Calendar, Tag, Building2, Lightbulb, Clock } from "lucide-react";

export default function ComplaintDetail() {
  const { id } = useParams();
  const { data: complaint, isLoading, error } = useGetComplaint(Number(id));

  if (isLoading) return <div className="p-12 text-center animate-pulse">Loading details...</div>;
  if (error || !complaint) return <div className="p-12 text-center text-red-500">Failed to load complaint.</div>;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-6">
        <div className="text-sm font-mono text-muted-foreground mb-2">Complaint #{complaint.id}</div>
        <PageHeader title={complaint.title} />
        <div className="flex flex-wrap gap-3 mt-4">
          <StatusBadge status={complaint.status} />
          <PriorityBadge priority={complaint.priority} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 md:p-8">
            <h3 className="text-lg font-bold font-display border-b border-gray-100 pb-4 mb-4">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {complaint.description}
            </p>
            
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-gray-100">
              <div>
                <span className="flex items-center text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1"><Tag className="w-3 h-3 mr-1" /> Category</span>
                <span className="font-medium capitalize">{complaint.category.toLowerCase()}</span>
              </div>
              <div>
                <span className="flex items-center text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1"><Building2 className="w-3 h-3 mr-1" /> Department</span>
                <span className="font-medium">{complaint.department}</span>
              </div>
              <div>
                <span className="flex items-center text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1"><Calendar className="w-3 h-3 mr-1" /> Submitted</span>
                <span className="font-medium">{format(new Date(complaint.createdAt), 'MMM dd, yyyy')}</span>
              </div>
              <div>
                <span className="flex items-center text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1"><Clock className="w-3 h-3 mr-1" /> Last Update</span>
                <span className="font-medium">{format(new Date(complaint.updatedAt), 'MMM dd, yyyy')}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 md:p-8">
            <h3 className="text-lg font-bold font-display border-b border-gray-100 pb-4 mb-6">Status History</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              {complaint.statusHistory.map((history, i) => (
                <div key={history.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm group-hover:border-slate-300 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-bold text-slate-900"><StatusBadge status={history.status} /></div>
                      <time className="text-xs font-medium text-slate-500">{format(new Date(history.changedAt), 'MMM dd, yyyy HH:mm')}</time>
                    </div>
                    {history.note && <div className="text-sm text-slate-600 mt-2">{history.note}</div>}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-6 h-6 text-yellow-300" />
              <h3 className="font-display font-bold text-lg">AI Recommendations</h3>
            </div>
            <p className="text-blue-100 text-sm mb-6 leading-relaxed">
              Based on your complaint category ({complaint.category}) and profile, our system identified the following schemes you may be eligible for.
            </p>

            <div className="space-y-3">
              {complaint.recommendedSchemes.length > 0 ? (
                complaint.recommendedSchemes.map(scheme => (
                  <div key={scheme.id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 hover:bg-white/20 transition-colors cursor-pointer">
                    <h4 className="font-bold text-sm mb-1">{scheme.name}</h4>
                    <p className="text-xs text-blue-100 line-clamp-2">{scheme.description}</p>
                  </div>
                ))
              ) : (
                <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-sm">No specific schemes found for this category at this time.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
