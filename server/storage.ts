import {
  type SurveyResponse,
  type InsertSurveyResponse,
  type Product,
  type InsertProduct,
  surveyResponses,
  products,
  users,
  peopleToNotify,
} from "@shared/schema";
import { db } from "./db";
import { desc, eq, inArray } from "drizzle-orm";

export interface IStorage {
  createSurveyResponse(response: InsertSurveyResponse): Promise<SurveyResponse>;
  getSurveyResponseBySessionId(sessionId: string): Promise<SurveyResponse | undefined>;
  getAllProducts(): Promise<Product[]>;
  getProductsByIds(ids: string[]): Promise<Product[]>;
  seedProducts(products: InsertProduct[]): Promise<void>;
  deletePeopleToNotifyByUserId(userId: string): Promise<void>;
  deleteSurveyResponsesByUserId(userId: string): Promise<void>;
  deleteUser(userId: string): Promise<void>;
}

export class PgStorage implements IStorage {

  // Use db (imported) not this.db
  async deletePeopleToNotifyByUserId(userId: string): Promise<void> {
    await db.delete(peopleToNotify).where(eq(peopleToNotify.userId, userId));
  }

  async deleteSurveyResponsesByUserId(userId: string): Promise<void> {
    await db.delete(surveyResponses).where(eq(surveyResponses.userId, userId));
  }

  async deleteUser(userId: string): Promise<void> {
    await db.delete(users).where(eq(users.id, userId));
  }

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