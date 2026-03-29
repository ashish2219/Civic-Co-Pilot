import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const schemesTable = pgTable("schemes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  eligibleRoles: text("eligible_roles").notNull(),
  benefits: text("benefits").notNull(),
  howToApply: text("how_to_apply").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSchemeSchema = createInsertSchema(schemesTable).omit({ id: true, createdAt: true });
export type InsertScheme = z.infer<typeof insertSchemeSchema>;
export type Scheme = typeof schemesTable.$inferSelect;
