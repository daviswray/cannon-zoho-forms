import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTransactionFormSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Transaction form routes
  
  // Submit a new transaction form
  app.post("/api/transaction-forms", async (req, res) => {
    try {
      const validatedData = insertTransactionFormSchema.parse(req.body);
      const form = await storage.createTransactionForm(validatedData);
      res.status(201).json(form);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation failed", details: error.errors });
      } else {
        console.error("Error creating transaction form:", error);
        res.status(500).json({ error: "Failed to create transaction form" });
      }
    }
  });

  // Get all transaction forms
  app.get("/api/transaction-forms", async (req, res) => {
    try {
      const forms = await storage.getAllTransactionForms();
      res.json(forms);
    } catch (error) {
      console.error("Error fetching transaction forms:", error);
      res.status(500).json({ error: "Failed to fetch transaction forms" });
    }
  });

  // Get a specific transaction form by ID
  app.get("/api/transaction-forms/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const form = await storage.getTransactionForm(id);
      
      if (!form) {
        res.status(404).json({ error: "Transaction form not found" });
        return;
      }
      
      res.json(form);
    } catch (error) {
      console.error("Error fetching transaction form:", error);
      res.status(500).json({ error: "Failed to fetch transaction form" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
