import { Request, Response } from "express";
import { authServices } from "./auth.service";


const loginUser = async(req : Request,res : Response)=>{
      try {
         const result = await authServices.loginUserDB(req.body.email,req.body.password)


            const { token, user } = result;

         const { password, ...userWithoutPassword } = user;

          return res.status(201).json({
            success: true,
            message: "Login successful",
              data: {
        token,
        user: userWithoutPassword
      }
          });
        } catch (error: any) {
          return res.status(500).json({
            success: true,
            message: error.message,
          });
        }
} 

export const authController = {
    loginUser
}