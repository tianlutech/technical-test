# Product List App

A simple fullstack Next.js application for managing a personal product list.

## Features

- ✅ **Email-only authentication** - Login with just your email (no password required)
- ✅ **Product management** - Add, view, edit, and delete products
- ✅ **Inline editing** - Edit product details directly in the list
- ✅ **Drag & drop reordering** - Reorder your products by dragging
- ✅ **User isolation** - Each email sees only their own products

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM

## Local Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository:

```bash
git clone git@github.com:Toussaint-Manzi/technical-test.git
cd technical-test
```

2. Install dependencies:

```bash
npm install
yarn install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` and add your PostgreSQL connection string:

```
DATABASE_URL="postgresql://user:password@localhost:5432/product_list_db"
```

4. Run database migrations:

```bash
npx prisma migrate dev
```

5. Start the development server:

```bash
npm run dev
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser. This is the default port (:3000), yours might be different if the port is already in use.

## How Login Works

This app uses a **passwordless email authentication** system:

1. **User enters their email** on the login page
2. **Server creates or finds the user** - If the email doesn't exist, a new user is created automatically
3. **Session token is generated** - A unique session token is created and stored in the database
4. **Token is stored client-side** - The token is saved in `localStorage` for subsequent requests
5. **All API requests are authenticated** - The token is sent in the `Authorization` header as a Bearer token
6. **User isolation** - Each authenticated request filters data by the user's ID, ensuring users only see their own products

## Project Structure

```
├── pages/              # Next.js routing (thin wrappers to screens)
│   ├── api/            # API routes
│   │   ├── auth/       # Authentication endpoints
│   │   └── products/   # Product CRUD endpoints
│   ├── index.tsx       # Login page route
│   └── products.tsx    # Products page route
├── src/
│   ├── api/            # Backend API logic & database operations
│   ├── config/         # Configuration files
│   ├── layout/         # Reusable UI components (with Tailwind)
│   ├── screens/        # Page components (no direct CSS)
│   │   ├── auth/       # Authentication screens
│   │   └── products/   # Product management screens
│   ├── service/        # Frontend fetch layer
│   └── types/          # TypeScript type definitions
├── prisma/
│   └── schema.prisma   # Database schema
└── styles/
    └── globals.css     # Global styles
```

## API Endpoints

| Method | Endpoint                | Description            |
| ------ | ----------------------- | ---------------------- |
| POST   | `/api/auth/login`       | Login with email       |
| POST   | `/api/auth/logout`      | Logout current session |
| GET    | `/api/auth/me`          | Get current user       |
| GET    | `/api/products`         | List all products      |
| POST   | `/api/products`         | Create a new product   |
| GET    | `/api/products/[id]`    | Get a single product   |
| PUT    | `/api/products/[id]`    | Update a product       |
| DELETE | `/api/products/[id]`    | Delete a product       |
| PUT    | `/api/products/reorder` | Reorder products       |

## Live Demo

🔗 [View Live Demo](https://my-products-azure.vercel.app/)

## License

MIT
