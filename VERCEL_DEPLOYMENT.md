# Fallback Deployment Plan: Vercel

If you encounter persistent issues with Render deployment, this alternative deployment plan using Vercel (for frontend) and Railway (for backend) provides a reliable fallback option.

## Frontend Deployment on Vercel

Vercel is the platform created by the Next.js team and is perfectly optimized for Next.js applications.

### Step 1: Create Vercel Account and Import Project

1. Sign up at [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository or upload the frontend directory
4. Select "Next.js" as the framework preset

### Step 2: Configure Project

1. Set the "Root Directory" to `/frontend`
2. Add environment variables (same as in render.yaml):
   - `NEXT_PUBLIC_API_URL` = Your backend API URL
   - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anon key
   - `NEXT_PUBLIC_APP_ENV` = production
   - `NEXT_PUBLIC_HOSPITAL_SUBDOMAIN` = general

3. Click "Deploy"

### Step 3: Verify Deployment

- Once deployed, your app will be available at `https://your-project-name.vercel.app`
- Vercel automatically sets up CI/CD so future pushes to your repository will trigger new deployments

## Backend Deployment on Railway

Railway provides a simple and reliable platform for backend services with free tier options.

### Step 1: Set Up Railway Account

1. Sign up at [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your GitHub repository

### Step 2: Configure Project

1. Set the "Root Directory" to `/backend`
2. Add environment variables:
   - `NODE_ENV` = production
   - `PORT` = 5000
   - `MONGODB_URI` = Your MongoDB Atlas connection string
   - `JWT_SECRET` = Your secret key
   - `JWT_EXPIRES_IN` = 1h
   - `JWT_REFRESH_EXPIRES_IN` = 7d
   - `CORS_ORIGIN` = Your Vercel frontend URL
   - `EMAIL_PROVIDER` = resend
   - `RESEND_API_KEY` = Your Resend API key
   - `TWILIO_ACCOUNT_SID` = Your Twilio Account SID
   - `TWILIO_AUTH_TOKEN` = Your Twilio Auth Token
   - `TWILIO_MESSAGING_SERVICE_SID` = Your Twilio Messaging Service SID

3. Set the start command to `npm start`
4. Set the build command to `npm ci --omit=dev`

### Step 3: Add Redis Database

1. In Railway dashboard, click "New" → "Database" → "Redis"
2. Connect it to your project
3. Add environment variable to your backend service:
   - `REDIS_URL` = ${REDIS_URL} (Railway auto-populates this)
   - `CACHE_ENABLED` = true

### Step 4: Verify Deployment

- Once deployed, your backend will be available at the provided Railway URL
- Update your Vercel frontend's NEXT_PUBLIC_API_URL to point to this new backend URL

## Connecting the Services

1. In Vercel dashboard, update the NEXT_PUBLIC_API_URL environment variable to your Railway backend URL
2. In Railway dashboard, update the CORS_ORIGIN environment variable to your Vercel frontend URL
3. Deploy both services again to apply these changes

## Advantages of This Approach

1. Vercel is maintained by the Next.js team, ensuring optimal performance and compatibility
2. Railway provides a more beginner-friendly interface than Render
3. Both services offer generous free tiers for demo purposes
4. Automatic CI/CD integration with GitHub
5. Optimized for the specific technologies (Next.js on Vercel, Node.js on Railway)

## Monitoring and Maintenance

- Vercel provides built-in analytics and performance monitoring
- Railway offers logs and metrics for your backend service
- Both platforms handle scaling and infrastructure maintenance automatically

This fallback deployment plan should provide a more reliable alternative if you continue to encounter issues with Render.