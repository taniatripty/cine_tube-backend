import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import { indexRoutes } from "../src/app/routes/index";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import cors from "cors";
import { envVars } from "./app/config/env";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import path from "node:path";


const app: Application = express();
app.use(cookieParser());

app.set("view engine", "ejs");

app.set(
  "views",
  path.resolve(process.cwd(), "src/app/templates"),
);


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: [
      envVars.FRONTEND_URL,
      envVars.BETTER_AUTH_URL,
      "http://localhost:3000",
      "http://localhost:5000",
    ],

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  }),
);

app.use("/api/v1", indexRoutes);


app.use(
  "/api/auth",
  toNodeHandler(auth),
);




app.get("/", (req: Request, res: Response) => {
  res.send("welcome to cine-tube-backend API");
});

app.use(notFound);
app.use(globalErrorHandler);

export default app;