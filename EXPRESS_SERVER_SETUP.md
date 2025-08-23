# Express Server Setup - Easy Deployment Guide

This project includes a lightweight Express server that protects your Airtable API keys while handling form submissions securely.

## Quick Start (5 minutes)

### 1. Set up Airtable (if not done already)
Follow the instructions in `AIRTABLE_SETUP.md` to create your Airtable base and tables.

### 2. Configure Environment Variables

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` and add your Airtable credentials:
```env
# Required for the server
AIRTABLE_BASE_ID=your_actual_base_id
AIRTABLE_API_KEY=your_actual_api_key

# Server runs on port 3001 by default
PORT=3001
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Everything

For development (runs both frontend and backend):
```bash
npm run dev:all
```

This will start:
- Frontend on http://localhost:5173
- Backend API on http://localhost:3001

### 5. Test It

1. Open http://localhost:5173 in your browser
2. Complete the quiz
3. Check your Airtable base for the submission

## How It Works

```
[User Browser] 
    ↓ (Quiz Data)
[React App on :5173]
    ↓ (POST to /api/submit-quiz)
[Express Server on :3001]
    ↓ (With API Key)
[Airtable API]
```

Your API keys stay safe on the server, never exposed to the browser!

## Deployment Options

### Option 1: Deploy to Render (Recommended - Free Tier Available)

1. Push your code to GitHub
2. Go to [Render](https://render.com)
3. Create a new Web Service
4. Connect your GitHub repo
5. Use these settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add environment variables in Render dashboard:
   - `AIRTABLE_BASE_ID`
   - `AIRTABLE_API_KEY`
   - `NODE_ENV=production`
   - `FRONTEND_URL=your-frontend-url`

### Option 2: Deploy to Railway

1. Install Railway CLI: `npm install -g @railway/cli`
2. Run: `railway login`
3. Run: `railway init`
4. Run: `railway up`
5. Add environment variables in Railway dashboard

### Option 3: Deploy to Heroku

1. Install Heroku CLI
2. Create a Procfile:
```
web: node server.js
```
3. Deploy:
```bash
heroku create your-app-name
heroku config:set AIRTABLE_BASE_ID=your_base_id
heroku config:set AIRTABLE_API_KEY=your_api_key
git push heroku main
```

### Option 4: Deploy to DigitalOcean App Platform

1. Push to GitHub
2. Create new App in DigitalOcean
3. Choose your repo
4. Set environment variables
5. Deploy

### Option 5: Self-Host on VPS

1. SSH into your server
2. Clone the repository
3. Install Node.js and npm
4. Set up PM2 for process management:
```bash
npm install -g pm2
pm2 start server.js --name debt-assess-api
pm2 save
pm2 startup
```

## Production Checklist

### Frontend Deployment
Deploy the frontend separately (Netlify, Vercel, etc.):
```bash
npm run build
# Upload the 'dist' folder to your hosting service
```

Update your `.env` for production:
```env
VITE_API_ENDPOINT=https://your-api-server.com/api/submit-quiz
```

### Backend Security
The server includes:
- ✅ Rate limiting (10 submissions per hour per IP)
- ✅ CORS protection
- ✅ Helmet.js security headers
- ✅ Input validation
- ✅ Error handling without exposing internals

### Environment Variables
Never commit `.env` files! Add to `.gitignore`:
```
.env
.env.local
.env.production
```

## Available Scripts

```bash
# Development
npm run dev          # Frontend only
npm run server:dev   # Backend only
npm run dev:all      # Both frontend and backend

# Production
npm run build        # Build frontend
npm start           # Start production server

# Testing
curl http://localhost:3001/api/health  # Check server status
```

## Troubleshooting

### "Cannot connect to server"
- Check if server is running: `npm run server:dev`
- Verify PORT in .env (default 3001)
- Check VITE_API_ENDPOINT points to correct URL

### "Airtable configuration missing"
- Ensure AIRTABLE_BASE_ID and AIRTABLE_API_KEY are in .env
- Restart the server after changing .env

### "CORS error"
- For local dev, frontend should be on localhost:5173
- For production, update FRONTEND_URL in server.js

### "Too many requests"
- Rate limit is 10 submissions per hour
- Wait or adjust limits in server.js

## API Endpoints

### `GET /api/health`
Check server status and configuration

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "configured": true
}
```

### `POST /api/submit-quiz`
Submit quiz responses to Airtable

Request body:
```json
{
  "responseId": "resp_123456789_abc",
  "mainRecord": { ... },
  "answerRecords": [ ... ]
}
```

## Security Notes

1. **API Keys**: Only stored on server, never sent to browser
2. **Rate Limiting**: Prevents abuse (10 submissions/hour/IP)
3. **CORS**: Only accepts requests from your frontend domain
4. **HTTPS**: Always use HTTPS in production
5. **Input Validation**: All inputs are validated before processing

## Monitoring

Consider adding:
- Logging service (LogRocket, Sentry)
- Uptime monitoring (UptimeRobot, Pingdom)
- Analytics (Google Analytics, Plausible)

## Support

If you have issues:
1. Check the console for errors
2. Verify environment variables
3. Test the health endpoint
4. Check Airtable permissions
5. Review server logs

## Next Steps

1. Deploy frontend to Netlify/Vercel
2. Deploy backend to your chosen platform
3. Update environment variables
4. Test the full flow
5. Monitor submissions in Airtable

The Express server makes deployment simple and secure - your API keys are protected and the setup takes just minutes!