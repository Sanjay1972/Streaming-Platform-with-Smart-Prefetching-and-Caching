import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres', // Connect to default database first
  password: 'sanjay',
  port: 5432,
});

const initDatabase = async () => {
  try {
    // Create database if it doesn't exist
    await pool.query(`
      SELECT 'CREATE DATABASE video_stream_db'
      WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'video_stream_db')\gexec
    `);
    
    console.log('✅ Database created or already exists');
    
    // Close connection to default database
    await pool.end();
    
    // Connect to the new database
    const dbPool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'video_stream_db',
      password: 'sanjay',
      port: 5432,
    });

    // Create users table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        last_login TIMESTAMP,
        subscription_tier VARCHAR(20) DEFAULT 'free',
        preferences JSONB DEFAULT '{}'
      )
    `);

    // Create movies table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS movies (
        id SERIAL PRIMARY KEY,
        imdb_id VARCHAR(20) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        year INTEGER,
        plot TEXT,
        poster_url VARCHAR(500),
        rating DECIMAL(3,1),
        genre VARCHAR(100),
        director VARCHAR(255),
        actors TEXT,
        video_path VARCHAR(500),
        cached_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create user_watchlist table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS user_watchlist (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        movie_id INTEGER REFERENCES movies(id),
        added_at TIMESTAMP DEFAULT NOW(),
        watched BOOLEAN DEFAULT FALSE,
        watch_progress INTEGER DEFAULT 0,
        UNIQUE(user_id, movie_id)
      )
    `);

    // Create user_ratings table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS user_ratings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        movie_id INTEGER REFERENCES movies(id),
        rating INTEGER CHECK (rating >= 1 AND rating <= 10),
        review TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, movie_id)
      )
    `);

    // Create search_history table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS search_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        query VARCHAR(255) NOT NULL,
        results_count INTEGER,
        searched_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('✅ All tables created successfully');
    await dbPool.end();
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }
};

initDatabase(); 