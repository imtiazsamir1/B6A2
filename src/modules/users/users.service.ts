import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import { Request, Response } from "express";
import { Vehicle } from "../vehicles/vehicle.types";

const createUserDB=async(payLoad:Record<string,unknown>)=>{
    const { name, email, password, phone, role } =payLoad;

     const hashPassword = await bcrypt.hash(password as string, 12);

        
        if (!name || !email || !password || !phone || !role) {
           throw new Error('Missing required fields');
        }

        const result = await pool.query(
            `INSERT INTO users (name, email, password, phone, role)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [name, email, hashPassword, phone, role]
        );
        delete result.rows[0].password
        return result

}
const getAllUserIntoDB = async () => {
  const result = await pool.query(
    `
    SELECT id,name,email FROM users
    `
  );

  return result;
};

const getSingleUserIntoDB = async (email: string) => {
  const result = await pool.query(
    `
   
      SELECT id,name,email FROM users WHERE email=$1
    `,
    [email]
  );

  return result;
};
const updateUserDB = async (id: number, payLoad: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payLoad;

  let hashPassword;
  if (password) {
    hashPassword = await bcrypt.hash(password as string, 12);
  }

  const result = await pool.query(
    `
    UPDATE users
    SET 
      name = COALESCE($1, name),
      email = COALESCE($2, email),
      password = COALESCE($3, password),
      phone = COALESCE($4, phone),
      role = COALESCE($5, role)
    WHERE id = $6
    RETURNING id, name, email, phone, role
    `,
    [name, email, hashPassword, phone, role, id]
  );

  if (!result.rows.length) {
    throw new Error("User not found");
  }

  return result;
};

const deleteUserDB = async (id: number) => {
  const result = await pool.query(
    `DELETE FROM users WHERE id=$1 RETURNING id, name, email`,
    [id]
  );

  if (!result.rows.length) {
    throw new Error("User not found");
  }

  return result;
};

export const UserServices = {
  createUserDB,
  getAllUserIntoDB,
  getSingleUserIntoDB,
  updateUserDB,
  deleteUserDB,
};







