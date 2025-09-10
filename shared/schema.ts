import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const transactionForms = pgTable("transaction_forms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  agentSelect: text("agent_select").notNull(),
  clientName: text("client_name").notNull(),
  buyerOrSeller: text("buyer_or_seller").notNull(),
  transactionType: text("transaction_type").notNull(),
  listingType: text("listing_type").notNull(),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const insertTransactionFormSchema = createInsertSchema(transactionForms).omit({
  id: true,
  createdAt: true,
});

export type InsertTransactionForm = z.infer<typeof insertTransactionFormSchema>;
export type TransactionForm = typeof transactionForms.$inferSelect;
