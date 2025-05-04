# Deployment Options for Hospital Management System

This document outlines various deployment options for hosting the Hospital Management System for demo purposes or client testing.

## Free/Low-Cost Deployment Options

### 1. Render.com (Recommended)

**Advantages:**
- Free tier available for frontend hosting
- Affordable database and backend options
- Easy continuous deployment from GitHub
- Supports Docker containers
- Built-in MongoDB database service

**Setup:**
1. Create a Render account at [render.com](https://render.com)
2. Connect your GitHub repository
3. Create a web service for the backend:
   - Choose "Node" as runtime
   - Set build command: `cd backend && npm install`
   - Set start command: `cd backend && npm start`
   - Add environment variables from .env files
4. Create a static site for the frontend:
   - Choose build command: `cd frontend && npm install && npm run build`
   - Set publish directory: `frontend/build` or `frontend/.next`
5. Create a PostgreSQL or Redis database service if needed

**Estimated Cost:**
- Free tier for static sites (frontend)
- $7/month for backend (smallest instance)
- $7/month for Redis (can use free tier Redis providers instead)
- Use MongoDB Atlas free tier for database

### 2. Railway.app

**Advantages:**
- Simple deployment
- $5 free credit per month
- GitHub integration
- Supports Docker

**Setup:**
1. Create a Railway account at [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Set up a new project with Node.js template
4. Configure environment variables
5. Deploy both frontend and backend 

**Estimated Cost:**
- $5 free credit per month
- Pay-as-you-go pricing after free credit

### 3. Fly.io

**Advantages:**
- Free tier available
- Global edge deployment
- Docker support
- Simple CLI deployment

**Setup:**
1. Create a Fly.io account at [fly.io](https://fly.io)
2. Install Fly CLI
3. Create a `fly.toml` file
4. Deploy using `fly deploy`

**Estimated Cost:**
- Free tier: 3 shared-cpu VMs, 160GB bandwidth
- $1.94/month for additional VMs if needed

### 4. Netlify + Heroku

**Advantages:**
- Netlify free tier for frontend
- Heroku free tier for backend (limited hours)
- Easy deployment workflow

**Setup:**
1. Deploy frontend to Netlify
2. Deploy backend to Heroku
3. Configure environment variables
4. Set up MongoDB Atlas for database

**Estimated Cost:**
- Frontend: Free with Netlify
- Backend: Free with usage limits on Heroku, or $5/month for hobby dyno

## External Services Configuration

For any deployment, you'll need to set up the external services:

### 1. MongoDB Atlas
- Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Configure network access
- Create database user
- Add connection string to environment variables

### 2. Supabase (if needed)
- Continue using your Supabase project
- Update environment variables with appropriate production URLs

### 3. Redis
- For caching, consider:
  - Redis Cloud (free tier with 30MB)
  - Upstash (free tier with 100MB)
  - Add Redis URL to environment variables

### 4. Resend & Twilio
- Update environment variables with production credentials
- Monitor usage to stay within free tier limits

## Containerization for Easier Deployment

For simpler deployment, consider containerizing the application:

### Docker Compose Setup

Dockerfiles and docker-compose.yml have already been created for this project. 

#### Running with Docker Compose

1. Create a `.env` file in the project root with all required environment variables:

```
# MongoDB Configuration
MONGO_USERNAME=root
MONGO_PASSWORD=example

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Frontend Configuration
CORS_ORIGIN=http://localhost:3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://lnvlwygsebwcvaifhegx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxudmx3eWdzZWJ3Y3ZhaWZoZWd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyOTI1NzIsImV4cCI6MjA2MTg2ODU3Mn0.dJ7sFJQDsgc3ORuYUAuNCQ94hMQm_3SNNLjRsBzxzhA

# Email Configuration
EMAIL_PROVIDER=resend
RESEND_API_KEY=your_resend_api_key_here

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_MESSAGING_SERVICE_SID=your_twilio_messaging_service_sid_here
```

2. Start the application:

```bash
docker-compose up --build
```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - API health check: http://localhost:5000/api/health

4. To stop all services:

```bash
docker-compose down
```

5. To remove all volumes (this will delete all data):

```bash
docker-compose down -v
```

#### Docker Compose Configuration

The `docker-compose.yml` file includes:

- **MongoDB**: Database service with persistent storage
- **Redis**: Cache service with persistent storage
- **Backend**: Node.js API with connections to MongoDB and Redis
- **Frontend**: Next.js frontend application

All services run in their own containers with proper health checks and environment configuration.

#### Production Deployment with Docker

For production deployment:

1. Update the `.env` file with production values
2. Build optimized images:

```bash
docker-compose build --no-cache
```

3. Push images to your container registry:

```bash
docker tag hms-backend:latest your-registry/hms-backend:latest
docker tag hms-frontend:latest your-registry/hms-frontend:latest
docker push your-registry/hms-backend:latest
docker push your-registry/hms-frontend:latest
```

4. Deploy using container orchestration like Kubernetes or use docker-compose on a single server for simpler deployments

## Recommendations for Demo Deployment

For a client demo, we recommend:

1. **Primary Option: Render.com**
   - Deploy frontend static site (free tier)
   - Deploy backend web service ($7/month)
   - Use MongoDB Atlas free tier for database
   - Use Upstash free tier for Redis
   - Total cost: ~$7/month

2. **Budget Option: Railway.app**
   - Utilize the $5 free credit
   - Deploy both frontend and backend within usage limits
   - Use MongoDB Atlas free tier for database
   - Use Upstash free tier for Redis
   - Total cost: Free for limited demos

3. **Monitoring Setup:**
   - Set up basic Prometheus metrics
   - Configure logging with a service like LogDNA (free tier)
   - Create health check endpoints for monitoring

4. **Demo Cleanup:**
   - Create scripts to reset demo data
   - Implement auto-cleanup of old data
   - Create sample data generation scripts for fresh demos

## Security Considerations for Demo

Even for a demo, maintain security best practices:

1. Use environment variables for all sensitive information
2. Implement proper authentication even in demo environments
3. Use HTTPS for all connections
4. Limit database permissions for demo users
5. Implement rate limiting to prevent abuse

## Next Steps

### Option 1: Docker Deployment (Recommended for Local Demo)

1. Create the `.env` file with required environment variables
2. Run `docker-compose up --build` to start all services
3. Access the application at http://localhost:3000
4. Create demo accounts for client testing
5. Document demo credentials and access instructions

### Option 2: Cloud Deployment (Recommended for Remote Access)

1. Create a Render account and deploy the application using the render.yaml configuration
2. Configure all external services with production credentials
3. Set up a domain name (optional)
4. Create demo accounts for client testing
5. Document the demo environment and access instructions

### Required Credentials to Complete Setup

For both options, you need to provide:

1. Twilio Auth Token for SMS functionality
2. Resend API Key for email functionality 
3. JWT Secret for authentication
4. MongoDB Atlas credentials (if not using the local MongoDB container)