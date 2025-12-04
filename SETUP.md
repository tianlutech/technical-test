# Technical Test - Product List App

A fullstack Next.js application for managing personal product lists with email-only authentication.

## 🚀 Live Demo

[Deployed on Vercel/Netlify] - Add your deployment URL here

## ✨ Features

- Email-only authentication (no password required)
- Add, edit, and delete products
- Inline editing
- Drag-and-drop reordering
- User isolation (each user sees only their own products)
- Responsive design

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Styling**: Tailwind CSS v4
- **Drag & Drop**: @dnd-kit

## 📦 Local Setup

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Nsarob/technical-test.git
cd technical-test
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` and add your values:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

4. Generate Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔐 How Login Works

The app uses **email-only authentication** powered by NextAuth.js:

1. User enters their email on the login page
2. If the email doesn't exist, a new user is automatically created in the database
3. A JWT session is created and stored in cookies
4. Protected routes check for valid sessions via middleware
5. Users can only see and manage their own products

No passwords are required - authentication is simplified for this demo.

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes (auth, products)
│   ├── login/             # Login page
│   └── products/          # Products page
├── screens/               # Screen components (business logic)
├── layout/                # Reusable UI components (with styling)
├── service/               # API clients and backend services
├── config/                # Configuration (auth, database)
├── prisma/                # Database schema and migrations
└── middleware.ts          # Route protection

```

## 🗄️ Database Schema

### User

- `id`: Unique identifier
- `email`: User email (unique)
- `createdAt`: Timestamp

### Product

- `id`: Unique identifier
- `name`: Product name
- `amount`: Product price/amount
- `comment`: Optional comment
- `order`: Display order (for drag-and-drop)
- `userId`: Foreign key to User
- `createdAt/updatedAt`: Timestamps

## 🚀 Deployment

### Environment Variables

Set these in your deployment platform:

```env
DATABASE_URL="file:./dev.db"  # For SQLite, or use PostgreSQL URL for production
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="https://your-domain.com"  # Auto-set by Vercel
```

### Vercel

1. Connect your GitHub repository
2. Add environment variables
3. Deploy

### Netlify

1. Connect your GitHub repository
2. Add environment variables in Site settings
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Deploy

**Note**: For production, consider switching from SQLite to PostgreSQL for better reliability.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations

## 🎯 Design Decisions

- **No try-catch in UI components**: Errors bubble up naturally
- **Separation of concerns**: Screens contain logic, layouts contain styling
- **DRY components**: Small, reusable, single-responsibility components
- **Semantic commits**: Clear commit history with conventional commit messages
- **Type safety**: Full TypeScript coverage

## 📄 License

ISC
