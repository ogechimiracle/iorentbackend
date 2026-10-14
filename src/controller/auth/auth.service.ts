
import { users} from "../../db/schema/identity";
import {db} from "../../db"
import { eq, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import * as bcrypt from "bcrypt"



export const CreateUserService = async (data:any)=>{
     try {
           const [newUser] = await db.insert(users).values({
                 ...data,
                 id: randomUUID(),
                 passwordHash: await bcrypt.hash(data.password, 12)
           }).returning()

           const dt = {
            id: newUser?.id,
            name: newUser?.name,
            email: newUser?.email,
            role: newUser?.role
           }

           return dt
     } catch (error) {
      console.error(error)
      throw error
     }
}


export const getUser = async(email:string)=>{
      try {
            const [User] = await db.select().from(users).where(eq(users.email, email)).limit(1)
            return User
      } catch (error) {
          console.error(error)  
          throw error
      }
}