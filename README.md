# 🧪 Developer Technical Exercise – Product List App

## 🚀 Live Demo

**[https://tainlu-demo.netlify.app/](https://tainlu-demo.netlify.app/)**

---

## 🧩 Goal

Build a simple fullstack **Next.js** app (frontend + backend) to manage a personal product list.

---

## 📋 Features

- ✅ Login with **email only** (no password)
- ✅ Add products with:
  - `product name`
  - `amount`
  - `comment`
- ✅ View, edit, delete, and reorder product list (inline editing)
- ✅ Each email sees only their own items

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL (Aiven Cloud)
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5
- **Drag & Drop**: @dnd-kit
- **Deployment**: Netlify

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (or use the provided Aiven credentials)

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

Edit `.env` and add your database credentials:
```env
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

---

## 🔐 How Authentication Works

This app uses **NextAuth.js v5** with a custom credentials provider for email-only authentication:

1. **No Password Required**: Users only need to enter their email address
2. **Auto User Creation**: If the email doesn't exist, a new user is automatically created in the database
3. **JWT Sessions**: Authentication state is managed using JWT tokens stored in secure HTTP-only cookies
4. **User Isolation**: Each user can only see and manage their own products (enforced at the API level)
5. **Protected Routes**: Middleware automatically redirects unauthenticated users to the login page

### Authentication Flow:
```
User enters email → NextAuth validates → 
Check if user exists in DB → 
If not, create new user → 
Generate JWT token → 
Store in secure cookie → 
Redirect to products page
```

---

## ⚙️ Technical Requirements

### 🗂️ Folder Structure

- `pages` → Next.js routing. Keep it just a reference to the screen folder
````
      import LoginPage from '../src/screen/auth/login.page';
      
      export default function Login() {
        return <LoginPage />;
      }

`````
- `screens` → A folder for sets of screens (e.g. todo list), can contain subfolders for subcomponents
- `layout` → General UI components with all styling (buttons, inputs, texts, labels). No CSS in `screens`, only layout components use Tailwind or style
- `service` → Fetch layer (frontend)
- `config` → Configuration files
- `api` → API logic that checks authentication and handles errors (e.g. item not found)
- `service` → Backend logic between `api` and database

### 📌 Component Constraints

- Avoid multiple `useCallback` or `useEffect` per component — if needed, split into subcomponents
- Keep components **dry**, **simple**, and **small**
- ❌ No `try-catch` in screen or layout components
- ❌ Avoid deeply nested or complex `if-else` logic
- ✅ Only layout components should contain CSS or Tailwind classes

### 📁 File Naming Convention

- All filenames in lowercase
- Format:
  - `todo-list.adapter.ts`
  - `button.layout.ts`
  - `main.page.ts`

---

## 🔁 Workflow

1. Fork this repository  
2. Work on your fork (commit regularly)  
3. When finished, open a **Pull Request (PR)** back to the original repo  
4. Use a meaningful title and clear commit history  
5. Use **semantic commits** (e.g. `feat:`, `fix:`, `refactor:`)

---

## 🚀 Submission Checklist

- ✅ Code pushed to your GitHub fork  
- ✅ PR opened to the base repo  
- ✅ Live demo deployed to **Vercel** or **Netlify**  
- ✅ Short `README.md` with:
  - Local setup instructions (`npm install && npm run dev`)
  - Basic explanation of how login works

---

## 🧪 Evaluation Phases

1. Initial Delivery – core implementation review  
2. Follow-up Feedback Simulation – you’ll be asked to implement 1–2 improvements (e.g. sorting, analytics)

---

## ⏱️ Estimated Time

~8 hours. Keep it simple but clean.
