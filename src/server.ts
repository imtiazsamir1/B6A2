import express, { Request, Response } from "express";

import config from "./config";
import initDB from "./config/db";
import { userRoute } from "./modules/users/users.routes";
import { authRoute } from "./modules/auth/auth.route";
import { vehicleRoute } from "./modules/vehicles/vehicles.routes";
import { bookingRoute } from "./modules/bookings/bookings.routes";



const app = express()
const port = config.port;

//perser
app.use(express.json())
//app.use(express.urlencoded())

//DB


//users

initDB()


app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "This is the root route",
    path: req.path,
  });
});


app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth",userRoute)
app.use("/api/v1/auth",authRoute)

app.use("/api/v1/vehicles",vehicleRoute)
app.use("/api/v1/bookings",bookingRoute)





app.listen(port, () => {
  console.log(` App listening on port ${port}`)
})
