import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
   schema: "./src/db/schema/index.ts",
   out: "./drizzle",
   dialect: "postgresql",
   dbCredentials: {
      url: "postgresql://postgres:iotechhub@localhost:5432/oasiscardb",
   },
});