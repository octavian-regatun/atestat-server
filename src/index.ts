import * as dotenv from "dotenv";
dotenv.config();

import express, { Application, Request, Response } from "express";
import { autocomplete } from "./routes/autocomplete";
import { forecast } from "./routes/forecast";
import cors from "cors";

(async () => {
  const app: Application = express();

  const PORT = process.env.PORT || 3001;

  app.get("/", (req, res) => {
    res.send("server is working");
  });

  app.use(cors());
  app.use("/forecast", forecast);
  app.use("/autocomplete", autocomplete);

  app.listen(PORT, () => {
    console.log(`app is listening on port ${PORT}`);
  });
})();
