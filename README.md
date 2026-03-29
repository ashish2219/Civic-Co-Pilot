# Civic Co-Pilot

### AI-Simulated Civic Grievance and Scheme Recommendation System

Civic Co-Pilot is a full-stack web application that streamlines grievance handling, improves transparency, and enhances awareness of government schemes for students and citizens. It uses a rule-based logic engine to simulate intelligent complaint classification and personalized scheme recommendations.

---

## Features

- **Smart Complaint Processing** — Submit complaints in plain language; the system auto-classifies category, priority, and department using keyword-based rules
- **Complaint Lifecycle Tracking** — Full status history from `SUBMITTED → IN_PROGRESS → RESOLVED / REJECTED`
- **Scheme Recommendation Engine** — Personalized government scheme suggestions based on complaint type and user role
- **Admin Dashboard** — Statistics, priority queues, and inline complaint status management
- **Role-Based Access** — Three roles: `STUDENT`, `CITIZEN`, and `ADMIN`
- **Session-Based Authentication** — Secure cookie sessions, no tokens required on the client

---

## Tech Stack

| Layer         | Technology                               |
| ------------- | ---------------------------------------- |
| Frontend      | React 18, Vite, TypeScript, Tailwind CSS |
| UI Components | shadcn/ui, Radix UI                      |
| Backend       | Node.js, Express 5, TypeScript           |
| Database      | PostgreSQL, Drizzle ORM                  |
| API Contract  | OpenAPI 3.1, Orval (codegen)             |
| Forms         | React Hook Form, Zod                     |
| Charts        | Recharts                                 |
| Build Tool    | pnpm workspaces (monorepo), esbuild      |

---

## Project Structure

```
civic-copilot/
├── artifacts/
│   ├── api-server/          # Express REST API
│   │   └── src/
│   │       ├── lib/
│   │       │   └── classifier.ts   # Rule-based complaint classifier
│   │       └── routes/
│   │           ├── auth.ts         # Register, login, logout
│   │           ├── complaints.ts   # Complaint CRUD + status update
│   │           ├── schemes.ts      # Scheme listing + recommendation
│   │           └── admin.ts        # Admin stats + complaint management
│   └── civic-copilot/       # React + Vite frontend
│       └── src/
│           ├── pages/              # All application pages
│           ├── components/         # Shared UI components
│           └── hooks/
│               └── use-auth.tsx    # Auth context
├── lib/
│   ├── api-spec/            # OpenAPI 3.1 specification
│   ├── api-client-react/    # Generated React Query hooks
│   ├── api-zod/             # Generated Zod validation schemas
│   └── db/
│       └── src/schema/
│           ├── users.ts
│           ├── complaints.ts
│           └── schemes.ts
├── pnpm-workspace.yaml
├── package.json
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- PostgreSQL database

### Installation

```bash
# Clone the repository
git clone https://github.com/Knshk-7002/Civic-Co-Pilot.git
cd Civic-Co-Pilot

# Install dependencies
pnpm install

#if you don't have pnpm
npm install -g pnpm@latest-10
#then try
pnpm install

# Set environment variables
# Create a .env file or export directly:
export DATABASE_URL=postgresql://user:password@localhost:5432/civic_copilot
export SESSION_SECRET=your-secret-key
export PORT=8080
```

### Database Setup

```bash
# Push schema to database
pnpm --filter @workspace/db run push
```

### Run in Development

```bash
# Start the API server
pnpm --filter @workspace/api-server run dev

# In a separate terminal, start the frontend
pnpm --filter @workspace/civic-copilot run dev
```

The app will be available at `http://localhost:5173` (frontend) and `http://localhost:8080` (API).

### Regenerate API Client (after spec changes)

```bash
pnpm --filter @workspace/api-spec run codegen
```

---

## API Endpoints

| Method  | Path                         | Description                             |
| ------- | ---------------------------- | --------------------------------------- |
| `POST`  | `/api/auth/register`         | Register a new user                     |
| `POST`  | `/api/auth/login`            | Login                                   |
| `POST`  | `/api/auth/logout`           | Logout                                  |
| `GET`   | `/api/auth/me`               | Get current user                        |
| `GET`   | `/api/complaints`            | List complaints (own / all for admin)   |
| `POST`  | `/api/complaints`            | Submit a new complaint                  |
| `GET`   | `/api/complaints/:id`        | Get complaint details + status history  |
| `PATCH` | `/api/complaints/:id/status` | Update complaint status (admin only)    |
| `GET`   | `/api/schemes`               | List all schemes                        |
| `POST`  | `/api/schemes/recommend`     | Get personalized scheme recommendations |
| `GET`   | `/api/admin/complaints`      | Admin: list all complaints with filters |
| `GET`   | `/api/admin/stats`           | Admin: dashboard statistics             |

---

## Rule-Based Classification Logic

When a complaint is submitted, the system analyzes the title and description using keyword matching:

**Category Detection**

| Category       | Example Keywords                            |
| -------------- | ------------------------------------------- |
| FINANCE        | fee, payment, scholarship, loan, refund     |
| EDUCATION      | school, college, exam, teacher, admission   |
| HEALTH         | hospital, doctor, medicine, vaccination     |
| INFRASTRUCTURE | road, pothole, electricity, water, drainage |
| HOUSING        | house, rent, eviction, accommodation        |
| EMPLOYMENT     | job, salary, unemployment, labour           |
| ENVIRONMENT    | pollution, waste, garbage, emission         |

**Priority Detection**

| Priority | Example Keywords                       |
| -------- | -------------------------------------- |
| URGENT   | emergency, danger, life, crisis, flood |
| HIGH     | severe, broken, denied, no access      |
| MEDIUM   | delay, pending, waiting, months        |
| LOW      | (default)                              |

---

## Database Schema

```
users            — id, name, email, password_hash, role, created_at
complaints       — id, title, description, category, priority, department, status, user_id, created_at, updated_at
status_history   — id, complaint_id, status, note, changed_at
schemes          — id, name, description, category, eligible_roles, benefits, how_to_apply
```

---

## Demo Accounts

| Role    | Email               | Password |
| ------- | ------------------- | -------- |
| Admin   | admin@civic.gov     | admin123 |
| Student | student@example.com | admin123 |
| Citizen | citizen@example.com | admin123 |

---

## Pages

| Page             | Route               | Access        |
| ---------------- | ------------------- | ------------- |
| Home / Landing   | `/`                 | Public        |
| Register         | `/register`         | Public        |
| Login            | `/login`            | Public        |
| Dashboard        | `/dashboard`        | Authenticated |
| Submit Complaint | `/submit`           | Authenticated |
| My Complaints    | `/complaints`       | Authenticated |
| Complaint Detail | `/complaints/:id`   | Authenticated |
| Browse Schemes   | `/schemes`          | Authenticated |
| Admin Dashboard  | `/admin`            | Admin only    |
| Admin Complaints | `/admin/complaints` | Admin only    |

---

## Java Concepts Demonstrated (Equivalent in TypeScript/Node.js)

| Java Concept            | Implementation                               |
| ----------------------- | -------------------------------------------- |
| OOP / Encapsulation     | TypeScript classes and interfaces            |
| Collections & Streams   | Array `.filter()`, `.map()`, `.reduce()`     |
| Exception Handling      | Try/catch with structured error responses    |
| JDBC / JPA              | Drizzle ORM with PostgreSQL                  |
| REST API                | Express 5 route handlers                     |
| Rule-based Logic Engine | `classifier.ts` — keyword-matching functions |
| Layered Architecture    | Routes → Services → DB (Repository pattern)  |

---

## Future Enhancements

- Real AI/ML model for complaint classification
- Email notifications on status changes
- Mobile application (React Native / Expo)
- Integration with government scheme databases
- Multilingual support
- Real-time updates via WebSockets

---

## License

This project is developed for academic purposes as part of a Java-based system design project.
