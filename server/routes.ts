import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSurveyResponseSchema, type Product } from "@shared/schema";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";

// Seed initial product data
async function seedInitialData() {
  const products = [
    {
      name: "Organic Cotton Tampons",
      description: "Super-soft, 100% organic cotton tampons for comfortable all-day protection. Perfect for moderate to heavy flow.",
      price: "$12.99",
      category: "Tampons",
      features: ["Organic", "Eco-friendly", "Leak-proof"],
      imageUrl: "/api/placeholder-product.png",
      tags: ["tampon", "organic", "eco-friendly", "moderate-flow", "heavy-flow", "comfort", "leak-proof", "fragrance-free"],
    },
    {
      name: "Ultra-Thin Pads",
      description: "Discreet and ultra-absorbent pads with a breathable top layer for all-day comfort.",
      price: "$9.99",
      category: "Pads",
      features: ["Comfortable", "Breathable", "All-day"],
      imageUrl: "/api/placeholder-product.png",
      tags: ["pad", "breathable", "comfort", "light-flow", "moderate-flow", "discreet", "leak-proof", "fragrance-free"],
    },
    {
      name: "Silicone Menstrual Cup",
      description: "Medical-grade silicone cup that's reusable, eco-friendly, and lasts up to 12 hours.",
      price: "$34.99",
      category: "Cups",
      features: ["Reusable", "12hr wear", "Sustainable"],
      imageUrl: "/api/placeholder-product.png",
      tags: ["cup", "eco-friendly", "reusable", "active", "sustainable", "heavy-flow", "leak-proof", "latex-free"],
    },
    {
      name: "Period Underwear",
      description: "Comfortable underwear with built-in absorbent layers that are machine washable and leak-proof.",
      price: "$29.99",
      category: "Underwear",
      features: ["Machine wash", "Leak-proof", "Comfortable"],
      imageUrl: "/api/placeholder-product.png",
      tags: ["underwear", "reusable", "comfort", "eco-friendly", "light-flow", "moderate-flow", "leak-proof", "fragrance-free"],
    },
    {
      name: "Menstrual Disc",
      description: "Flexible disc that sits at the base of your cervix for mess-free wear up to 12 hours.",
      price: "$15.99",
      category: "Discs",
      features: ["Flexible", "12hr wear", "Mess-free"],
      imageUrl: "/api/placeholder-product.png",
      tags: ["disc", "flexible", "active", "moderate-flow", "heavy-flow"],
    },
    {
      name: "Daily Liners",
      description: "Thin, comfortable liners for light days and daily freshness with breathable materials.",
      price: "$7.99",
      category: "Liners",
      features: ["Breathable", "Thin", "Daily use"],
      imageUrl: "/api/placeholder-product.png",
      tags: ["liner", "breathable", "light-flow", "discreet", "daily-use"],
    },
    {
      name: "Bamboo Fiber Pads",
      description: "Eco-friendly pads made from sustainable bamboo fiber, naturally antibacterial and hypoallergenic.",
      price: "$14.99",
      category: "Pads",
      features: ["Bamboo", "Hypoallergenic", "Antibacterial"],
      imageUrl: "/api/placeholder-product.png",
      tags: ["pad", "eco-friendly", "organic", "hypoallergenic", "moderate-flow", "sustainable", "fragrance-free", "latex-free"],
    },
    {
      name: "Applicator-Free Tampons",
      description: "Compact tampons without applicators for minimal waste and maximum portability.",
      price: "$10.99",
      category: "Tampons",
      features: ["Compact", "Eco-conscious", "Travel-friendly"],
      imageUrl: "/api/placeholder-product.png",
      tags: ["tampon", "eco-friendly", "discreet", "light-flow", "moderate-flow", "budget-friendly"],
    },
  ];

  await storage.seedProducts(products);
}

// Recommendation algorithm based on survey answers
async function getRecommendations(answers: Record<string, any>) {
  const products = await storage.getAllProducts();
  
  {
    // Build a scoring system based on survey answers
    const scoredProducts = products.map(product => {
      let score = 0;
      const reasons: string[] = [];

      // Flow-based matching
      if (answers.flow) {
        const flowTag = answers.flow === 'light' ? 'light-flow' : 
                       answers.flow === 'moderate' ? 'moderate-flow' :
                       answers.flow === 'heavy' ? 'heavy-flow' : null;
        if (flowTag && product.tags.includes(flowTag)) {
          score += 10;
          reasons.push(`Perfect for ${answers.flow} flow`);
        }
      }

      // Lifestyle/activity matching
      if (answers.lifestyle === 'active' && product.tags.includes('active')) {
        score += 8;
        reasons.push('Great for active lifestyles');
      } else if (answers.lifestyle === 'moderate' && (product.tags.includes('comfort') || product.tags.includes('breathable'))) {
        score += 5;
        reasons.push('Suitable for moderate activity');
      } else if (answers.lifestyle === 'mixed' && product.tags.includes('leak-proof')) {
        score += 6;
        reasons.push('Reliable for varied routines');
      }
      
      // Handle "varies" flow by boosting moderate options
      if (answers.flow === 'varies' && product.tags.includes('moderate-flow')) {
        score += 8;
        reasons.push('Versatile for changing flow');
      }

      // Preferences matching
      if (answers.preferences && Array.isArray(answers.preferences)) {
        const prefs = answers.preferences as string[];
        
        if (prefs.includes('organic') && product.tags.includes('organic')) {
          score += 7;
          reasons.push('Made with organic materials');
        }
        if (prefs.includes('eco') && product.tags.includes('eco-friendly')) {
          score += 7;
          reasons.push('Eco-friendly choice');
        }
        if (prefs.includes('comfort') && product.tags.includes('comfort')) {
          score += 6;
          reasons.push('Designed for comfort');
        }
        if (prefs.includes('discreet') && product.tags.includes('discreet')) {
          score += 6;
          reasons.push('Discreet and portable');
        }
        if (prefs.includes('cost') && product.tags.includes('budget-friendly')) {
          score += 5;
          reasons.push('Budget-friendly option');
        }
        if (prefs.includes('protection') && product.tags.includes('leak-proof')) {
          score += 7;
          reasons.push('Maximum leak protection');
        }
      }

      // Product type matching
      if (answers.products && Array.isArray(answers.products)) {
        const productTypes = answers.products as string[];
        
        if (productTypes.includes('tampons') && product.tags.includes('tampon')) {
          score += 15;
        }
        if (productTypes.includes('pads') && product.tags.includes('pad')) {
          score += 15;
        }
        if (productTypes.includes('cups') && product.tags.includes('cup')) {
          score += 15;
        }
        if (productTypes.includes('disc') && product.tags.includes('disc')) {
          score += 15;
        }
        if (productTypes.includes('underwear') && product.tags.includes('underwear')) {
          score += 15;
        }
        if (productTypes.includes('liners') && product.tags.includes('liner')) {
          score += 15;
        }
      }

      // Sensitivity filtering and requirements
      if (answers.sensitivities && Array.isArray(answers.sensitivities)) {
        const sensitivities = answers.sensitivities as string[];
        
        if (sensitivities.includes('cotton') && product.tags.includes('hypoallergenic')) {
          score += 5;
          reasons.push('Hypoallergenic materials');
        }
        if (sensitivities.includes('fragrance') && product.tags.includes('fragrance-free')) {
          score += 5;
          reasons.push('Fragrance-free');
        }
        if (sensitivities.includes('latex') && product.tags.includes('latex-free')) {
          score += 5;
          reasons.push('Latex-free');
        }
        
        // Penalize products that don't meet sensitivity requirements
        if (sensitivities.includes('fragrance') && !product.tags.includes('fragrance-free')) {
          score -= 10;
        }
        if (sensitivities.includes('latex') && !product.tags.includes('latex-free')) {
          score -= 10;
        }
      }

      return { 
        ...product, 
        score, 
        matchReasons: reasons.slice(0, 3) // Top 3 reasons
      };
    });

    // Sort by score and return top matches
    return scoredProducts
      .filter(p => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  await setupAuth(app);
  registerAuthRoutes(app);

  // Seed products on startup
  await seedInitialData();

  // Submit survey response
  app.post("/api/survey-responses", async (req, res) => {
    try {
      const validated = insertSurveyResponseSchema.parse(req.body);
      const response = await storage.createSurveyResponse(validated);
      res.json(response);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get personalized recommendations
  app.get("/api/recommendations", async (req, res) => {
    try {
      const { sessionId } = req.query;
      
      if (!sessionId || typeof sessionId !== 'string') {
        return res.status(400).json({ error: "sessionId is required" });
      }

      const surveyResponse = await storage.getSurveyResponseBySessionId(sessionId);
      
      if (!surveyResponse) {
        return res.status(404).json({ error: "No survey found for this session" });
      }

      const recommendations = await getRecommendations(surveyResponse.answers as Record<string, any>);
      res.json(recommendations);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get all products
  app.get("/api/products", async (_req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
