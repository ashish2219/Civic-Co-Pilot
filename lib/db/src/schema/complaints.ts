import { pgTable, serial, text, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const complaintStatusEnum = pgEnum("complaint_status", [
  "SUBMITTED",
  "IN_PROGRESS",
  "RESOLVED",
  "REJECTED",
]);

export const complaintCategoryEnum = pgEnum("complaint_category", [
  "FINANCE",
  "INFRASTRUCTURE",
  "EDUCATION",
  "HEALTH",
  "GENERAL",
  "HOUSING",
  "EMPLOYMENT",
  "ENVIRONMENT",
]);

export const complaintPriorityEnum = pgEnum("complaint_priority", [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
]);

export const complaintsTable = pgTable("complaints", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: complaintCategoryEnum("category").notNull().default("GENERAL"),
  priority: complaintPriorityEnum("priority").notNull().default("MEDIUM"),
  department: text("department").notNull().default("General Affairs"),
  status: complaintStatusEnum("status").notNull().default("SUBMITTED"),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const statusHistoryTable = pgTable("status_history", {
  id: serial("id").primaryKey(),
  complaintId: integer("complaint_id")
    .notNull()
    .references(() => complaintsTable.id),
  status: complaintStatusEnum("status").notNull(),
  note: text("note"),
  changedAt: timestamp("changed_at").defaultNow().notNull(),
});

export const insertComplaintSchema = createInsertSchema(complaintsTable).omit({
  id: true,
  category: true,
  priority: true,
  department: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertComplaint = z.infer<typeof insertComplaintSchema>;
export type Complaint = typeof complaintsTable.$inferSelect;
export type StatusHistory = typeof statusHistoryTable.$inferSelect;
