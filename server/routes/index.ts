// server/routes/index.ts
import express from "express";
import surveyRouter from "./survey"; // <-- imports the "router" from survey.ts

export function registerRoutes(app: express.Express) {
  app.use("/api", surveyRouter); // mounts all routes in survey.ts under /api
  return app;
}
