Vehicle Rental System
Live Demo

https://backend-server-nine-psi.vercel.app/

Project Overview

This is a backend API for a Vehicle Rental System. The system allows managing vehicles, customers, and bookings with role-based authentication. It ensures smooth operations for vehicle rental businesses, including vehicle availability tracking and automatic cost calculation.

Features

Manage vehicle inventory with availability status

Handle customer accounts and profiles

Book and return vehicles with automatic cost calculation

Role-based authentication with Admin and Customer roles

RESTful API endpoints for all operations

Technology Stack

Backend: Node.js, Express.js, TypeScript

Database: PostgreSQL

Deployment: Vercel

Authentication: JWT (JSON Web Tokens)

Setup and Usage
1. Clone the Repository
git clone <your-github-repo-link>
cd <your-project-folder>
npm install

2. Setup Environment Variables

Create a .env file in the root directory with the following:

PORT=5000
JWT_SECRET=your_jwt_secret
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_PORT=5432

3. Database Setup

Ensure PostgreSQL is running

Create the database and tables according to the project schema

4. Start the Server
npm run dev


The server will run at http://localhost:5000/.

API Endpoints Overview
Authentication

POST /api/v1/auth/signup - Register a new user account (Public)

POST /api/v1/auth/signin - Login and receive JWT token (Public)

Vehicles

GET /api/v1/vehicles - Get all vehicles (Public)

GET /api/v1/vehicles/:vehicleId - Get a specific vehicle (Public)

POST /api/v1/vehicles - Add new vehicle (Admin only)

PUT /api/v1/vehicles/:vehicleId - Update vehicle details (Admin only)

DELETE /api/v1/vehicles/:vehicleId - Delete a vehicle (Admin only)

Users

GET /api/v1/users - View all users (Admin only)

PUT /api/v1/users/:userId - Update user (Admin or own profile)

DELETE /api/v1/users/:userId - Delete a user (Admin only)

Bookings

POST /api/v1/bookings - Create a booking (Customer or Admin)

GET /api/v1/bookings - View bookings (Admin: all, Customer: own)

PUT /api/v1/bookings/:bookingId - Cancel or return booking (Role-based)