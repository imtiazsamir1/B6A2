import express, { Request, Response } from "express";
import { pool } from "../../config/db";
import { userController } from "./users.controller";
import { Roles } from "../auth/auth.constant";
import auth from "../../middlewares/auth";


const router =express.Router()

router.post("/signup",userController.createUser);
router.get("/", auth(Roles.admin), userController.getAllUser);
router.get("/singleuser", auth(Roles.admin,Roles.user), userController.getSingleUser);
router.put("/:id", auth(Roles.admin), userController.updateUser);
router.delete("/:id", auth(Roles.admin), userController.deleteUser);
export const userRoute=router