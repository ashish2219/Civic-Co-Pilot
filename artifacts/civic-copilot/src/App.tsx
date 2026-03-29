import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { AppLayout } from "@/components/layout";
import { UserRole } from "@workspace/api-client-react";

// Pages
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import SubmitComplaint from "@/pages/submit-complaint";
import MyComplaints from "@/pages/my-complaints";
import ComplaintDetail from "@/pages/complaint-detail";
import Schemes from "@/pages/schemes";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminComplaints from "@/pages/admin-complaints";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component, adminOnly = false }: { component: any, adminOnly?: boolean }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!user) {
    setLocation("/login");
    return null;
  }

  if (adminOnly && user.role !== UserRole.ADMIN) {
    setLocation("/dashboard");
    return null;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      
      <Route path="/dashboard">
        {() => <AppLayout><ProtectedRoute component={Dashboard} /></AppLayout>}
      </Route>
      <Route path="/complaints">
        {() => <AppLayout><ProtectedRoute component={MyComplaints} /></AppLayout>}
      </Route>
      <Route path="/complaints/new">
        {() => <AppLayout><ProtectedRoute component={SubmitComplaint} /></AppLayout>}
      </Route>
      <Route path="/complaints/:id">
        {() => <AppLayout><ProtectedRoute component={ComplaintDetail} /></AppLayout>}
      </Route>
      <Route path="/schemes">
        {() => <AppLayout><ProtectedRoute component={Schemes} /></AppLayout>}
      </Route>

      <Route path="/admin/dashboard">
        {() => <AppLayout><ProtectedRoute component={AdminDashboard} adminOnly /></AppLayout>}
      </Route>
      <Route path="/admin/complaints">
        {() => <AppLayout><ProtectedRoute component={AdminComplaints} adminOnly /></AppLayout>}
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
