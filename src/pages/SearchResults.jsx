import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import MovieCard from '../components/MovieCard';
import { fetchMovies } from '../utils/api';

const SearchResults = ({ query, navigate, preloadMovieDetail }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getResults = async () => {
      setLoading(true);
      const data = await fetchMovies(query);
      setResults(data);
      setLoading(false);

      // Preload movie detail data for top 5 search results
      if (data && data.length > 0) {
        data.slice(0, 5).forEach(movie => {
          preloadMovieDetail(movie.imdbID);
        });
      }
    };
    if (query) {
      getResults();
    }
  }, [query, preloadMovieDetail]);

  const handleMovieClick = (imdbID) => {
    navigate('movieDetail', { imdbID });
  };



  return (
    <div className="search-results">
      {/* Header */}
      <div className="search-header">
        <div className="search-header-content">
          <h2 className="search-title">
            Search Results for "{query}"
          </h2>
        </div>
        
        {!loading && (
          <p className="search-count">
            Found {results.length} result{results.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Results Grid */}
      <div className="search-results-grid">
        {loading ? (
          <div className="loader-container">
            <Loader />
          </div>
        ) : results.length > 0 ? (
          <div className="movies-grid">
            {results.map((movie) => (
              <MovieCard
                key={movie.imdbID}
                movie={movie}
                onHover={preloadMovieDetail}
                onClick={handleMovieClick}
              />
            ))}
          </div>
        ) : (
          <div className="search-empty">
            <div className="search-empty-title">
              No results found for "{query}"
            </div>
            <p className="search-empty-text">
              Try searching for a different movie or TV show
            </p>
            <button
              onClick={() => navigate('home')}
              className="search-empty-button"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
