import { useState } from "react";
import { useListSchemes } from "@workspace/api-client-react";
import { PageHeader, Card } from "@/components/shared";
import { Search, Filter, BookOpen, ChevronRight } from "lucide-react";

export default function Schemes() {
  const [category, setCategory] = useState<string>("");
  const { data: schemes, isLoading } = useListSchemes(
    category ? { category } : undefined
  );

  const categories = ["FINANCE", "INFRASTRUCTURE", "EDUCATION", "HEALTH", "HOUSING", "EMPLOYMENT"];

  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader 
        title="Civic Schemes & Programs" 
        description="Discover government initiatives, grants, and services you might be eligible for."
      />

      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search schemes..." 
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-gray-400 w-5 h-5" />
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none font-medium text-gray-700 min-w-[160px]"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <Card key={i} className="p-6 min-h-[250px] animate-pulse bg-gray-100" />
          ))}
        </div>
      ) : schemes && schemes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map(scheme => (
            <Card hover key={scheme.id} className="flex flex-col h-full group">
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                    {scheme.category}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold font-display mb-2 group-hover:text-primary transition-colors">{scheme.name}</h3>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                  {scheme.description}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-100">
                  <div className="flex gap-2 mb-4">
                    {scheme.eligibleRoles.map(role => (
                      <span key={role} className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full capitalize">
                        {role.toLowerCase()}
                      </span>
                    ))}
                  </div>
                  <button className="text-sm font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all">
                    View Details <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-12 bg-white rounded-2xl border border-gray-200 border-dashed">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold">No schemes found</h3>
          <p className="text-muted-foreground mt-1">Try adjusting your filters to see more results.</p>
        </div>
      )}
    </div>
  );
}
