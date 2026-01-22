import { 
  type SurveyResponse, 
  type InsertSurveyResponse,
  type Product,
  type InsertProduct
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createSurveyResponse(response: InsertSurveyResponse): Promise<SurveyResponse>;
  getSurveyResponseBySessionId(sessionId: string): Promise<SurveyResponse | undefined>;
  
  getAllProducts(): Promise<Product[]>;
  getProductsByIds(ids: string[]): Promise<Product[]>;
  seedProducts(products: InsertProduct[]): Promise<void>;
}

export class MemStorage implements IStorage {
  private surveyResponses: Map<string, SurveyResponse>;
  private products: Map<string, Product>;

  constructor() {
    this.surveyResponses = new Map();
    this.products = new Map();
  }

  async createSurveyResponse(insertResponse: InsertSurveyResponse): Promise<SurveyResponse> {
    const id = randomUUID();
    const response: SurveyResponse = {
      ...insertResponse,
      id,
      createdAt: new Date(),
    };
    this.surveyResponses.set(id, response);
    return response;
  }

  async getSurveyResponseBySessionId(sessionId: string): Promise<SurveyResponse | undefined> {
    return Array.from(this.surveyResponses.values())
      .filter(response => response.sessionId === sessionId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductsByIds(ids: string[]): Promise<Product[]> {
    return ids
      .map(id => this.products.get(id))
      .filter((product): product is Product => product !== undefined);
  }

  async seedProducts(products: InsertProduct[]): Promise<void> {
    // Only seed if products are empty (idempotent)
    if (this.products.size === 0) {
      for (const product of products) {
        const id = randomUUID();
        this.products.set(id, { ...product, id });
      }
    }
  }
}

export const storage = new MemStorage();
