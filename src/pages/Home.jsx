import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import MovieCard from '../components/MovieCard';
import { fetchMovies } from '../utils/api';

const Home = ({ navigate, preloadMovieDetail }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMovies = async () => {
      setLoading(true);
      const data = await fetchMovies('popular');
      setMovies(data);
      setLoading(false);
    };
    getMovies();
  }, []);

  const handleMovieClick = (imdbID) => {
    navigate('movieDetail', { imdbID });
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay" />
        <div className="hero-overlay-bottom" />
        
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">StreamFlix</h1>
            <p className="hero-subtitle">Unlimited movies, TV shows, and more</p>
            <button className="hero-button">
              Start Watching
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="content-section">
        {/* Popular Movies Section */}
        <div className="mb-12">
          <h2 className="section-title">Popular Movies</h2>
          {loading ? (
            <div className="loader-container">
              <Loader />
            </div>
          ) : (
            <div className="movies-grid">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.imdbID}
                  movie={movie}
                  onHover={preloadMovieDetail}
                  onClick={handleMovieClick}
                />
              ))}
            </div>
          )}
        </div>

        {/* Trending Now Section */}
        <div className="mb-12">
          <h2 className="section-title">Trending Now</h2>
          {!loading && (
            <div className="movies-grid">
              {movies.slice(0, 12).map((movie) => (
                <MovieCard
                  key={`trending-${movie.imdbID}`}
                  movie={movie}
                  onHover={preloadMovieDetail}
                  onClick={handleMovieClick}
                />
              ))}
            </div>
          )}
        </div>

        {/* Continue Watching Section */}
        <div className="mb-12">
          <h2 className="section-title">Continue Watching</h2>
          {!loading && (
            <div className="movies-grid">
              {movies.slice(0, 6).map((movie) => (
                <MovieCard
                  key={`continue-${movie.imdbID}`}
                  movie={movie}
                  onHover={preloadMovieDetail}
                  onClick={handleMovieClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
