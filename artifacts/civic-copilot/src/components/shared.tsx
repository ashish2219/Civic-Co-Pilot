import { ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ComplaintStatus, ComplaintPriority } from "@workspace/api-client-react";
import { CheckCircle2, Clock, XCircle, AlertCircle, FileText, LayoutDashboard, Settings } from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function StatusBadge({ status, className }: { status: ComplaintStatus, className?: string }) {
  const styles = {
    [ComplaintStatus.SUBMITTED]: "bg-blue-100 text-blue-800 border-blue-200",
    [ComplaintStatus.IN_PROGRESS]: "bg-amber-100 text-amber-800 border-amber-200",
    [ComplaintStatus.RESOLVED]: "bg-emerald-100 text-emerald-800 border-emerald-200",
    [ComplaintStatus.REJECTED]: "bg-red-100 text-red-800 border-red-200",
  };

  const icons = {
    [ComplaintStatus.SUBMITTED]: <FileText className="w-3 h-3 mr-1" />,
    [ComplaintStatus.IN_PROGRESS]: <Clock className="w-3 h-3 mr-1" />,
    [ComplaintStatus.RESOLVED]: <CheckCircle2 className="w-3 h-3 mr-1" />,
    [ComplaintStatus.REJECTED]: <XCircle className="w-3 h-3 mr-1" />,
  };

  const labels = {
    [ComplaintStatus.SUBMITTED]: "Submitted",
    [ComplaintStatus.IN_PROGRESS]: "In Progress",
    [ComplaintStatus.RESOLVED]: "Resolved",
    [ComplaintStatus.REJECTED]: "Rejected",
  };

  return (
    <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border", styles[status], className)}>
      {icons[status]}
      {labels[status]}
    </span>
  );
}

export function PriorityBadge({ priority, className }: { priority: ComplaintPriority, className?: string }) {
  const styles = {
    [ComplaintPriority.LOW]: "bg-gray-100 text-gray-800 border-gray-200",
    [ComplaintPriority.MEDIUM]: "bg-blue-100 text-blue-800 border-blue-200",
    [ComplaintPriority.HIGH]: "bg-orange-100 text-orange-800 border-orange-200",
    [ComplaintPriority.URGENT]: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", styles[priority], className)}>
      {priority}
    </span>
  );
}

export function Card({ children, className, hover = false }: { children: ReactNode, className?: string, hover?: boolean }) {
  return (
    <div className={cn(
      "bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden",
      hover && "hover:shadow-md hover:border-border transition-all duration-200",
      className
    )}>
      {children}
    </div>
  );
}

export function PageHeader({ title, description, action }: { title: string, description?: string, action?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">{title}</h1>
        {description && <p className="mt-1 text-muted-foreground">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
