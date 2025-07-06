import React, { useState } from 'react';

const MovieCard = ({ movie, onHover, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    console.log(`🖱️ Hovering over movie: ${movie.Title} (ID: ${movie.imdbID})`);
    onHover(movie.imdbID);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className="movie-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(movie.imdbID)}
    >
      {/* Movie Poster */}
      <div className="movie-poster-container">
        <img
          src={movie.Poster !== "N/A" ? movie.Poster : "https://placehold.co/300x450/1a1a1a/FFFFFF?text=No+Poster"}
          alt={movie.Title}
          className={`movie-poster ${isHovered ? 'scale-110' : 'scale-100'}`}
          onError={(e) => { 
            e.target.onerror = null; 
            e.target.src = "https://placehold.co/300x450/1a1a1a/FFFFFF?text=No+Poster"; 
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="movie-gradient" />
        
        {/* Hover Content */}
        <div className={`movie-hover-content ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <h3 className="movie-hover-title">{movie.Title}</h3>
          <p className="movie-hover-year">{movie.Year}</p>
          
          {/* Action Buttons */}
          <div className="movie-actions">
            <button className="movie-action-button">
              ▶ Play
            </button>
            <button className="movie-action-button movie-action-button-secondary">
              ℹ Info
            </button>
          </div>
        </div>
      </div>
      
      {/* Default Title (shown when not hovered) */}
      <div className={`movie-default-info ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
        <h3 className="movie-default-title">{movie.Title}</h3>
        <p className="movie-default-year">{movie.Year}</p>
      </div>
    </div>
  );
};

export default MovieCard;
