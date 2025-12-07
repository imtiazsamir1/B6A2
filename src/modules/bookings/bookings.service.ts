import { pool } from "../../config/db";
import { JwtPayloadCustom } from "../auth/auth.service";

interface BookingInput {
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
}

export class BookingService {
 
  static async createBooking(data: BookingInput) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

    
      const vehicleRes = await client.query(
        `SELECT * FROM vehicles WHERE id=$1 FOR UPDATE`,
        [data.vehicle_id]
      );

      if (vehicleRes.rows.length === 0) throw new Error("Vehicle not found");

      const vehicle = vehicleRes.rows[0];
      if (vehicle.availability_status !== "available")
        throw new Error("Vehicle is not available");

      const start = new Date(data.rent_start_date);
      const end = new Date(data.rent_end_date);
      if (end <= start) throw new Error("End date must be after start date");

      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const total_price = days * vehicle.daily_rent_price;

    
      const bookingRes = await client.query(
        `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
         VALUES ($1,$2,$3,$4,$5,'active') RETURNING *`,
        [data.customer_id, data.vehicle_id, data.rent_start_date, data.rent_end_date, total_price]
      );

    
      await client.query(
        `UPDATE vehicles SET availability_status='booked' WHERE id=$1`,
        [data.vehicle_id]
      );

      await client.query("COMMIT");
      return bookingRes.rows[0];
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  
  static async getBookings(user: JwtPayloadCustom) {
    // Step 1: fetch bookings
    let bookingsQuery = `SELECT * FROM bookings`;
    const params: any[] = [];
    if (user.role !== "admin") {
      bookingsQuery += ` WHERE customer_id=$1`;
      params.push(user.id);
    }

    const { rows: bookings } = await pool.query(bookingsQuery, params);

    if (bookings.length === 0) return [];

    
    const vehicleIds = [...new Set(bookings.map(b => b.vehicle_id))];
    const { rows: vehicles } = await pool.query(
      `SELECT id, vehicle_name, registration_number, type FROM vehicles WHERE id = ANY($1::int[])`,
      [vehicleIds]
    );
    const vehiclesMap: Record<number, any> = {};
    vehicles.forEach(v => {
      vehiclesMap[v.id] = v;
    });

    
    let customersMap: Record<number, any> = {};
    if (user.role === "admin") {
      const customerIds = [...new Set(bookings.map(b => b.customer_id))];
      const { rows: customers } = await pool.query(
        `SELECT id, name, email FROM users WHERE id = ANY($1::int[])`,
        [customerIds]
      );
      customers.forEach(c => {
        customersMap[c.id] = { name: c.name, email: c.email };
      });
    }

    const result = bookings.map(b => {
      const bookingData: any = {
        ...b,
        vehicle: vehiclesMap[b.vehicle_id],
      };

      if (user.role === "admin") {
        bookingData.customer = customersMap[b.customer_id];
      }

      if (user.role !== "admin") delete bookingData.customer_id;

      return bookingData;
    });

    return result;
  }

  
  static async updateBooking(
    bookingId: number,
    action: "cancel" | "return",
    user: JwtPayloadCustom
  ) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const bookingRes = await client.query(
        `SELECT * FROM bookings WHERE id=$1 FOR UPDATE`,
        [bookingId]
      );
      if (bookingRes.rows.length === 0) throw new Error("Booking not found");

      const booking = bookingRes.rows[0];

      if (action === "cancel") {
        if (user.role !== "customer") throw new Error("Unauthorized");
        const now = new Date();
        if (new Date(booking.rent_start_date) <= now)
          throw new Error("Cannot cancel after start date");

        await client.query(`UPDATE bookings SET status='cancelled' WHERE id=$1`, [bookingId]);
        await client.query(
          `UPDATE vehicles SET availability_status='available' WHERE id=$1`,
          [booking.vehicle_id]
        );

        booking.status = "cancelled";
      }

      if (action === "return") {
        if (user.role !== "admin") throw new Error("Unauthorized");

        await client.query(`UPDATE bookings SET status='returned' WHERE id=$1`, [bookingId]);
        await client.query(
          `UPDATE vehicles SET availability_status='available' WHERE id=$1`,
          [booking.vehicle_id]
        );

        booking.status = "returned";
      }

      await client.query("COMMIT");

     
      const { rows: vehicleRows } = await pool.query(
        `SELECT id, vehicle_name, registration_number, type FROM vehicles WHERE id=$1`,
        [booking.vehicle_id]
      );
      booking.vehicle = vehicleRows[0];

      return {
        message: `Booking ${action}d successfully`,
        booking,
      };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
}
