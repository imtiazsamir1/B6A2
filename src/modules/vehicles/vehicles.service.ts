// vehicles.service.ts
import { pool } from "../../config/db";

export interface Vehicle {
  id?: number;
  vehicle_name: string;
  type: string;
  registration_number: string;
  daily_rent_price: number;
  availability_status: boolean;
}

// CREATE
const createVehicleDB = async (payload: Vehicle) => {
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

  if (!vehicle_name || !type || !registration_number || !daily_rent_price || availability_status === undefined) {
    throw new Error("Missing required fields");
  }

  const result = await pool.query(
    `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [vehicle_name, type, registration_number, daily_rent_price, availability_status]
  );

  return result.rows[0];
};

// GET ALL
const getAllVehiclesFromDB = async () => {
  const result = await pool.query(`SELECT * FROM vehicles ORDER BY id ASC`);
  return result.rows;
};

// GET SINGLE
const getSingleVehicleFromDB = async (vehicleId: number) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [vehicleId]);
  return result.rows[0];
};

// UPDATE
const updateVehicleInDB = async (vehicleId: number, updateData: Partial<Vehicle>) => {
  const fields = Object.keys(updateData);
  const values = Object.values(updateData);

  if (fields.length === 0) throw new Error("No fields to update");

  const setString = fields.map((field, index) => `${field}=$${index + 1}`).join(", ");
  const query = `UPDATE vehicles SET ${setString} WHERE id=$${fields.length + 1} RETURNING *`;

  const result = await pool.query(query, [...values, vehicleId]);
  return result.rows[0];
};

// DELETE
const deleteVehicleFromDB = async (vehicleId: number) => {
  const { rows: activeBookings } = await pool.query(
    `SELECT * FROM bookings WHERE vehicle_id=$1 AND status='active'`,
    [vehicleId]
  );

  if (activeBookings.length > 0) throw new Error("Cannot delete vehicle with active bookings");

  const result = await pool.query(`DELETE FROM vehicles WHERE id=$1 RETURNING *`, [vehicleId]);
  return result.rows[0];
};

export const VehicleServices = {
  createVehicleDB,
  getAllVehiclesFromDB,
  getSingleVehicleFromDB,
  updateVehicleInDB,
  deleteVehicleFromDB,
};
