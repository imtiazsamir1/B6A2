import { Result } from './../../../node_modules/@types/pg/index.d';
import { Request, Response } from "express";
import { pool } from "../../config/db";
import { UserServices } from './users.service';



const createUser=async(req:Request, res:Response)=>{
  try {
        
const result=await UserServices.createUserDB(req.body)
       return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
    } catch (err:any) {
        return res.status(500).json({
      success: true,
      message: err.message,
    });
    }
}
const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await UserServices.getAllUserIntoDB();
    return res.status(201).json({
      success: true,
      message: "User created",
      data: result.rows,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const email = req.customer!.email
    const result = await UserServices.getSingleUserIntoDB(email);
    return res.status(201).json({
      success: true,
      message: "User created",
      data: result.rows,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const idParam = req.params.id;
    if (!idParam) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID",
      });
    }

    const result = await UserServices.updateUserDB(id, req.body);

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const idParam = req.params.id;
    if (!idParam) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID",
      });
    }

    const result = await UserServices.deleteUserDB(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const userController = {
  createUser,
  getAllUser,
  getSingleUser,
  updateUser,
  deleteUser,
};


