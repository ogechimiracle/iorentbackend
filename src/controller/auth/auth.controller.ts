import type {Response, Request} from "express";
import { CreateUserService, getUser } from "./auth.service";
import * as bcrypt from "bcrypt"
import { generateToken } from "../../utils/jwt";



export const CreateUserController = async (req:Request, res:Response)=>{
   try {
      const data = req.body

      const userExist = await getUser(req.body?.email)

      if(userExist){
         return res.status(200).send({message:"User with email address alredy exist", status:false})
      }

      const user = await CreateUserService(data) 
      return res.status(200).send({message:"User Created Successfully", data:user, status:true})
   } catch (error:any) {
      res.send({message:error.message, status:false})
   }
}


export const LoginUserController = async (req:Request, res:Response)=>{
   try {

      const {email, password} = req.body

      const user = await  getUser(email)

      if(!user){
         return res.status(200).send({message:"User with credentials not found", status:false})
      }

      const isPasswordValide = await bcrypt.compare(password, user.password)

      if(isPasswordValide){

         const token = generateToken({
           id: user.id,
           email: user.email,
           role:user.role
         })
         
         return res.status(200).send({message:"Login Successful", status:true, data:{user:{id:user.id, email:user.email, role:user.role}, token}})
      }else{
         return res.status(200).send({ message: "invalide user credentials", status: true })
      }
      
   } catch (error:any) {
      res.send({message:error.message, status:false})
   }

}

