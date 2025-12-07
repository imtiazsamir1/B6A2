// vehicles.router.ts
import express from "express";
import * as vehicleController from "./vehicles.controller";
import auth from "../../middlewares/auth";
// import auth from "../middlewares/auth";

const router = express.Router();

// PROTECTED ROUTES
router.post("/", auth("admin"), vehicleController.createVehicle);
router.get("/", auth("admin", "customer"), vehicleController.getAllVehicles);
router.get("/:vehicleId", auth("admin", "customer"), vehicleController.getSingleVehicle);
router.put("/:vehicleId", auth("admin", "customer"), vehicleController.updateVehicle);
router.delete("/:vehicleId", auth("admin"), vehicleController.deleteVehicle);

export const vehicleRoute=router
