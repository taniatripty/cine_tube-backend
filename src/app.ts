import express, { Application, Request, Response } from "express";

const app: Application = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("welcome to cine-tube-backend API");
});

export default app;