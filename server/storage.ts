import { type User, type InsertUser, type TransactionForm, type InsertTransactionForm } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Transaction form operations
  createTransactionForm(form: InsertTransactionForm): Promise<TransactionForm>;
  getTransactionForm(id: string): Promise<TransactionForm | undefined>;
  getAllTransactionForms(): Promise<TransactionForm[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private transactionForms: Map<string, TransactionForm>;

  constructor() {
    this.users = new Map();
    this.transactionForms = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createTransactionForm(insertForm: InsertTransactionForm): Promise<TransactionForm> {
    const id = randomUUID();
    const form: TransactionForm = {
      ...insertForm,
      id,
      createdAt: new Date(),
    };
    this.transactionForms.set(id, form);
    return form;
  }

  async getTransactionForm(id: string): Promise<TransactionForm | undefined> {
    return this.transactionForms.get(id);
  }

  async getAllTransactionForms(): Promise<TransactionForm[]> {
    return Array.from(this.transactionForms.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }
}

export const storage = new MemStorage();
