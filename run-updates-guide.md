# Steps to Update Supabase and Run the Backend

Follow these steps to apply all the changes for the "Offer a Ride" feature:

## 1. Update the Supabase Database Schema

1. Log in to your Supabase dashboard at https://app.supabase.com
2. Select your project (URL: https://mercswjbfadsyjsmlszv.supabase.co)
3. Click on "SQL Editor" in the left sidebar
4. Create a new query by clicking "+ New Query"
5. Paste the following SQL:

```sql
-- SQL commands to update the rides table schema
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
```

6. Click "Run" to execute the SQL
7. Verify the changes by going to "Table Editor" and checking the structure of the `rides` table

## 2. Start the Backend Server

Now that the database schema has been updated and you've installed multer, start the backend server:

```bash
# Make sure no Node.js process is using port 3000
pkill -f "node src/index.js"

# Start the backend server
npm start
```

## 3. Verify Everything is Working

1. Test the file upload endpoint:
   ```bash
   curl -X POST http://localhost:3000/api/uploads/car-photo \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -F "photo=@/path/to/photo.jpg"
   ```

2. Test the ride creation endpoint:
   ```bash
   curl -X POST http://localhost:3000/api/rides \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{
       "ski_resort": "Whistler Blackcomb",
       "pickup_zone": "Downtown Vancouver",
       "departure_location": "Canada Place",
       "destination": "Whistler Village",
       "departure_time": "2023-12-25T08:00:00Z",
       "return_time": "2023-12-25T16:00:00Z",
       "available_seats": 3,
       "price": 25,
       "car_make": "Toyota",
       "car_model": "4Runner",
       "car_photo_url": "http://localhost:3000/api/uploads/uploads/car-photo-123.jpg",
       "gear_space": "Medium (3-4 boards/sets of skis)",
       "description": "I like to listen to rock music and stop for coffee on the way."
     }'
   ```

## 4. Next Steps

Once the backend is running and the database is updated, you can proceed with implementing the frontend components that will interact with these endpoints. 