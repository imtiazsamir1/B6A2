import { Request, Response } from "express";
import { BookingService } from "./bookings.service";

export class BookingController {

  static async createBooking(req: Request, res: Response) {
    try {
      if (!req.customer)
        return res.status(401).json({ success: false, message: "Unauthorized" });

      const { vehicle_id, rent_start_date, rent_end_date } = req.body;

      const booking = await BookingService.createBooking({
        customer_id: req.customer.id,
        vehicle_id,
        rent_start_date,
        rent_end_date,
      });

    
      const { vehicle } = await BookingService.getBookings(req.customer).then(bookings =>
        bookings.find(b => b.id === booking.id)
      );

      const bookingResponse = { ...booking, vehicle };

      res.status(201).json({
        success: true,
        message: "Booking created successfully",
        data: bookingResponse,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

 
  static async getBookings(req: Request, res: Response) {
    try {
      if (!req.customer)
        return res.status(401).json({ success: false, message: "Unauthorized" });

      const bookings = await BookingService.getBookings(req.customer);

      res.json({
        success: true,
        message:
          req.customer.role === "admin"
            ? "Bookings retrieved successfully"
            : "Your bookings retrieved successfully",
        data: bookings,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  
  static async updateBooking(req: Request, res: Response) {
    try {
      if (!req.customer)
        return res.status(401).json({ success: false, message: "Unauthorized" });

      if (!req.params.bookingId)
        return res.status(400).json({ success: false, message: "Booking ID required" });

      const bookingId = parseInt(req.params.bookingId, 10);
      const { action } = req.body;

      const result = await BookingService.updateBooking(bookingId, action, req.customer);

      res.json({
        success: true,
        message: result.message,
        data: result.booking,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}
