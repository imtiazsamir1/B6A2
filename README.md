# Vehicle Rental System API

## 1️⃣ Authentication & Authorization

### User Login
- Users can login using **email & password**.
- A **JWT token** is generated upon successful login.

### Role-based Access Control (RBAC)
- Two roles: `admin` and `customer`.
- Route access is restricted based on roles.

**Examples:**
- **Admin:** Can view all bookings, manage vehicles.
- **Customer:** Can view and create only their own bookings.

### Token Validation
- Middleware verifies JWT tokens.
- Returns `401 Unauthorized` if token is invalid, expired, or missing.

---

## 2️⃣ Vehicle Management (Admin)

### Create Vehicle
- Admin can add new vehicles.
- **Required fields:** `vehicle_name`, `type`, `registration_number`, `daily_rent_price`, `availability_status`.
- Duplicate `registration_number` will throw an error.

### Get Vehicles
- Both admin and customers can view the list of vehicles.

### Get Single Vehicle
- Fetch a vehicle using its `id`.

### Update Vehicle
- Admin (and optionally allowed customers) can update vehicle details.

### Delete Vehicle
- Vehicles with active bookings **cannot be deleted**.

---

## 3️⃣ Booking Management

### Create Booking
- Customers can book a vehicle.
- **Validation:**
  - Vehicle must be available.
  - `end_date` must be after `start_date`.
- **Total price** is calculated automatically (`days × daily_rent_price`).
- Vehicle status is automatically updated to **booked**.

### Get Bookings (Role-based)
- **Admin:** Retrieves all bookings with nested customer & vehicle info.
- **Customer:** Retrieves only their own bookings with nested vehicle info (customer info excluded).

### Update Booking
- **Customer:** Can cancel booking (before start date).
- **Admin:** Can mark booking as returned.
- Vehicle availability is automatically updated.

### Nested Data
- Booking responses include related vehicle information.
- Admin responses include nested customer information.

---

## 4️⃣ Database Features

### Tables
- **users:** `id`, `name`, `email`, `password`, `role`, `phone`
- **vehicles:** `id`, `vehicle_name`, `type`, `registration_number`, `daily_rent_price`, `availability_status`
- **bookings:** `id`, `customer_id`, `vehicle_id`, `rent_start_date`, `rent_end_date`, `total_price`, `status`

### Constraints
- Unique vehicle registration numbers.
- Booking `end_date` must be after `start_date`.
- Booking status restricted to `active`, `cancelled`, or `returned`.

### Transactions
- Booking creation and updates are wrapped in **DB transactions** (`BEGIN/COMMIT/ROLLBACK`).

---

## 5️⃣ API Responses

- Consistent JSON response structure:

```json
{
  "success": true,
  "message": "Some message",
  "data": {...} // Nested vehicle/customer info if applicable
}
