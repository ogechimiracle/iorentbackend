
import { usersTable, type NewUser, type User } from "../../db/schema/schema";
import {db} from "../../db"
import { eq, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import * as bcrypt from "bcrypt"



export const CreateUserService = async (data:NewUser)=>{
     try {
           const [newUser] = await db.insert(usersTable).values({
                 ...data,
                 id: randomUUID(),
                 password: await bcrypt.hash(data.password, 12)
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
            const [User] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1)
            return User
      } catch (error) {
          console.error(error)  
          throw error
      }
}