# How to Add Missing Columns to Your Profiles Table

Based on the database schema image you shared, you need to add two columns to your `profiles` table:

## Steps to Add Columns in Supabase

1. **Sign in to Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your project (URL: https://mercswjbfadsyjsmlszv.supabase.co)

2. **Navigate to the Table Editor**
   - Click on "Table Editor" in the left sidebar
   - Select the `profiles` table from your tables list

3. **Edit the Table Structure**
   - Click on the "Edit" button near the top right of the table view
   - Look for a "+ Add Column" button

4. **Add the First Column: google_id**
   - Name: `google_id`
   - Type: `text`
   - Default Value: leave empty
   - Make sure "Is Nullable" is checked
   - Click "Save" or "Add Column"

5. **Add the Second Column: apple_id**
   - Name: `apple_id`
   - Type: `text`
   - Default Value: leave empty
   - Make sure "Is Nullable" is checked
   - Click "Save" or "Add Column"

6. **Save Your Changes**
   - Click the "Save" or "Commit" button to apply your changes to the table

7. **Verify the Changes**
   - The `profiles` table should now display the new columns
   - Your final structure should include all existing columns plus:
     - `google_id` (text)
     - `apple_id` (text)

8. **Restart Your Backend**
   - Go back to your terminal
   - Make sure to kill any running backend server processes:
     ```
     killall -9 node
     ```
   - Start the backend again:
     ```
     cd backend && npm start
     ```

After completing these steps, your authentication system should be able to store and retrieve Google and Apple IDs for your users. 