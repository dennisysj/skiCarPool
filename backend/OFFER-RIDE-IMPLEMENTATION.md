# Offer Ride Implementation Guide

This guide explains the backend changes needed to support the "Offer a Ride" functionality in your ski carpool application.

## Database Changes

### New Fields Added to the `rides` Table:

- `ski_resort` (text): The ski resort destination
- `pickup_zone` (text): The designated pickup location
- `car_make` (text): The make of the car (e.g., Toyota)
- `car_model` (text): The model of the car (e.g., 4Runner)
- `car_photo_url` (text): URL to the uploaded car photo
- `gear_space` (text): Description of available gear space
- `return_time` (timestamptz): When the return trip will depart
- `description` (text): Additional details about the ride

These fields match the UI shown in your "Offer a Ride" form design.

## Implementation Steps

### 1. Update Database

Run the provided SQL in the Supabase SQL Editor or add columns through the Supabase UI:

```sql
-- Use database-updates.sql content
```

### 2. Install Needed Packages

```bash
cd backend
npm install multer@1.4.5-lts.1
```

### 3. Verify Changes

After implementing these changes, verify that:
- All new columns are added to the `rides` table
- The API endpoints can handle the new fields
- File uploads work correctly

## API Endpoints

### Create a Ride
- **URL**: `/api/rides`
- **Method**: `POST`
- **Auth Required**: Yes
- **Body**:
  ```json
  {
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
    "car_photo_url": "https://example.com/my-car.jpg",
    "gear_space": "Medium (3-4 boards/sets of skis)",
    "description": "I like to listen to rock music and stop for coffee on the way."
  }
  ```

### Upload Car Photo
- **URL**: `/api/uploads/car-photo`
- **Method**: `POST`
- **Auth Required**: Yes
- **Content Type**: `multipart/form-data`
- **Body**: Form data with a file field named `photo`
- **Response**: URL to use in the `car_photo_url` field

## Frontend Integration

When building the frontend:

1. First upload the car photo using the upload endpoint
2. Use the returned URL in the main ride creation form
3. Submit the form with all fields to create the ride

## Testing

You can test the API with tools like Postman or curl:

```bash
# Upload a photo
curl -X POST http://localhost:3000/api/uploads/car-photo \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "photo=@/path/to/photo.jpg"

# Create a ride
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