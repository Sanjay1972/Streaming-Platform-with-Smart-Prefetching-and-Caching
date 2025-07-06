const API_KEY = "dbd6e3a";
const BASE_URL = "https://www.omdbapi.com/";

const fetchMovies = async (searchQuery = 'Avengers', page = 1) => {
  try {
    const response = await fetch(`${BASE_URL}?s=${searchQuery}&page=${page}&apikey=${API_KEY}`);
    const data = await response.json();
    if (data.Response === "True") {
      return data.Search;
    } else {
      console.error("API Error:", data.Error);
      return [];
    }
  } catch (error) {
    console.error("Network or parsing error:", error);
    return [];
  }
};

const fetchMovieDetail = async (imdbID) => {
  try {
    const response = await fetch(`${BASE_URL}?i=${imdbID}&plot=full&apikey=${API_KEY}`);
    const data = await response.json();
    if (data.Response === "True") {
      return data;
    } else {
      console.error("API Error:", data.Error);
      return null;
    }
  } catch (error) {
    console.error("Network or parsing error:", error);
    return null;
  }
};

export { fetchMovies, fetchMovieDetail };
