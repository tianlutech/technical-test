# Product List App

A full-stack Next.js application for managing personal product lists with Firebase backend and Google authentication.

## 🚀 Features

- ✅ **Google (Gmail) Authentication** - Sign in with your Google account
- ✅ **Product Management** - Add, edit, delete, and reorder products
- ✅ **Inline Editing** - Edit products directly in the list
- ✅ **User Isolation** - Each user sees only their own products
- ✅ **Real-time Updates** - Instant feedback with toast notifications
- ✅ **Responsive Design** - Works on all devices

## 🏗️ Architecture

### Frontend
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Hook Form** for form management
- **React Hot Toast** for notifications

### Backend
- **Firebase Authentication** for Google sign-in
- **Firebase Firestore** for data storage
- **Next.js API Routes** for backend logic

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication page
│   └── products/          # Products page
├── firebase/              # Firebase configuration & collections
├── layout/                # Reusable UI components
├── screens/               # Page components
├── service/               # Business logic & API calls
├── contexts/              # React contexts
├── hooks/                 # Custom React hooks
└── types/                 # TypeScript type definitions
```

## 🛠️ Local Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project

### 1. Clone and Install
```bash
git clone <repository-url>
cd product-list-app
npm install
```

### 2. Firebase Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Google provider
3. Create a Firestore database
4. Get your Firebase configuration

### 3. Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 4. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🔐 Authentication

The app uses **Google Authentication** with Firebase:

1. **Sign In**: Click "Continue with Google" on the auth page
2. **Gmail Account**: Use your Gmail account to sign in
3. **Automatic Redirect**: After successful authentication, you're redirected to the products page
4. **Session Management**: Firebase handles session persistence automatically

## 📱 Usage

### Adding Products
1. Click "Add Product" button
2. Fill in the product details:
   - **Name** (required)
   - **Amount** (required, positive number)
   - **Comment** (optional)
3. Click "Add Product" to save

### Managing Products
- **Edit**: Click "Edit" button on any product for inline editing
- **Delete**: Click "Delete" button to remove a product
- **Reorder**: Drag and drop products to reorder them (coming soon)

### User Data
- Each user sees only their own products
- Data is automatically filtered by user ID
- No cross-user data access

## 🏛️ Technical Implementation

### Authentication Flow
1. User clicks "Continue with Google"
2. Firebase opens Google sign-in popup
3. User authenticates with Google
4. Firebase creates/updates user account
5. App receives user data and redirects to products

### Data Flow
1. **Frontend** → API Routes → Service Layer → Firebase Collections
2. **Authentication** is checked at API level
3. **User isolation** is enforced at service level
4. **Real-time updates** via optimistic UI updates

### Security Features
- ✅ Firebase Authentication for secure sign-in
- ✅ User data isolation (each user only sees their products)
- ✅ API route authentication checks
- ✅ Input validation and sanitization
- ✅ Error handling with user-friendly messages

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Similar to Vercel setup
- **Firebase Hosting**: Can be used with Next.js static export
- **AWS/GCP**: Use with Docker containers

## 🧪 Testing

### Manual Testing
1. **Authentication**: Test Google sign-in flow
2. **CRUD Operations**: Test add, edit, delete products
3. **User Isolation**: Verify users only see their own data
4. **Responsive Design**: Test on mobile and desktop

### Automated Testing (Future)
- Unit tests for service layer
- Integration tests for API routes
- E2E tests for user flows

## 📝 Development Guidelines

### Code Style
- **TypeScript** for all new code
- **ESLint** for code quality
- **Prettier** for formatting
- **Semantic commits** for version control

### Component Structure
- **Layout components**: Only contain CSS/Tailwind
- **Screen components**: Business logic and state
- **Service layer**: API calls and data transformation
- **No try-catch in UI components**: Handle errors at service level

### File Naming
- All files in lowercase
- Use dots for separation: `product-item.component.tsx`
- Follow Next.js App Router conventions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using Next.js, Firebase, and TypeScript**
