import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "../storage.js";
import { FubClient } from "./lib/fubClient";
import { transactionFormSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const fubClient = new FubClient();

  // Get FUB agents
  app.get('/api/agents', async (req, res) => {
    try {
      const agents = await fubClient.getAgents();
      res.json({ success: true, data: agents });
    } catch (error) {
      console.error('Error fetching agents:', error);
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch agents from Follow-up Boss'
      });
    }
  });

  // Get FUB deals based on conditions
  app.get('/api/deals', async (req, res) => {
    try {
      const { buyerOrSeller, transactionType } = req.query;
      
      // Validate combination
      if (!buyerOrSeller || !transactionType) {
        return res.status(400).json({ 
          success: false, 
          error: 'Both buyerOrSeller and transactionType are required'
        });
      }
      
      // Validate valid combinations
      const validCombinations: Record<string, string[]> = {
        'buyer': ['bba', 'uc'],
        'seller': ['la', 'uc']
      };
      
      if (!validCombinations[buyerOrSeller as string]?.includes(transactionType as string)) {
        return res.status(400).json({
          success: false,
          error: `Invalid combination: ${buyerOrSeller} with ${transactionType}`
        });
      }

      const deals = await fubClient.getDeals({
        buyerOrSeller: buyerOrSeller as 'buyer' | 'seller',
        transactionType: transactionType as 'bba' | 'la' | 'uc'
      });
      
      res.json({ success: true, data: deals });
    } catch (error) {
      console.error('Error fetching deals:', error);
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch deals from Follow-up Boss'
      });
    }
  });

  // Submit transaction form
  app.post('/api/transactions', async (req, res) => {
    try {
      const validatedData = transactionFormSchema.parse(req.body);
      
      // Create event in FUB
      const nameParts = validatedData.clientName.trim().split(' ');
      
      // Create event with deal and agent association
      const eventData = {
        source: 'Transaction Form Widget',
        type: 'Transaction Form Submission',
        message: `Client: ${validatedData.clientName}, Type: ${validatedData.buyerOrSeller}, Transaction: ${validatedData.transactionType}, Listing: ${validatedData.listingType}`,
        dealId: validatedData.fubDealId,
        agentId: validatedData.agentId,
        person: {
          firstName: nameParts[0] || validatedData.clientName,
          lastName: nameParts.slice(1).join(' ') || '',
        }
      };

      const fubEvent = await fubClient.createEvent(eventData);
      
      // Also add a note to the specific deal
      try {
        await fubClient.addDealNote(
          validatedData.fubDealId,
          `Transaction form submitted for ${validatedData.clientName}. Type: ${validatedData.buyerOrSeller}, Transaction: ${validatedData.transactionType}, Listing: ${validatedData.listingType}`,
          validatedData.agentId
        );
      } catch (noteError) {
        console.warn('Failed to add deal note:', noteError);
        // Don't fail the entire transaction if note creation fails
      }
      
      res.json({ 
        success: true, 
        data: { 
          transactionId: fubEvent.id,
          message: 'Transaction submitted successfully'
        }
      });
    } catch (error) {
      console.error('Error submitting transaction:', error);
      res.status(400).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to submit transaction'
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
