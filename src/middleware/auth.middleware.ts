import { type Response, type Request, type NextFunction} from "express";
import * as jwt  from "jsonwebtoken";

interface AuthPayload {
   id: string,
   email: string,
   role: string
}

export interface AuthRequest extends Request{
   user?: AuthPayload
}

export const authenticate = (req: AuthRequest,res: Response,next: NextFunction,)=>{
   const authorization = req.headers.authorization;

   if(!authorization){
      return res.status(401).json({
         success: false,
         message:"Authentication required"
      })
   }

   const [type, token] = authorization.split(" ")

   if(type !== "Bearer" || !token){
      return res.status(401).json({
         success:false,
         message:"Invalide authorization header"
      })
   }

   try {
      const decoded = jwt.verify(
         token,
         process.env.JWT_SECRET!
      )as AuthPayload

      req.user = decoded
      next()
   } catch (error) {
      return res.status(401).json({
         success:false,
         message: "Invalid or expired token"
      })
   }

}