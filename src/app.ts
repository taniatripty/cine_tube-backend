import express, { Application, Request, Response } from "express";
import { indexRoutes } from "../src/app/routes/index";

const app: Application = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/v1", indexRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("welcome to cine-tube-backend API");
});

export default app;