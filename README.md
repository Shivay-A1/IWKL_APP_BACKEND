# IWKL Backend API

Backend API for IWKL (Indian Women's Kabaddi League) application.

## Features
- RESTful API with Express.js
- PostgreSQL database with Prisma ORM
- JWT Authentication
- Admin panel support
- Real-time match updates
- Team management
- Video/Gallery management

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your database credentials:
```
DATABASE_URL="postgresql://user:password@localhost:5432/iwkl_db"
JWT_SECRET="your-jwt-secret"
PORT=3000
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Seed the database:
```bash
npm run seed
```

6. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get team by ID
- `POST /api/teams` - Create team (admin only)

### Matches
- `GET /api/matches` - Get all matches
- `GET /api/matches/:id` - Get match by ID
- `POST /api/matches` - Create match (admin only)

### Videos
- `GET /api/videos` - Get all videos
- `POST /api/videos` - Upload video (admin only)

## Deployment

This backend can be deployed to:
- Render
- Railway
- Vercel
- Heroku
- AWS/GCP/Azure

## License

MIT License