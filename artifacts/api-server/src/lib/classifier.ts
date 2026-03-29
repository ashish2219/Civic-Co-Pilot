export type Category =
  | "FINANCE"
  | "INFRASTRUCTURE"
  | "EDUCATION"
  | "HEALTH"
  | "GENERAL"
  | "HOUSING"
  | "EMPLOYMENT"
  | "ENVIRONMENT";

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface ClassificationResult {
  category: Category;
  priority: Priority;
  department: string;
}

const CATEGORY_RULES: Array<{ keywords: string[]; category: Category; department: string }> = [
  {
    keywords: ["fee", "payment", "scholarship", "stipend", "fine", "tax", "refund", "money", "financial", "loan", "grant", "fund"],
    category: "FINANCE",
    department: "Finance Department",
  },
  {
    keywords: ["road", "pothole", "bridge", "streetlight", "electricity", "power", "water", "drainage", "sewer", "construction", "repair", "infrastructure", "pipeline", "cable"],
    category: "INFRASTRUCTURE",
    department: "Public Works Department",
  },
  {
    keywords: ["school", "college", "university", "teacher", "exam", "result", "admission", "course", "syllabus", "certificate", "education", "library", "student", "tuition", "degree"],
    category: "EDUCATION",
    department: "Education Department",
  },
  {
    keywords: ["hospital", "doctor", "medicine", "health", "disease", "treatment", "clinic", "ambulance", "patient", "nurse", "sanitation", "hygiene", "vaccination", "medical"],
    category: "HEALTH",
    department: "Health Department",
  },
  {
    keywords: ["house", "rent", "accommodation", "shelter", "eviction", "tenant", "landlord", "apartment", "housing", "residence", "homeless"],
    category: "HOUSING",
    department: "Housing Department",
  },
  {
    keywords: ["job", "employment", "work", "salary", "wage", "unemployment", "career", "labour", "labor", "skill", "training", "apprentice", "workplace"],
    category: "EMPLOYMENT",
    department: "Labour Department",
  },
  {
    keywords: ["pollution", "waste", "garbage", "environment", "tree", "forest", "noise", "air", "water contamination", "plastic", "recycling", "green", "climate", "emission"],
    category: "ENVIRONMENT",
    department: "Environment Department",
  },
];

const PRIORITY_RULES: Array<{ keywords: string[]; priority: Priority }> = [
  {
    keywords: ["urgent", "emergency", "critical", "life", "death", "danger", "immediately", "crisis", "fire", "flood", "accident", "fatal"],
    priority: "URGENT",
  },
  {
    keywords: ["severe", "serious", "major", "important", "significant", "broken", "failed", "not working", "no access", "denied"],
    priority: "HIGH",
  },
  {
    keywords: ["delay", "slow", "pending", "waiting", "long time", "months", "weeks"],
    priority: "MEDIUM",
  },
];

export function classifyComplaint(title: string, description: string): ClassificationResult {
  const text = `${title} ${description}`.toLowerCase();

  let category: Category = "GENERAL";
  let department = "General Affairs Department";

  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((kw) => text.includes(kw))) {
      category = rule.category;
      department = rule.department;
      break;
    }
  }

  let priority: Priority = "LOW";
  for (const rule of PRIORITY_RULES) {
    if (rule.keywords.some((kw) => text.includes(kw))) {
      priority = rule.priority;
      break;
    }
  }

  if (priority === "LOW") {
    const wordCount = text.split(/\s+/).length;
    if (wordCount > 50) priority = "MEDIUM";
  }

  return { category, priority, department };
}

export function recommendSchemeCategories(category: Category, userRole: string): string[] {
  const recommendations: Record<Category, string[]> = {
    FINANCE: ["FINANCE", "EDUCATION", "EMPLOYMENT"],
    EDUCATION: ["EDUCATION", "EMPLOYMENT", "FINANCE"],
    HEALTH: ["HEALTH", "HOUSING"],
    INFRASTRUCTURE: ["INFRASTRUCTURE", "ENVIRONMENT"],
    HOUSING: ["HOUSING", "FINANCE"],
    EMPLOYMENT: ["EMPLOYMENT", "EDUCATION", "FINANCE"],
    ENVIRONMENT: ["ENVIRONMENT", "INFRASTRUCTURE"],
    GENERAL: ["GENERAL", "FINANCE", "HEALTH"],
  };

  return recommendations[category] ?? ["GENERAL"];
}
