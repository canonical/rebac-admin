import { readFileSync } from "fs";
import path from "path";

import { createMiddleware } from "@mswjs/http-middleware";
import cors from "cors";
import { parse } from "dotenv";
import express from "express";
import ip from "ip";

import { handlers } from "../src/mocks/handlers";

const env = parse(readFileSync(path.resolve(process.cwd(), ".env")));

const app = express();

app.use(cors());
app.use(createMiddleware(...handlers));

app.listen(env.API_PORT, () => {
  console.log("ReBAC Admin mock API running on:");
  console.log("");
  console.log(`Local:   http://localhost:${env.API_PORT}/`);
  console.log(`Network: http://${ip.address()}:${env.API_PORT}/`);
  console.log("");
  console.log("Press ctrl+c to stop the server.");
  console.log("");
});
