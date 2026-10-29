import { db } from "../../db"
import { vehicleCategories, vehicleMakes } from "../../db/schema"
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

export const createMakeService = async (name:string, slug:string)=>{
   try {
      const data = await db.insert(vehicleMakes).values({
         id:randomUUID(),
         name:name,
         slug:slug
      }).returning()
      return data
   } catch (error:any) {
      console.log(error.message)
   }
}

export const getCarMakeService = async () => {
   try {
      const data = await db.select().from(vehicleMakes)
      return data
   } catch (error: any) {
      console.log(error.message)
   }
}

