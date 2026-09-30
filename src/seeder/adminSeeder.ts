import { faker } from "@faker-js/faker";
import * as bcrypt from "bcrypt"
import { db } from "../db";
import { usersTable } from "../db/schema/schema";
import { randomUUID } from "node:crypto";

async function seed(){

   const password = "admin@123"

   const hashPassword = await bcrypt.hash(password,12)

   const admin = await db.insert(usersTable)
   .values({
      id: randomUUID(),
      name: faker.person.fullName(),
      email: faker.internet.email().toLocaleLowerCase(),
      password:hashPassword,
      role:"admin"
   }).returning()

   console.log("Admin seeded successfully")
   console.log(admin)

}

seed().catch((error:any)=>{
   console.error("admin seed fail",error)
   process.exit(1)
}).finally(()=>{
   process.exit(0)
})