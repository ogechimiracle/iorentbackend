import { db } from "../../db"
import { vehicleCategories } from "../../db/schema"
import { randomUUID } from "node:crypto";


export const addCategoryService = async(name:string, slug:string, description:string)=>{
   try {
      const data = await db.insert(vehicleCategories).values({
         id: randomUUID(),
         name: name,
         slug:slug,
         description:description
      }).returning()
      return data
   } catch (error:any) {
      console.log(error.message)
   }
}


export const getCategoryService = async ()=>{
   try {
      const data = await db.select().from(vehicleCategories)
      return data
   } catch (error:any) {
      console.log(error.message)
   }
}

