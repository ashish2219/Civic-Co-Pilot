import { useAdminGetStats } from "@workspace/api-client-react";
import { PageHeader, Card } from "@/components/shared";
import { Users, FileText, CheckCircle, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ['#2563eb', '#f59e0b', '#10b981', '#ef4444'];

export default function AdminDashboard() {
  const { data: stats, isLoading } = useAdminGetStats();

  if (isLoading || !stats) {
    return <div className="p-12 text-center animate-pulse">Loading admin statistics...</div>;
  }

  const categoryData = Object.entries(stats.byCategory).map(([name, value]) => ({
    name, value
  }));

  const statusData = [
    { name: 'Submitted', value: stats.byStatus.SUBMITTED },
    { name: 'In Progress', value: stats.byStatus.IN_PROGRESS },
    { name: 'Resolved', value: stats.byStatus.RESOLVED },
    { name: 'Rejected', value: stats.byStatus.REJECTED },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader 
        title="Admin Overview" 
        description="System-wide statistics and grievance tracking metrics."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white border-none shadow-lg">
          <div className="flex items-center justify-between opacity-80 mb-4">
            <p className="text-sm font-semibold uppercase tracking-wider">Total Users</p>
            <Users className="w-5 h-5" />
          </div>
          <p className="text-4xl font-display font-bold">{stats.totalUsers}</p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-muted-foreground">Total Complaints</p>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-display font-bold">{stats.totalComplaints}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-muted-foreground">Resolved Today</p>
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-display font-bold">{stats.resolvedToday}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-muted-foreground">Urgent Priority</p>
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-display font-bold text-red-600">{stats.byPriority.URGENT}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-lg font-bold font-display mb-6">Complaints by Category</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{fontSize: 10}} interval={0} angle={-45} textAnchor="end" height={60} />
                <YAxis tick={{fontSize: 12}} />
                <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold font-display mb-6">Status Breakdown</h3>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {statusData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-gray-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
