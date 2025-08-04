# 🧪 Developer Technical Test – Product List App

## 🧩 Goal

Build a simple fullstack **Next.js** app (frontend + backend) to manage a personal product list.

---

## 📋 Features

- ✅ **Email-only Authentication** - Simple login with just an email address
- ✅ **Product Management** - Create, view, edit, and delete products with:
  - `product name`
  - `amount` 
  - `comment`
- ✅ **Drag & Drop Reordering** - Intuitive product list reordering with visual feedback
- ✅ **User Isolation** - Each user sees only their own products
- ✅ **Responsive Design** - Optimized for both web and mobile

---

## ⚙️ Tech Stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS, @dnd-kit
- **Backend:** Next.js API Routes, JWT Authentication
- **Database:** PostgreSQL with Prisma ORM

---

## 🚀 Local Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.sample .env
   # Edit .env with your database credentials and JWT secret
   ```

3. **Set up the database:**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Create and apply database migrations
   npx prisma migrate dev
   
   # Optional: View your data in Prisma Studio
   npx prisma studio
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 💡 How It Works

### Authentication
- Enter any email address to log in (no password required)
- JWT token stored in localStorage for session management
- Each user's data is completely isolated

### Product Management
- **Add Products:** Click "Add Product" to create new items with name, price, and optional comments
- **Edit/Delete:** Use the action buttons on each product card
- **Reorder:** Drag products by the grip handle to reorder your list
- **Real-time Updates:** All changes are immediately saved to the database

---

## 🔗 API Endpoints

- `POST /api/auth/login` - Email-only authentication
- `GET /api/product` - List user's products
- `POST /api/product` - Create new product
- `PUT /api/product/[id]` - Update existing product
- `DELETE /api/product/[id]` - Delete product
- `PATCH /api/product/reorder` - Reorder products

---

## 📁 Architecture

### Folder Structure
- `pages/` → Next.js routing (references to screen folder)
- `pages/api/` → API routes with authentication
- `src/config/` → Configuration files
- `src/screen/` → Main application screens and logic
- `src/layout/` → Reusable UI components with styling
- `src/service/` → Backend business logic
- `src/frontend-service/` → API client and data fetching
- `src/hooks/` → Custom React hooks
- `src/utils/` → jwt middleware and utilities
- `prisma/` → Prisma schema and migrations
