const pool = require('./database');

const initDatabase = async () => {
  try {
    // Create users table
    await pool.query(`
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
    await pool.query(`
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
    await pool.query(`
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
    await pool.query(`
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
    await pool.query(`
      CREATE TABLE IF NOT EXISTS search_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        query VARCHAR(255) NOT NULL,
        results_count INTEGER,
        searched_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('✅ Database tables created successfully');
  } catch (error) {
    console.error('❌ Error creating database tables:', error);
  }
};

module.exports = initDatabase; 