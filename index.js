var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  surveyResponses;
  products;
  constructor() {
    this.surveyResponses = /* @__PURE__ */ new Map();
    this.products = /* @__PURE__ */ new Map();
  }
  async createSurveyResponse(insertResponse) {
    const id = randomUUID();
    const response = {
      ...insertResponse,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.surveyResponses.set(id, response);
    return response;
  }
  async getSurveyResponseBySessionId(sessionId) {
    return Array.from(this.surveyResponses.values()).filter((response) => response.sessionId === sessionId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
  }
  async getAllProducts() {
    return Array.from(this.products.values());
  }
  async getProductsByIds(ids) {
    return ids.map((id) => this.products.get(id)).filter((product) => product !== void 0);
  }
  async seedProducts(products2) {
    if (this.products.size === 0) {
      for (const product of products2) {
        const id = randomUUID();
        this.products.set(id, { ...product, id });
      }
    }
  }
};
var storage = new MemStorage();

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  insertProductSchema: () => insertProductSchema,
  insertSurveyResponseSchema: () => insertSurveyResponseSchema,
  products: () => products,
  sessions: () => sessions,
  surveyResponses: () => surveyResponses,
  users: () => users
});
import { sql as sql2 } from "drizzle-orm";
import { pgTable as pgTable2, text, varchar as varchar2, timestamp as timestamp2, jsonb as jsonb2 } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// shared/models/auth.ts
import { sql } from "drizzle-orm";
import { index, jsonb, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// shared/schema.ts
var surveyResponses = pgTable2("survey_responses", {
  id: varchar2("id").primaryKey().default(sql2`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  answers: jsonb2("answers").notNull(),
  createdAt: timestamp2("created_at").defaultNow().notNull()
});
var insertSurveyResponseSchema = createInsertSchema(surveyResponses).omit({
  id: true,
  createdAt: true
});
var products = pgTable2("products", {
  id: varchar2("id").primaryKey().default(sql2`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: text("price").notNull(),
  category: text("category").notNull(),
  features: text("features").array().notNull(),
  imageUrl: text("image_url").notNull(),
  tags: text("tags").array().notNull()
});
var insertProductSchema = createInsertSchema(products).omit({
  id: true
});

// server/replit_integrations/auth/replitAuth.ts
import * as client from "openid-client";
import { Strategy } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/replit_integrations/auth/storage.ts
import { eq } from "drizzle-orm";
var AuthStorage = class {
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async upsertUser(userData) {
    const [user] = await db.insert(users).values(userData).onConflictDoUpdate({
      target: users.id,
      set: {
        ...userData,
        updatedAt: /* @__PURE__ */ new Date()
      }
    }).returning();
    return user;
  }
};
var authStorage = new AuthStorage();

// server/replit_integrations/auth/replitAuth.ts
var getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID
    );
  },
  { maxAge: 3600 * 1e3 }
);
function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions"
  });
  return session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl
    }
  });
}
function updateUserSession(user, tokens) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}
async function upsertUser(claims) {
  await authStorage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"]
  });
}
async function setupAuth(app2) {
  app2.set("trust proxy", 1);
  app2.use(getSession());
  app2.use(passport.initialize());
  app2.use(passport.session());
  const config = await getOidcConfig();
  const verify = async (tokens, verified) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };
  const registeredStrategies = /* @__PURE__ */ new Set();
  const ensureStrategy = (domain) => {
    const strategyName = `replitauth:${domain}`;
    if (!registeredStrategies.has(strategyName)) {
      const strategy = new Strategy(
        {
          name: strategyName,
          config,
          scope: "openid email profile offline_access",
          callbackURL: `https://${domain}/api/callback`
        },
        verify
      );
      passport.use(strategy);
      registeredStrategies.add(strategyName);
    }
  };
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((user, cb) => cb(null, user));
  app2.get("/api/login", (req, res, next) => {
    ensureStrategy(req.hostname);
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"]
    })(req, res, next);
  });
  app2.get("/api/callback", (req, res, next) => {
    ensureStrategy(req.hostname);
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login"
    })(req, res, next);
  });
  app2.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`
        }).href
      );
    });
  });
}
var isAuthenticated = async (req, res, next) => {
  const user = req.user;
  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const now = Math.floor(Date.now() / 1e3);
  if (now <= user.expires_at) {
    return next();
  }
  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

// server/replit_integrations/auth/routes.ts
function registerAuthRoutes(app2) {
  app2.get("/api/auth/user", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await authStorage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
}

// server/routes.ts
async function seedInitialData() {
  const products2 = [
    {
      name: "Organic Cotton Tampons",
      description: "Super-soft, 100% organic cotton tampons for comfortable all-day protection. Perfect for moderate to heavy flow.",
      price: "$12.99",
      category: "Tampons",
      features: ["Organic", "Eco-friendly", "Leak-proof"],
      imageUrl: "/api/placeholder-product.png",
      tags: ["tampon", "organic", "eco-friendly", "moderate-flow", "heavy-flow", "comfort", "leak-proof", "fragrance-free"]
    },
    {
      name: "Ultra-Thin Pads",
      description: "Discreet and ultra-absorbent pads with a breathable top layer for all-day comfort.",
      price: "$9.99",
      category: "Pads",
      features: ["Comfortable", "Breathable", "All-day"],
      imageUrl: "/api/placeholder-product.png",
      tags: ["pad", "breathable", "comfort", "light-flow", "moderate-flow", "discreet", "leak-proof", "fragrance-free"]
    },
    {
      name: "Silicone Menstrual Cup",
      description: "Medical-grade silicone cup that's reusable, eco-friendly, and lasts up to 12 hours.",
      price: "$34.99",
      category: "Cups",
      features: ["Reusable", "12hr wear", "Sustainable"],
      imageUrl: "/api/placeholder-product.png",
      tags: ["cup", "eco-friendly", "reusable", "active", "sustainable", "heavy-flow", "leak-proof", "latex-free"]
    },
    {
      name: "Period Underwear",
      description: "Comfortable underwear with built-in absorbent layers that are machine washable and leak-proof.",
      price: "$29.99",
      category: "Underwear",
      features: ["Machine wash", "Leak-proof", "Comfortable"],
      imageUrl: "/api/placeholder-product.png",
      tags: ["underwear", "reusable", "comfort", "eco-friendly", "light-flow", "moderate-flow", "leak-proof", "fragrance-free"]
    },
    {
      name: "Menstrual Disc",
      description: "Flexible disc that sits at the base of your cervix for mess-free wear up to 12 hours.",
      price: "$15.99",
      category: "Discs",
      features: ["Flexible", "12hr wear", "Mess-free"],
      imageUrl: "/api/placeholder-product.png",
      tags: ["disc", "flexible", "active", "moderate-flow", "heavy-flow"]
    },
    {
      name: "Daily Liners",
      description: "Thin, comfortable liners for light days and daily freshness with breathable materials.",
      price: "$7.99",
      category: "Liners",
      features: ["Breathable", "Thin", "Daily use"],
      imageUrl: "/api/placeholder-product.png",
      tags: ["liner", "breathable", "light-flow", "discreet", "daily-use"]
    },
    {
      name: "Bamboo Fiber Pads",
      description: "Eco-friendly pads made from sustainable bamboo fiber, naturally antibacterial and hypoallergenic.",
      price: "$14.99",
      category: "Pads",
      features: ["Bamboo", "Hypoallergenic", "Antibacterial"],
      imageUrl: "/api/placeholder-product.png",
      tags: ["pad", "eco-friendly", "organic", "hypoallergenic", "moderate-flow", "sustainable", "fragrance-free", "latex-free"]
    },
    {
      name: "Applicator-Free Tampons",
      description: "Compact tampons without applicators for minimal waste and maximum portability.",
      price: "$10.99",
      category: "Tampons",
      features: ["Compact", "Eco-conscious", "Travel-friendly"],
      imageUrl: "/api/placeholder-product.png",
      tags: ["tampon", "eco-friendly", "discreet", "light-flow", "moderate-flow", "budget-friendly"]
    }
  ];
  await storage.seedProducts(products2);
}
async function getRecommendations(answers) {
  const products2 = await storage.getAllProducts();
  {
    const scoredProducts = products2.map((product) => {
      let score = 0;
      const reasons = [];
      if (answers.flow) {
        const flowTag = answers.flow === "light" ? "light-flow" : answers.flow === "moderate" ? "moderate-flow" : answers.flow === "heavy" ? "heavy-flow" : null;
        if (flowTag && product.tags.includes(flowTag)) {
          score += 10;
          reasons.push(`Perfect for ${answers.flow} flow`);
        }
      }
      if (answers.lifestyle === "active" && product.tags.includes("active")) {
        score += 8;
        reasons.push("Great for active lifestyles");
      } else if (answers.lifestyle === "moderate" && (product.tags.includes("comfort") || product.tags.includes("breathable"))) {
        score += 5;
        reasons.push("Suitable for moderate activity");
      } else if (answers.lifestyle === "mixed" && product.tags.includes("leak-proof")) {
        score += 6;
        reasons.push("Reliable for varied routines");
      }
      if (answers.flow === "varies" && product.tags.includes("moderate-flow")) {
        score += 8;
        reasons.push("Versatile for changing flow");
      }
      if (answers.preferences && Array.isArray(answers.preferences)) {
        const prefs = answers.preferences;
        if (prefs.includes("organic") && product.tags.includes("organic")) {
          score += 7;
          reasons.push("Made with organic materials");
        }
        if (prefs.includes("eco") && product.tags.includes("eco-friendly")) {
          score += 7;
          reasons.push("Eco-friendly choice");
        }
        if (prefs.includes("comfort") && product.tags.includes("comfort")) {
          score += 6;
          reasons.push("Designed for comfort");
        }
        if (prefs.includes("discreet") && product.tags.includes("discreet")) {
          score += 6;
          reasons.push("Discreet and portable");
        }
        if (prefs.includes("cost") && product.tags.includes("budget-friendly")) {
          score += 5;
          reasons.push("Budget-friendly option");
        }
        if (prefs.includes("protection") && product.tags.includes("leak-proof")) {
          score += 7;
          reasons.push("Maximum leak protection");
        }
      }
      if (answers.products && Array.isArray(answers.products)) {
        const productTypes = answers.products;
        if (productTypes.includes("tampons") && product.tags.includes("tampon")) {
          score += 15;
        }
        if (productTypes.includes("pads") && product.tags.includes("pad")) {
          score += 15;
        }
        if (productTypes.includes("cups") && product.tags.includes("cup")) {
          score += 15;
        }
        if (productTypes.includes("disc") && product.tags.includes("disc")) {
          score += 15;
        }
        if (productTypes.includes("underwear") && product.tags.includes("underwear")) {
          score += 15;
        }
        if (productTypes.includes("liners") && product.tags.includes("liner")) {
          score += 15;
        }
      }
      if (answers.sensitivities && Array.isArray(answers.sensitivities)) {
        const sensitivities = answers.sensitivities;
        if (sensitivities.includes("cotton") && product.tags.includes("hypoallergenic")) {
          score += 5;
          reasons.push("Hypoallergenic materials");
        }
        if (sensitivities.includes("fragrance") && product.tags.includes("fragrance-free")) {
          score += 5;
          reasons.push("Fragrance-free");
        }
        if (sensitivities.includes("latex") && product.tags.includes("latex-free")) {
          score += 5;
          reasons.push("Latex-free");
        }
        if (sensitivities.includes("fragrance") && !product.tags.includes("fragrance-free")) {
          score -= 10;
        }
        if (sensitivities.includes("latex") && !product.tags.includes("latex-free")) {
          score -= 10;
        }
      }
      return {
        ...product,
        score,
        matchReasons: reasons.slice(0, 3)
        // Top 3 reasons
      };
    });
    return scoredProducts.filter((p) => p.score > 0).sort((a, b) => b.score - a.score).slice(0, 6);
  }
}
async function registerRoutes(app2) {
  await setupAuth(app2);
  registerAuthRoutes(app2);
  await seedInitialData();
  app2.post("/api/survey-responses", async (req, res) => {
    try {
      const validated = insertSurveyResponseSchema.parse(req.body);
      const response = await storage.createSurveyResponse(validated);
      res.json(response);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/recommendations", async (req, res) => {
    try {
      const { sessionId } = req.query;
      if (!sessionId || typeof sessionId !== "string") {
        return res.status(400).json({ error: "sessionId is required" });
      }
      const surveyResponse = await storage.getSurveyResponseBySessionId(sessionId);
      if (!surveyResponse) {
        return res.status(404).json({ error: "No survey found for this session" });
      }
      const recommendations = await getRecommendations(surveyResponse.answers);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/products", async (_req, res) => {
    try {
      const products2 = await storage.getAllProducts();
      res.json(products2);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  base: "/ThePeriodBox",
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
