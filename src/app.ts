import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import { indexRoutes } from "../src/app/routes/index";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";

const app: Application = express();
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/v1", indexRoutes);


app.get("/", (req: Request, res: Response) => {
  res.send("welcome to cine-tube-backend API");
});

app.use(notFound);
app.use(globalErrorHandler);

export default app;