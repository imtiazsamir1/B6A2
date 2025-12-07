import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";
import { pool } from "../../config/db";

export interface JwtPayloadCustom {
  id: number;
  name: string;
  email: string;
  role: "admin" | "customer";
}


export const secret = "KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30";

const loginUserDB = async (email: string, password: string) => {
  const user = await pool.query(
    `
        SELECT * FROM users WHERE email=$1
        `,
    [email]
  );
  if (user.rows.length === 0) {
    throw new Error("User not found!!");
  }
  const matchPassowrd = await bcrypt.compare(password, user.rows[0].password);

  if (!matchPassowrd) {
    throw new Error("Invalid Credentials!");
  }
  const jwtPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role : user.rows[0].role,
  };

  const token = jwt.sign(jwtPayload, secret, { expiresIn: "7d" });

  return { token, user: user.rows[0] };
};

export const authServices = {
  loginUserDB,
};