// server/routes/index.ts
import express from "express";
import surveyRouter from "./survey";
import usersRouter from "./users"; 

export function registerRoutes(app: express.Express) {
  app.use("/api", surveyRouter);
  app.use("/api", usersRouter);
  return app;
}