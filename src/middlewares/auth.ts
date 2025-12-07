import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { secret, JwtPayloadCustom } from "../modules/auth/auth.service";

declare global {
  namespace Express {
    interface Request {
      customer?: JwtPayloadCustom;
    }
  }
}

const auth = (...roles: ("admin" | "customer")[]): RequestHandler => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) return res.status(401).json({ message: "No token provided" });

      const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
      if (!token) return res.status(401).json({ message: "Invalid token format" });

      const verified = jwt.verify(token, secret);

      if (typeof verified === "string") {
        return res.status(401).json({ message: "Invalid token payload" });
      }

      const decoded = verified as JwtPayloadCustom;
      req.customer = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden: insufficient role" });
      }

      next();
    } catch (err: any) {
      return res.status(401).json({ message: err.message });
    }
  };
};

export default auth;
