
import jwt from "jsonwebtoken"

interface JwtPayload{
   id:string,
   email:string,
   role:string
}

export const generateToken = (payload:JwtPayload)=>{
   return jwt.sign(
      payload,
      process.env.JWT_SECRET!,{
         expiresIn: process.env.JWT_EXPIRES_IN || "1d"
      }
   )
}

