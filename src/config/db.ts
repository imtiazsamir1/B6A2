import {Pool} from "pg"
import config from "."
export const pool=new Pool({
  connectionString:`${config.connection_str}`
})
const initDB=async()=>{
  await pool.query(`
CREATE TABLE IF NOT EXISTS users (
id SERIAL PRIMARY KEY,
name TEXT NOT NULL,
email TEXT NOT NULL UNIQUE,
password TEXT NOT NULL,
phone TEXT NOT NULL,
role TEXT NOT NULL CHECK (role IN ('admin', 'customer'))
);

    `)
//vehicles
await pool.query(`
  CREATE TABLE IF NOT EXISTS vehicles (
id SERIAL PRIMARY KEY,
vehicle_name TEXT NOT NULL,
type TEXT NOT NULL CHECK (type IN ('car', 'bike', 'van', 'SUV')),
registration_number TEXT NOT NULL UNIQUE,
daily_rent_price NUMERIC NOT NULL CHECK (daily_rent_price > 0),
availability_status TEXT NOT NULL CHECK (availability_status IN ('available', 'booked'))
);
  
  `)
  //booking
await pool.query(`
 CREATE TABLE IF NOT EXISTS bookings (
id SERIAL PRIMARY KEY,
customer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
rent_start_date DATE NOT NULL,
rent_end_date DATE NOT NULL CHECK (rent_end_date > rent_start_date),

total_price NUMERIC NOT NULL CHECK (total_price > 0),
status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'returned'))
);
  
  `)

}
export default initDB
