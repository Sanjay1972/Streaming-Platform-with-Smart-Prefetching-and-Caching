import React, { useState, useEffect, Suspense, useRef } from 'react';
import Loader from './components/Loader';

// Lazy-loaded components
const LazyHome = React.lazy(() => import('./pages/Home'));
const LazyMovieDetail = React.lazy(() => import('./pages/MovieDetail'));
const LazyVideoPlayer = React.lazy(() => import('./pages/VideoPlayer'));
const LazyLogin = React.lazy(() => import('./pages/Login'));
const LazyRegister = React.lazy(() => import('./pages/Register'));
const LazySearchResults = React.lazy(() => import('./pages/SearchResults'));
const LazyProfile = React.lazy(() => import('./pages/Profile'));
const LazySettings = React.lazy(() => import('./pages/Settings'));

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [pageParams, setPageParams] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  const preloadedMovieDetailData = React.useRef({});
  const preloadedPages = React.useRef(new Set());

  const preloadMovieDetail = async (imdbID) => {
    if (!preloadedMovieDetailData.current[imdbID]) {
      console.log(`Preloading movie details for ID: ${imdbID}`);
      const { fetchMovieDetail } = await import('./utils/api');
      preloadedMovieDetailData.current[imdbID] = await fetchMovieDetail(imdbID);
      console.log(`Movie details preloaded for ID: ${imdbID}`);
    } else {
      console.log(`Movie details already cached for ID: ${imdbID}`);
    }
    return preloadedMovieDetailData.current[imdbID];
  };

  // Preload pages based on user login status
  const preloadPages = async () => {
    if (!isLoggedIn) {
      // Preload login and register pages for non-logged in users
      if (!preloadedPages.current.has('login')) {
        console.log('Preloading Login page...');
        preloadedPages.current.add('login');
        await import('./pages/Login');
        console.log('Login page preloaded successfully');
      }
      if (!preloadedPages.current.has('register')) {
        console.log('Preloading Register page...');
        preloadedPages.current.add('register');
        await import('./pages/Register');
        console.log('Register page preloaded successfully');
      }
    } else {
      console.log('User is logged in, skipping auth page preloading');
    }
  };

  // Preload video player when movie detail is accessed
  const preloadVideoPlayer = async () => {
    if (!preloadedPages.current.has('videoPlayer')) {
      console.log('Preloading Video Player page...');
      preloadedPages.current.add('videoPlayer');
      await import('./pages/VideoPlayer');
      console.log('Video Player page preloaded successfully');
    }
  };

  // Preload search results when user pauses typing
  const preloadSearchResults = async (query) => {
    if (query.trim().length > 2) {
      try {
        console.log('Preloading search results for:', query);
        const { fetchMovies } = await import('./utils/api');
        const results = await fetchMovies(query);
        console.log(`Found ${results.length} movies, preloading details for top 5`);
        // Preload movie details for top 5 results
        results.slice(0, 5).forEach(movie => {
          preloadMovieDetail(movie.imdbID);
        });
        console.log('Search results preloaded successfully');
      } catch (error) {
        console.error('Error preloading search results:', error);
      }
    }
  };

  const navigate = (page, params = {}) => {
    console.log(`Navigating to: ${page}`, params);
    setCurrentPage(page);
    setPageParams(params);
  };

  const handleLoginSuccess = (userData) => {
    console.log('Login successful! User is now logged in');
    setIsLoggedIn(true);
    setUser(userData);
  };

  const handleLogout = () => {
    console.log('User logged out');
    setIsLoggedIn(false);
    setUser(null);
    navigate('login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('searchResults', { query: searchQuery.trim() });
      setShowSuggestions(false);
    }
  };

  const handleSearchInputChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      console.log('Cleared previous search timeout');
    }
    
    if (query.trim().length > 2) {
      console.log('Setting search timeout for:', query);
      // Set timeout to prefetch after user pauses typing (500ms)
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          console.log('Executing search for:', query);
          const { fetchMovies } = await import('./utils/api');
          const results = await fetchMovies(query);
          setSearchSuggestions(results.slice(0, 5)); // Show top 5 suggestions
          setShowSuggestions(true);
          console.log(`Showing ${results.slice(0, 5).length} search suggestions`);
          // Preload movie details for top 5 results
          results.slice(0, 5).forEach(movie => {
            preloadMovieDetail(movie.imdbID);
          });
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSearchSuggestions([]);
        }
      }, 500);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      console.log('Cleared search suggestions');
    }
  };

  const handleSuggestionClick = (movie) => {
    setSearchQuery(movie.Title);
    navigate('movieDetail', { imdbID: movie.imdbID });
    setShowSuggestions(false);
  };

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Preload pages when component mounts or login status changes
  useEffect(() => {
    console.log('App mounted/updated, checking for page preloading...');
    preloadPages();
  }, [isLoggedIn]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <LazyHome navigate={navigate} preloadMovieDetail={preloadMovieDetail} />;
      case 'movieDetail':
        // Preload video player when movie detail is accessed
        preloadVideoPlayer();
        return <LazyMovieDetail imdbID={pageParams.imdbID} navigate={navigate} />;
      case 'videoPlayer':
        return <LazyVideoPlayer movie={pageParams.movie} navigate={navigate} />;
      case 'login':
        return <LazyLogin navigate={navigate} onLoginSuccess={handleLoginSuccess} />;
      case 'register':
        return <LazyRegister navigate={navigate} />;
      case 'searchResults':
        return (
          <LazySearchResults
            query={pageParams.query}
            navigate={navigate}
            preloadMovieDetail={preloadMovieDetail}
          />
        );
      case 'profile':
        return <LazyProfile navigate={navigate} user={user} isLoggedIn={isLoggedIn} />;
      case 'settings':
        return <LazySettings navigate={navigate} />;
      default:
        return <LazyHome navigate={navigate} preloadMovieDetail={preloadMovieDetail} />;
    }
  };

  return (
    <div className="app">
      <nav className="nav">
        <div className="nav-container">
          <div className="nav-left">
            {currentPage !== 'home' && (
              <button
                className="nav-back-button"
                onClick={() => navigate('home')}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
            <div
              className="nav-logo"
              onClick={() => navigate('home')}
            >
              StreamFlix
            </div>
          </div>
          <div className="nav-actions">
            <div className="search-container" ref={searchRef}>
              <form onSubmit={handleSearch} className="search-form">
                <input
                  type="text"
                  placeholder="Search movies..."
                  className="search-input"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                />
                <button
                  type="submit"
                  className="search-button"
                >
                  Search
                </button>
              </form>
              
              {/* Search Suggestions Dropdown */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="search-suggestions">
                  {searchSuggestions.map((movie) => (
                    <div
                      key={movie.imdbID}
                      className="search-suggestion-item"
                      onClick={() => handleSuggestionClick(movie)}
                    >
                      <div className="search-suggestion-title">{movie.Title}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              className="nav-button"
              onClick={() => navigate('home')}
            >
              Home
            </button>
            {isLoggedIn ? (
              <>
                <button
                  className="nav-button"
                  onClick={() => navigate('profile')}
                >
                  Profile
                </button>
                <button
                  className="nav-button"
                  onClick={() => navigate('settings')}
                >
                  Settings
                </button>
                <button
                  className="nav-button-primary"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className="nav-button"
                  onClick={() => navigate('login')}
                >
                  Login
                </button>
                <button
                  className="nav-button-primary"
                  onClick={() => navigate('register')}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="main">
        <Suspense fallback={<Loader />}>{renderPage()}</Suspense>
      </main>
    </div>
  );
}

export default App;
