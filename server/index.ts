import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import session from "express-session";
import connectPg from "connect-pg-simple";
import passport from "passport";
import "./auth"; // This imports your server/auth.ts logic
import surveyRouter from "./routes/survey";


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PostgresStore = connectPg(session);
app.use(session({
  store: new PostgresStore({ 
    conString: process.env.DATABASE_URL,
    tableName: 'sessions' // Matches your shared/models/auth.ts
  }),
  secret: process.env.SESSION_SECRET || "fallback_secret",
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    secure: process.env.NODE_ENV === "production", 
    sameSite: "lax", // helps with cross-domain redirects (Google OAuth)
  }
}));


app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;


  
  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

app.use("/api", surveyRouter);

(async () => {

app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/api/auth/google/callback", 
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => res.redirect("/account")
);

  app.get("/api/auth/google-survey", passport.authenticate("google", { scope: ["profile", "email"] }));
  
  app.get("/api/auth/google-survey/callback", 
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => res.redirect("/survey")
  ); 


app.get("/api/user", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json(null);
  }

  const user = req.user as any;

res.json({
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  googleId: user.googleId,
});

});


  app.get("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.redirect("/");
    });
  });

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
