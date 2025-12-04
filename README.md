# Product List App

A fullstack Next.js application for managing a personal product list with email-only authentication.

## 🚀 Live Demo

**Deployed Application:** [https://tianlu.assessment.olivierkarera.com/](https://tianlu.assessment.olivierkarera.com/)

The application is live and ready for testing. I welcome any feedback on the implementation, design, and overall user experience.

### Note on Design Improvements

While working on this assessment, I reviewed [Tianlu Tech's original website](https://tianlu.tech/) and identified several UI/UX improvements that could enhance its professional appearance. I created an improved version demonstrating these enhancements at [https://tianlu.tech.olivierkarera.com/](https://tianlu.tech.olivierkarera.com/). These insights have been incorporated into the design philosophy of this application, focusing on minimalism, clarity, and user experience.

## Features

- **Email-only login** - No password required, magic link authentication
- **Product management** - Add, edit, delete, and reorder products
- **Inline editing** - Edit products directly in the list
- **User isolation** - Each user sees only their own products
- **Drag and drop reordering** - Reorder products by dragging
- **Minimalistic design** - Clean, flat, elegant UI

## Tech Stack

- **Next.js** (Pages Router)
- **TypeScript**
- **Prisma** (PostgreSQL)
- **Zod** (Validation)
- **Nodemailer + Gmail SMTP** (Email sending)
- **Tailwind CSS** (Styling)
- **JWT** (Authentication)

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Gmail account with App Password (for sending emails)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd "tianlu assessment"
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/productlist?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Gmail SMTP Configuration
GMAIL_USER="your.email@gmail.com"
GMAIL_APP_PASSWORD="your-16-character-app-password"

# Base URL (for email links)
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

4. Set up Prisma:

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

5. Set up Gmail App Password:

   - Go to your Google Account → Security
   - Enable **2-Step Verification** if not already enabled
   - Go to Google Account → Security → App passwords
   - Select app: "Mail" and device: "Other (Custom name)"
   - Enter a name like "Product List App"
   - Click **Generate** and copy the 16-character password
   - Add your Gmail email and app password to `.env`
6. Run the development server:

```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Login Flow

1. **User enters email** - On the login page, user enters their email address
2. **Email sent** - System generates a JWT token and sends a magic link via Gmail SMTP
3. **Click link** - User clicks the link in their email
4. **Token verification** - System verifies the token and creates a session cookie
5. **Access granted** - User is redirected to their product list

The authentication uses JWT tokens stored in HTTP-only cookies for security. Each token contains the user's ID and email, and expires after 7 days (configurable).

## Project Structure

```
├── pages/              # Next.js pages (routing only)
├── src/
│   ├── screens/        # Feature screens (UI logic)
│   ├── layout/         # Reusable UI components (styled)
│   ├── api/            # API route handlers
│   ├── service/        # Business logic
│   │   └── fetch/      # Frontend API client
│   ├── repositories/   # Database operations (Prisma)
│   ├── validators/     # Zod schemas
│   ├── config/         # Configuration
│   ├── models/         # Prisma client
│   └── utils/          # Helper functions
├── prisma/             # Prisma schema
└── styles/             # Global styles
```

## Environment Variables

| Variable                 | Description                            | Required                     |
| ------------------------ | -------------------------------------- | ---------------------------- |
| `DATABASE_URL`         | PostgreSQL connection string           | Yes                          |
| `JWT_SECRET`           | Secret key for JWT signing             | Yes                          |
| `JWT_EXPIRES_IN`       | JWT expiration time                    | No (default: 7d)             |
| `GMAIL_USER`           | Gmail email address for sending emails | Yes                          |
| `GMAIL_APP_PASSWORD`   | Gmail App Password (16-character)      | Yes                          |
| `NEXT_PUBLIC_BASE_URL` | Base URL for email links               | No (default: localhost:3000) |

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run Prisma Studio (database GUI)
npm run prisma:studio
```

## Deployment

### Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Netlify

1. Push your code to GitHub
2. Create new site in Netlify
3. Add build command: `npm run build`
4. Add publish directory: `.next`
5. Add environment variables
6. Deploy

## Docker

The project includes a Dockerfile for containerized deployment:

```bash
# Build the image
docker build -t product-list-app:latest .

# Run the container
docker run -d -p 3000:3000 \
  -e JWT_SECRET=your-secret \
  -e DATABASE_URL=your-database-url \
  -e GMAIL_USER=your-email \
  -e GMAIL_APP_PASSWORD=your-app-password \
  -e NEXT_PUBLIC_BASE_URL=http://localhost:3000 \
  product-list-app:latest
```

## License

MIT
