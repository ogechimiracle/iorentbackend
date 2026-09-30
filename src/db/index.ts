// import { drizzle } from "drizzle-orm/postgres-js";
// import postgres from "postgres";
// import "dotenv/config";
// import * as schema from "./schema/schema";

// console.log("DATABASE_URL:", process.env.DATABASE_URL);

// const connectionString = process.env.DATABASE_URL!;
// const client = postgres(connectionString);

// export const db = drizzle(client, { schema });

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
export const db = drizzle(process.env.DATABASE_URL!);