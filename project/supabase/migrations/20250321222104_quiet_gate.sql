/*
  # Initial Schema Setup for Ski Share

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `username` (text, unique)
      - `full_name` (text)
      - `avatar_url` (text)
      - `created_at` (timestamp)
    
    - `rides`
      - `id` (uuid, primary key)
      - `driver_id` (uuid, references profiles)
      - `departure_location` (text)
      - `destination` (text)
      - `departure_time` (timestamp)
      - `available_seats` (integer)
      - `price` (decimal)
      - `created_at` (timestamp)
    
    - `ride_requests`
      - `id` (uuid, primary key)
      - `ride_id` (uuid, references rides)
      - `passenger_id` (uuid, references profiles)
      - `status` (text: pending, accepted, rejected)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username text UNIQUE,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Create rides table
CREATE TABLE rides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid REFERENCES profiles ON DELETE CASCADE,
  departure_location text NOT NULL,
  destination text NOT NULL,
  departure_time timestamptz NOT NULL,
  available_seats int NOT NULL CHECK (available_seats >= 0),
  price decimal(10,2) NOT NULL CHECK (price >= 0),
  created_at timestamptz DEFAULT now()
);

-- Create ride requests table
CREATE TABLE ride_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id uuid REFERENCES rides ON DELETE CASCADE,
  passenger_id uuid REFERENCES profiles ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE ride_requests ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Rides policies
CREATE POLICY "Rides are viewable by everyone"
  ON rides FOR SELECT
  USING (true);

CREATE POLICY "Users can create rides"
  ON rides FOR INSERT
  WITH CHECK (auth.uid() = driver_id);

CREATE POLICY "Users can update own rides"
  ON rides FOR UPDATE
  USING (auth.uid() = driver_id);

-- Ride requests policies
CREATE POLICY "Users can view their own requests and requests for their rides"
  ON ride_requests FOR SELECT
  USING (
    auth.uid() = passenger_id OR 
    auth.uid() IN (
      SELECT driver_id FROM rides WHERE id = ride_requests.ride_id
    )
  );

CREATE POLICY "Users can create requests"
  ON ride_requests FOR INSERT
  WITH CHECK (auth.uid() = passenger_id);

CREATE POLICY "Users can update their own requests"
  ON ride_requests FOR UPDATE
  USING (
    auth.uid() = passenger_id OR 
    auth.uid() IN (
      SELECT driver_id FROM rides WHERE id = ride_requests.ride_id
    )
  );