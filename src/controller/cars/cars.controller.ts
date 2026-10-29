
import type { Response, Request } from "express";
import { addCategoryService, getCategoryService, createMakeService, getCarMakeService } from "./cars.service";


export const CreateCarCategory = async(req:Request, res:Response)=>{
   try {
      const { name, slug, description } = req.body
      const data = await addCategoryService(name,slug,description)
      return res.status(200).json({message:"Category added successfully", data:data, status:true})
   } catch (error:any) {
      return res.status(200).json({status:false, messaga:error.message})
   }


}

export const getAllCategory = async (req:Request, res:Response)=>{
   try {
      const data =  await getCategoryService()
      return res.status(200).json({data:data, status:true})

   } catch (error:any) {
      return res.status(200).json({status:false, message:error.message})
   }
}

export const CreateCarMakes = async (req:Request, res:Response)=>{
   try {
      const {name, slug} = req.body
      const data = await createMakeService(name, slug)
      return res.status(200).json({status:true, message:"Car Makes created successfully!"})
   } catch (error:any) {
      return res.status(200).json({status:false, message:error.message})
   }
}

export const getAllCarMake = async (req: Request, res: Response) => {
   try {
      const data = await getCarMakeService()
      return res.status(200).json({ data: data, status: true })

   } catch (error: any) {
      return res.status(200).json({ status: false, message: error.message })
   }
}