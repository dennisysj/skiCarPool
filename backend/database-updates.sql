-- SQL commands to update the rides table schema

-- First, check if columns already exist before adding them
DO $$
BEGIN
    -- Add ski_resort column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rides' AND column_name = 'ski_resort') THEN
        ALTER TABLE rides ADD COLUMN ski_resort TEXT;
    END IF;

    -- Add pickup_zone column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rides' AND column_name = 'pickup_zone') THEN
        ALTER TABLE rides ADD COLUMN pickup_zone TEXT;
    END IF;
    
    -- Add car_make column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rides' AND column_name = 'car_make') THEN
        ALTER TABLE rides ADD COLUMN car_make TEXT;
    END IF;
    
    -- Add car_model column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rides' AND column_name = 'car_model') THEN
        ALTER TABLE rides ADD COLUMN car_model TEXT;
    END IF;
    
    -- Add car_photo_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rides' AND column_name = 'car_photo_url') THEN
        ALTER TABLE rides ADD COLUMN car_photo_url TEXT;
    END IF;
    
    -- Add gear_space column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rides' AND column_name = 'gear_space') THEN
        ALTER TABLE rides ADD COLUMN gear_space TEXT;
    END IF;
    
    -- Add return_time column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rides' AND column_name = 'return_time') THEN
        ALTER TABLE rides ADD COLUMN return_time TIMESTAMPTZ;
    END IF;
    
    -- Add description column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rides' AND column_name = 'description') THEN
        ALTER TABLE rides ADD COLUMN description TEXT;
    END IF;
    
END $$;

-- Notes for implementation:
-- 1. Execute this in Supabase SQL Editor
-- 2. Or use these as guidelines to add columns using the Supabase UI
-- 3. All columns are nullable since they might not all be required 

-- Add appropriate constraints and indexes
ALTER TABLE rides
  ALTER COLUMN ski_resort SET NOT NULL,
  ALTER COLUMN pickup_zone SET NOT NULL;

-- Create indexes for search performance
CREATE INDEX IF NOT EXISTS rides_ski_resort_idx ON rides (ski_resort);
CREATE INDEX IF NOT EXISTS rides_departure_time_idx ON rides (departure_time);
CREATE INDEX IF NOT EXISTS rides_driver_id_idx ON rides (driver_id); 