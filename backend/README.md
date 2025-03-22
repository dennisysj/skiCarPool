# Ski Carpool App - Backend

This is the backend API for the Ski Carpool application, which connects skiers and snowboarders for carpooling to ski resorts.

## Database Schema

The application uses Supabase with the following tables:

### rides
- **id**: UUID, primary key
- **driver_id**: UUID, foreign key to profiles.id
- **departure_location**: text
- **destination**: text
- **departure_time**: timestamptz
- **available_seats**: int4
- **price**: numeric
- **created_at**: timestamptz

### ride_requests
- **id**: UUID, primary key
- **ride_id**: UUID, foreign key to rides.id
- **passenger_id**: UUID, foreign key to profiles.id
- **status**: text ('pending', 'accepted', 'rejected', 'cancelled')
- **created_at**: timestamptz

### profiles
- **id**: UUID, primary key (linked to auth.users.id)
- **username**: text
- **full_name**: text
- **avatar_url**: text
- **created_at**: timestamptz

## API Endpoints

### Authentication
- **POST /api/auth/signup**: Register a new user
- **POST /api/auth/login**: Login a user
- **POST /api/auth/logout**: Logout a user
- **GET /api/auth/me**: Get current user data

### Profiles
- **GET /api/profiles/me**: Get current user's profile
- **PUT /api/profiles/me**: Update current user's profile
- **GET /api/profiles/:id**: Get profile by ID

### Rides
- **GET /api/rides**: Get all rides with filters
- **GET /api/rides/:id**: Get a specific ride by ID
- **POST /api/rides**: Create a new ride
- **PUT /api/rides/:id**: Update a ride
- **DELETE /api/rides/:id**: Delete a ride
- **GET /api/rides/driver/me**: Get rides offered by the current user

### Ride Requests
- **GET /api/requests/ride/:rideId**: Get all ride requests for a ride (driver only)
- **GET /api/requests/passenger/me**: Get all ride requests made by current user
- **POST /api/requests**: Create a new ride request
- **PUT /api/requests/:id**: Update a ride request status

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   PORT=3000
   FRONTEND_URL=http://localhost:5173
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Technologies Used

- Node.js
- Express
- Supabase (PostgreSQL database)
- JWT Authentication

## Frontend Integration

The frontend React application communicates with this backend through RESTful API calls. Make sure the `FRONTEND_URL` in your .env file matches your frontend's URL for proper CORS configuration.