import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
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

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Transaction Form Schema with conditional validation
export const transactionFormSchema = z.object({
  agentId: z.string().min(1, "Please select an agent"),
  clientName: z.string().min(2, "Client name must be at least 2 characters").max(100, "Client name is too long"),
  buyerOrSeller: z.enum(["buyer", "seller"], {
    required_error: "Please select buyer or seller",
  }),
  transactionType: z.enum(["bba", "la", "uc"], {
    required_error: "Please select a transaction type",
  }),
  listingType: z.enum(["listing", "lease"]).optional(),
  fubDealId: z.string().min(1, "Please select a FUB deal"),
}).superRefine((data, ctx) => {
  // Validate buyer/seller + transaction type combinations
  if (data.buyerOrSeller === 'buyer' && !['bba', 'uc'].includes(data.transactionType)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['transactionType'],
      message: 'Buyers can only have BBA or UC transaction types',
    });
  }
  if (data.buyerOrSeller === 'seller' && !['la', 'uc'].includes(data.transactionType)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['transactionType'],
      message: 'Sellers can only have LA or UC transaction types',
    });
  }
  
  // Listing type is required only for sellers with listing agreements
  if (data.buyerOrSeller === 'seller' && data.transactionType === 'la' && !data.listingType) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['listingType'],
      message: 'Listing type is required for listing agreements',
    });
  }
});

export type TransactionForm = z.infer<typeof transactionFormSchema>;

// FUB API Types
export interface FubAgent {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
}

export interface FubDeal {
  id: number;
  name: string;
  stage?: string;
  status?: string;
  type?: string;
}
