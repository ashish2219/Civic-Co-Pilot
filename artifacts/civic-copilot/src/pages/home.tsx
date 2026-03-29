import { Link, useLocation } from "wouter";
import { ArrowRight, ShieldCheck, Zap, LineChart } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { UserRole } from "@workspace/api-client-react";

export default function Home() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === UserRole.ADMIN) {
        setLocation("/admin/dashboard");
      } else {
        setLocation("/dashboard");
      }
    }
  }, [user, isLoading, setLocation]);

  if (isLoading || user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="absolute top-0 left-0 right-0 z-50 p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Civic Co-Pilot Logo" className="w-10 h-10 shadow-lg rounded-xl" />
          <span className="font-display font-bold text-2xl tracking-tight text-primary">Civic Co-Pilot</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
            Log in
          </Link>
          <Link href="/register" className="text-sm font-semibold bg-primary text-primary-foreground px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg">
            Get Started
          </Link>
        </div>
      </header>

      <main>
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
              alt="Hero Background" 
              className="w-full h-full object-cover opacity-[0.15]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-8 border border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Next-Gen Governance
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-[1.1]">
              Smart Civic Routing & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Scheme Recommendations</span>
            </h1>
            
            <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Submit grievances naturally. Our AI-simulated engine auto-classifies, routes your complaint, and instantly recommends eligibility for government schemes.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl text-lg font-bold hover:bg-primary/90 hover:scale-105 transition-all shadow-xl shadow-primary/25">
                Submit a Complaint <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/schemes" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border-2 border-border text-foreground px-8 py-4 rounded-xl text-lg font-bold hover:border-primary/30 hover:bg-gray-50 transition-all">
                Browse Schemes
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <Zap className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold font-display mb-3">Auto-Classification</h3>
                <p className="text-muted-foreground">Type your issue naturally. Our rule-engine instantly assigns the right department and priority level without complex forms.</p>
              </div>
              
              <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold font-display mb-3">Transparent Tracking</h3>
                <p className="text-muted-foreground">Follow your complaint lifecycle from Submission to Resolution. No more black holes in civic governance.</p>
              </div>

              <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                  <LineChart className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold font-display mb-3">Smart Schemes</h3>
                <p className="text-muted-foreground">Discover financial, educational, and civic programs you qualify for based on your profile and grievance context.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
