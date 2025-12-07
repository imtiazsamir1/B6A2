import { Router } from "express";
//import auth from "../middlewares/auth";
import { BookingController } from "./bookings.controller";
import auth from "../../middlewares/auth";

const router = Router();

router.post("/",auth("customer","admin"), BookingController.createBooking);
router.get("/", auth("customer","admin"), BookingController.getBookings);
router.put("/:bookingId", auth("customer","admin"), BookingController.updateBooking);



export const bookingRoute=router