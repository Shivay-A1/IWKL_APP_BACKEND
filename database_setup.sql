-- IWKL Database Setup for Railway PostgreSQL
-- Essential tables for IWKL Women's Kabaddi League App

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  mobile VARCHAR(255) UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'USER',
  avatar VARCHAR(500),
  isVerified BOOLEAN DEFAULT false,
  mobileVerified BOOLEAN DEFAULT false,
  verificationToken VARCHAR(255),
  resetToken VARCHAR(255),
  resetTokenExpiry TIMESTAMP,
  otp VARCHAR(10),
  otpExpiry TIMESTAMP,
  lastLogin TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_mobile ON users(mobile);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Teams Table
CREATE TABLE IF NOT EXISTS teams (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  shortName VARCHAR(50),
  logoUrl VARCHAR(500),
  bannerUrl VARCHAR(500),
  abbreviation VARCHAR(10),
  color VARCHAR(20),
  foundedYear INTEGER,
  homeCity VARCHAR(100),
  stadiumId VARCHAR(255),
  description TEXT,
  socialMedia JSONB,
  seasonId VARCHAR(255),
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for teams
CREATE INDEX IF NOT EXISTS idx_teams_seasonId ON teams(seasonId);
CREATE INDEX IF NOT EXISTS idx_teams_isActive ON teams(isActive);

-- Videos Table
CREATE TABLE IF NOT EXISTS videos (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  videoUrl VARCHAR(500) NOT NULL,
  thumbnailUrl VARCHAR(500),
  category VARCHAR(100),
  duration INTEGER,
  isPremium BOOLEAN DEFAULT false,
  isActive BOOLEAN DEFAULT true,
  viewCount INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  tags TEXT[],
  metadata JSONB,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for videos
CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(category);
CREATE INDEX IF NOT EXISTS idx_videos_isActive ON videos(isActive);
CREATE INDEX IF NOT EXISTS idx_videos_featured ON videos(featured);

-- Seasons Table
CREATE TABLE IF NOT EXISTS seasons (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  year INTEGER NOT NULL,
  startDate TIMESTAMP,
  endDate TIMESTAMP,
  isActive BOOLEAN DEFAULT false,
  isCompleted BOOLEAN DEFAULT false,
  description TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for seasons
CREATE INDEX IF NOT EXISTS idx_seasons_year ON seasons(year);
CREATE INDEX IF NOT EXISTS idx_seasons_isActive ON seasons(isActive);

-- Matches Table
CREATE TABLE IF NOT EXISTS matches (
  id VARCHAR(255) PRIMARY KEY,
  seasonId VARCHAR(255),
  homeTeamId VARCHAR(255),
  awayTeamId VARCHAR(255),
  venue VARCHAR(255),
  matchDate TIMESTAMP,
  status VARCHAR(50) DEFAULT 'SCHEDULED',
  homeScore INTEGER DEFAULT 0,
  awayScore INTEGER DEFAULT 0,
  quarter1Scores JSONB,
  quarter2Scores JSONB,
  quarter3Scores JSONB,
  quarter4Scores JSONB,
  highlights TEXT[],
  isLive BOOLEAN DEFAULT false,
  isPremium BOOLEAN DEFAULT false,
  metadata JSONB,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for matches
CREATE INDEX IF NOT EXISTS idx_matches_seasonId ON matches(seasonId);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_matchDate ON matches(matchDate);

-- Points Table
CREATE TABLE IF NOT EXISTS points_table (
  id VARCHAR(255) PRIMARY KEY,
  seasonId VARCHAR(255),
  teamId VARCHAR(255),
  played INTEGER DEFAULT 0,
  won INTEGER DEFAULT 0,
  lost INTEGER DEFAULT 0,
  tied INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  nrr DECIMAL(10,2) DEFAULT 0.00,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for points table
CREATE INDEX IF NOT EXISTS idx_points_seasonId ON points_table(seasonId);
CREATE INDEX IF NOT EXISTS idx_points_teamId ON points_table(teamId);

-- Gallery Table
CREATE TABLE IF NOT EXISTS gallery (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255),
  imageUrl VARCHAR(500) NOT NULL,
  category VARCHAR(100),
  isPremium BOOLEAN DEFAULT false,
  isActive BOOLEAN DEFAULT true,
  description TEXT,
  tags TEXT[],
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for gallery
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category);
CREATE INDEX IF NOT EXISTS idx_gallery_isActive ON gallery(isActive);

-- News Table
CREATE TABLE IF NOT EXISTS news (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  imageUrl VARCHAR(500),
  category VARCHAR(100),
  isPublished BOOLEAN DEFAULT false,
  isPremium BOOLEAN DEFAULT false,
  publishedAt TIMESTAMP,
  metadata JSONB,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for news
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_isPublished ON news(isPublished);

-- Sample Data for Teams
INSERT INTO teams (id, name, shortName, logoUrl, abbreviation, color, isActive) VALUES
('1', 'Garvi Gujarat', 'GG', 'assets/teams/garvi_gujarat.png', 'GG', '#FF6B35', true),
('2', 'Mumbai Strikers', 'MS', 'assets/teams/mumbai_strikers.jpeg', 'MS', '#1E3A8A', true),
('3', 'Odisha Kalingas', 'OK', 'assets/teams/odisha_kalingas.png', 'OK', '#FF6B35', true)
ON CONFLICT (name) DO NOTHING;

-- Sample Data for Videos
INSERT INTO videos (id, title, description, videoUrl, thumbnailUrl, category, duration, featured, isActive) VALUES
('1', 'IWKL Kabaddi Highlight 1', 'Exciting kabaddi action from IWKL', 'https://youtube.com/shorts/E8YS-cPPdZY?si=JgGJfcXqrXCRqWK9', 'https://img.youtube.com/vi/E8YS-cPPdZY/hqdefault.jpg', 'Highlights', 30, true, true),
('2', 'IWKL Kabaddi Highlight 2', 'More amazing kabaddi moments', 'https://youtube.com/shorts/YZjFff0rfqE?si=9YAFEtAKNtyH_IQP', 'https://img.youtube.com/vi/YZjFff0rfqE/hqdefault.jpg', 'Highlights', 30, true, true),
('3', 'IWKL Kabaddi Highlight 3', 'Best kabaddi skills showcase', 'https://youtube.com/shorts/KMIeFlYcPg0?si=n45a687cXbkcnQb6', 'https://img.youtube.com/vi/KMIeFlYcPg0/hqdefault.jpg', 'Highlights', 30, true, true)
ON CONFLICT DO NOTHING;

-- Sample Data for Season
INSERT INTO seasons (id, name, year, startDate, endDate, isActive, isCompleted) VALUES
('1', 'IWKL 2026', 2026, '2026-01-01', '2026-12-31', true, false)
ON CONFLICT (name) DO NOTHING;

-- Sample Data for Points Table
INSERT INTO points_table (id, seasonId, teamId, played, won, lost, tied, points, nrr) VALUES
('1', '1', '1', 0, 0, 0, 0, 0, 0.00),
('2', '1', '2', 0, 0, 0, 0, 0, 0.00),
('3', '1', '3', 0, 0, 0, 0, 0, 0.00)
ON CONFLICT DO NOTHING;

-- Sample Data for Gallery
INSERT INTO gallery (id, title, imageUrl, category, isActive) VALUES
('1', 'IWKL Gallery 1', 'assets/gallery/gallery_1.png', 'Match', true),
('2', 'IWKL Gallery 2', 'assets/gallery/gallery_2.png', 'Match', true),
('3', 'IWKL Gallery 3', 'assets/gallery/gallery_3.jpg', 'Match', true)
ON CONFLICT DO NOTHING;

-- Create a default admin user (password: admin123 - should be changed in production)
INSERT INTO users (id, name, email, password, role, isVerified, mobileVerified) VALUES
('admin001', 'Super Admin', 'admin@iwkl.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5ZyLmJtN.1q1m', 'SUPER_ADMIN', true, true)
ON CONFLICT (email) DO NOTHING;

COMMIT;