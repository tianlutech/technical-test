# Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "product-list-app")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Click on "Google" provider
5. Enable it and configure:
   - Project support email: your email
   - Authorized domains: Add `localhost` for development
6. Click "Save"

## Step 3: Create Firestore Database

1. In your Firebase project, go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose closest to your users)
5. Click "Done"

## Step 4: Get Firebase Configuration

1. In your Firebase project, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "product-list-app")
6. Copy the configuration object

## Step 5: Create Environment File

Create a `.env.local` file in your project root with the following content:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

Replace the values with your actual Firebase configuration.

## Step 6: Test the Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000`
3. Click "Get Started" to go to the auth page
4. Try signing in with Google

## Troubleshooting

### "auth/invalid-api-key" Error
- Make sure your `.env.local` file exists in the project root
- Verify all environment variables are set correctly
- Restart the development server after adding environment variables

### Google Sign-in Not Working
- Ensure Google provider is enabled in Firebase Authentication
- Check that `localhost` is added to authorized domains
- Verify your Firebase project is in the correct region

### Firestore Permission Errors
- Make sure Firestore is created and in test mode
- Check that the database rules allow read/write access

## Security Rules (Optional)

For production, you should set up proper Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Deployment

When deploying to Vercel or other platforms:

1. Add the same environment variables in your deployment platform
2. Update authorized domains in Firebase to include your production domain
3. Consider switching Firestore from test mode to production mode with proper security rules 