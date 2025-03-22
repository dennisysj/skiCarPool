# Supabase Database Setup Instructions

## Issue
Your backend is encountering errors because the `profiles` table in Supabase is missing required columns for Google and Apple authentication:
```
Error checking for existing user: {
  code: '42703',
  details: null,
  hint: null,
  message: 'column profiles.google_id does not exist'
}
```

## Fix Steps

1. **Log in to your Supabase Dashboard**
   - Go to: https://app.supabase.com
   - Sign in with your credentials
   - Select your project (URL: https://mercswjbfadsyjsmlszv.supabase.co)

2. **Navigate to the Table Editor**
   - Click on "Table Editor" in the left sidebar
   - Find and select the `profiles` table

3. **Add the Missing Columns**
   - Click on "Edit" or gear icon to modify the table
   - Add these new columns:
     - `google_id` (type: text, nullable: true)
     - `apple_id` (type: text, nullable: true)
   - Save your changes

4. **Verify the Column Addition**
   - View the table structure to confirm the new columns are added
   - You may need to refresh the page to see the updates

5. **Restart the Backend Server**
   - Go back to your terminal
   - Stop any running backend server (Ctrl+C)
   - Start it again with: `cd backend && npm start`

## Troubleshooting

If you still encounter issues after adding the columns:

1. **Check Row Level Security (RLS)**
   - Your profiles table has RLS enabled
   - For testing, you might need to temporarily disable RLS policies
   - Go to "Authentication" → "Policies" in the Supabase dashboard

2. **Examine Auth Configuration**
   - Make sure your auth routes are properly configured
   - Check that the Supabase client is properly initialized

3. **Database Structure**
   - Ensure your profiles table has all required columns:
     - id (uuid, primary key)
     - username (text)
     - full_name (text)
     - google_id (text, nullable)
     - apple_id (text, nullable)
     - created_at (timestamp) 