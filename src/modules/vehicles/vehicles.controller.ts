// vehicles.controller.ts
import { RequestHandler } from "express";
import { VehicleServices } from "./vehicles.service";

export const createVehicle: RequestHandler = async (req, res) => {
  try {
    const vehicle = await VehicleServices.createVehicleDB(req.body);
    return res.status(201).json({ success: true, message: "Vehicle created successfully", data: vehicle });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const getAllVehicles: RequestHandler = async (req, res) => {
  try {
    const vehicles = await VehicleServices.getAllVehiclesFromDB();
    return res.status(200).json({ success: true, message: "Vehicle retrieved successfully", data: vehicles });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getSingleVehicle: RequestHandler<{ vehicleId: string }> = async (req, res) => {
  try {
    const vehicleId = parseInt(req.params.vehicleId, 10);
    if (isNaN(vehicleId)) return res.status(400).json({ success: false, message: "Invalid vehicleId" });

    const vehicle = await VehicleServices.getSingleVehicleFromDB(vehicleId);
    if (!vehicle) return res.status(404).json({ success: false, message: "No vehicles found" });

    return res.status(200).json({ success: true, message: "Vehicle fetched successfully", data: vehicle });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateVehicle: RequestHandler<{ vehicleId: string }> = async (req, res) => {
  try {
    const vehicleId = parseInt(req.params.vehicleId, 10);
    if (isNaN(vehicleId)) return res.status(400).json({ success: false, message: "Invalid vehicleId" });

    const updatedVehicle = await VehicleServices.updateVehicleInDB(vehicleId, req.body);
    if (!updatedVehicle) return res.status(404).json({ success: false, message: "Vehicle not found" });

    return res.status(200).json({ success: true, message: "Vehicle updated successfully", data: updatedVehicle });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteVehicle: RequestHandler<{ vehicleId: string }> = async (req, res) => {
  try {
    const vehicleId = parseInt(req.params.vehicleId, 10);
    if (isNaN(vehicleId)) return res.status(400).json({ success: false, message: "Invalid vehicleId" });

    const deletedVehicle = await VehicleServices.deleteVehicleFromDB(vehicleId);
    if (!deletedVehicle) return res.status(404).json({ success: false, message: "Vehicle not found" });

    return res.status(200).json({ success: true, message: "Vehicle deleted successfully", data: deletedVehicle });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
