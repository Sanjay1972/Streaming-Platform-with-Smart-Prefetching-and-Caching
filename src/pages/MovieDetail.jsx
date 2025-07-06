import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import { fetchMovieDetail } from '../utils/api';

const PLOT_LIMIT = 200;

const MovieDetail = ({ imdbID, navigate }) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullPlot, setShowFullPlot] = useState(false);

  useEffect(() => {
    const getMovie = async () => {
      setLoading(true);
      const data = await fetchMovieDetail(imdbID);
      setMovie(data);
      setLoading(false);
    };
    if (imdbID) {
      getMovie();
    }
  }, [imdbID]);

  if (loading) {
    return (
      <div className="movie-detail">
        <div className="loader-container">
          <Loader />
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="movie-detail">
        <div className="loader-container">
          <div className="text-center">
            <h1 className="section-title">Movie not found</h1>
          </div>
        </div>
      </div>
    );
  }

  const plot = movie.Plot || '';
  const isLongPlot = plot.length > PLOT_LIMIT;
  const displayedPlot = showFullPlot || !isLongPlot ? plot : plot.slice(0, PLOT_LIMIT) + '...';

  return (
    <div className="movie-detail">
      {/* Backdrop Image */}
      <div className="movie-backdrop">
      <img
          src={movie.Poster !== "N/A" ? movie.Poster : "https://placehold.co/1920x1080/1a1a1a/FFFFFF?text=No+Poster"}
        alt={movie.Title}
          className="movie-backdrop-image"
          onError={(e) => { 
            e.target.onerror = null; 
            e.target.src = "https://placehold.co/1920x1080/1a1a1a/FFFFFF?text=No+Poster"; 
          }}
        />
        
        {/* Gradient Overlays */}
        <div className="movie-backdrop-overlay" />
        <div className="movie-backdrop-overlay-left" />
        

        
        {/* Movie Info Overlay */}
        <div className="movie-info-overlay">
          <div className="movie-info-content">
            <h1 className="movie-detail-title">{movie.Title}</h1>
            <div className="movie-meta">
              <span className="movie-rating">{movie.imdbRating} ⭐</span>
              <span>{movie.Year}</span>
              <span>{movie.Runtime}</span>
              <span className="movie-rating-badge">{movie.Rated}</span>
            </div>
            <p className="movie-plot">
              {displayedPlot}
              {isLongPlot && (
                <button
                  className="movie-plot-toggle"
                  onClick={() => setShowFullPlot((v) => !v)}
                >
                  {showFullPlot ? 'Show Less' : 'Show More'}
                </button>
              )}
            </p>
            
            {/* Action Buttons */}
            <div className="movie-detail-actions">
              <button 
                className="movie-detail-button movie-detail-button-primary"
                onClick={() => navigate('videoPlayer', { movie })}
              >
                <span>▶</span>
                <span>Watch Now</span>
              </button>
              <button className="movie-detail-button movie-detail-button-secondary">
                <span>ℹ</span>
                <span>More Info</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Detailed Information */}
      <div className="movie-details-section">
        <div className="movie-details-content">
          <div className="movie-details-grid">
            <div>
              <h3 className="movie-details-section-title">Cast & Crew</h3>
              <div className="movie-details-list">
                <div className="movie-details-item">
                  <span className="movie-details-label">Director:</span>
                  <span className="movie-details-value">{movie.Director}</span>
                </div>
                <div className="movie-details-item">
                  <span className="movie-details-label">Writer:</span>
                  <span className="movie-details-value">{movie.Writer}</span>
                </div>
                <div className="movie-details-item">
                  <span className="movie-details-label">Actors:</span>
                  <span className="movie-details-value">{movie.Actors}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="movie-details-section-title">Details</h3>
              <div className="movie-details-list">
                <div className="movie-details-item">
                  <span className="movie-details-label">Genre:</span>
                  <span className="movie-details-value">{movie.Genre}</span>
                </div>
                <div className="movie-details-item">
                  <span className="movie-details-label">Language:</span>
                  <span className="movie-details-value">{movie.Language}</span>
                </div>
                <div className="movie-details-item">
                  <span className="movie-details-label">Country:</span>
                  <span className="movie-details-value">{movie.Country}</span>
                </div>
                <div className="movie-details-item">
                  <span className="movie-details-label">Awards:</span>
                  <span className="movie-details-value">{movie.Awards}</span>
                </div>
                <div className="movie-details-item">
                  <span className="movie-details-label">Box Office:</span>
                  <span className="movie-details-value">{movie.BoxOffice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
