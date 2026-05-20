# Food Analyzer (MERN)

A starter MERN app for uploading a menu or food photo and estimating calories and macros.

## Features
- React frontend with file upload and analysis form
- Express backend with placeholder food analysis logic
- API endpoint for image + menu text submission

## Setup
1. Install root dependencies:
   ```bash
   npm install
   ```
2. Install backend and frontend dependencies:
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```
3. Start both servers:
   ```bash
   npm run dev
   ```

## How it works
- Frontend sends the uploaded image and optional menu text to `/api/analyze`
- Backend returns estimated calories and macros
- Replace the placeholder analysis with a real food recognition / nutrition API when ready
