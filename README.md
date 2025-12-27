🚗 Vehicle Rental System (Backend API)
A robust and scalable backend API for a Vehicle Rental Management System. This system handles vehicle inventory, user accounts, and real-time booking management with automatic price calculation and role-based access control (RBAC).



🚀 Live URL
Live Deployment: https://backend-server-nine-psi.vercel.app/


✨ Features
User Management: Secure signup and signin with JWT-based authentication.

Vehicle Management: Full CRUD operations for vehicles with availability tracking.

Booking System: Automatic total price calculation based on rental duration.

Role-Based Access (RBAC): Distinct permissions for Admin and Customer.

Database Security: Password hashing using bcrypt and UUID for primary keys.

Automated Updates: Vehicle status automatically changes to 'booked' upon successful booking and 'available' upon return.


Layer,Technology
Language,TypeScript
Framework,Node.js + Express.js
Database,PostgreSQL
Authentication,JSON Web Token (JWT)
Security,Bcrypt (Hashing)
Environment,Dotenv



1. Clone the Repository
Bash

git clone https://github.com/Polokshahi/backend-project-a2.git
cd backend-project-a2
2. Install Dependencies
Bash

npm install
3. Setup Environment Variables
Create a .env file in the root directory and add your credentials:

Code snippet

PORT=3050
Database_URL=postgresql://neondb_owner:npg_2VBv9WcDoMAh@ep-bitter-glade-a8hx5tdv-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30


# To run in development mode
npm run dev

# To build and run in production
npm run build
npm start



🌐 API Endpoints at a Glance
🔐 Authentication
POST /api/v1/auth/signup - Register a new user account (Public)

POST /api/v1/auth/signin - Login and receive JWT token (Public)

🚗 Vehicles
GET /api/v1/vehicles - View all vehicles (Public)

POST /api/v1/vehicles - Add new vehicle (Admin only)

DELETE /api/v1/vehicles/:vehicleId - Remove a vehicle (Admin only)

📅 Bookings
POST /api/v1/bookings - Create a booking (Authenticated)

GET /api/v1/bookings - View bookings (Role-based)

PUT /api/v1/bookings/:bookingId - Cancel or return booking