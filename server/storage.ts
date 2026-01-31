import {
  type SurveyResponse,
  type InsertSurveyResponse,
  type Product,
  type InsertProduct,
  surveyResponses,
  products,
} from "@shared/schema";
import { db } from "./db";
import { desc, eq, inArray } from "drizzle-orm";

export interface IStorage {
  createSurveyResponse(response: InsertSurveyResponse): Promise<SurveyResponse>;
  getSurveyResponseBySessionId(sessionId: string): Promise<SurveyResponse | undefined>;

  getAllProducts(): Promise<Product[]>;
  getProductsByIds(ids: string[]): Promise<Product[]>;
  seedProducts(products: InsertProduct[]): Promise<void>;
}

export class PgStorage implements IStorage {

  async createSurveyResponse(
    insertResponse: InsertSurveyResponse
  ): Promise<SurveyResponse> {
    const [row] = await db
      .insert(surveyResponses)
      .values(insertResponse)
      .returning();

    return row;
  }

  async getSurveyResponseBySessionId(
    sessionId: string
  ): Promise<SurveyResponse | undefined> {
    const rows = await db
      .select()
      .from(surveyResponses)
      .where(eq(surveyResponses.sessionId, sessionId))
      .orderBy(desc(surveyResponses.createdAt))
      .limit(1);

    return rows[0];
  }

  async getAllProducts(): Promise<Product[]> {
    return db.select().from(products);
  }

  async getProductsByIds(ids: string[]): Promise<Product[]> {
    if (ids.length === 0) return [];

    return db
      .select()
      .from(products)
      .where(inArray(products.id, ids));
  }

  async seedProducts(seed: InsertProduct[]): Promise<void> {
    const existing = await db.select().from(products).limit(1);
    if (existing.length > 0) return;

    await db.insert(products).values(seed);
  }
}

export const storage = new PgStorage();
