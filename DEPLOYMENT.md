# Deployment Guide

This project is a monorepo:

- `client/` is the React/Vite frontend.
- `server/` is the Express/MongoDB API.

Deploy the backend first, then deploy the frontend.

## 1. Prepare MongoDB Atlas

1. Create a MongoDB Atlas cluster.
2. Create a database user.
3. In Network Access, allow your host. For Render, `0.0.0.0/0` is the simplest option.
4. Copy the connection string and replace the username, password, and database name.

Example:

```text
mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/salon?retryWrites=true&w=majority
```

## 2. Deploy Backend on Render

1. Push this repository to GitHub.
2. Go to Render and create a new Web Service from the repository.
3. Use these settings:

```text
Root Directory: server
Build Command: npm ci
Start Command: npm start
Health Check Path: /api/health
```

You can also use the `render.yaml` blueprint in the repo.

Add these environment variables in Render:

```text
NODE_ENV=production
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=use_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-vercel-site.vercel.app

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=Glamour Salon <your_email@gmail.com>

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

After deploy, check:

```text
https://your-render-service.onrender.com/api/health
```

## 3. Seed Production Data

After the backend is deployed and `MONGO_URI` is set, run the seed command on Render.

In Render:

```text
npm run seed
```

This creates the admin user and starter salon data.

## 4. Deploy Frontend on Vercel

1. Import the same GitHub repository into Vercel.
2. Set the project root directory to `client`.
3. Use these settings:

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm ci
```

Add this environment variable in Vercel:

```text
VITE_API_URL=https://your-render-service.onrender.com/api
```

Deploy the frontend.

## 5. Final CORS Update

After Vercel gives you the final frontend URL, go back to Render and set:

```text
CLIENT_URL=https://your-vercel-site.vercel.app
```

Then redeploy the backend.

## 6. Git Commands

If your local changes are ready:

```bash
git add render.yaml client/vercel.json DEPLOYMENT.md client/package.json server/package.json
git commit -m "Add deployment configuration"
git push origin main
```
