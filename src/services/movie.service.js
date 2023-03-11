import {api} from 'boot/axios'

export const movieService = {
  getAllMovies,
  getAllGenres,
  getMovieDetail,
  getCredits,
};

function getAllMovies(data) {
  return api.request({
    method: 'get',
    url: 'discover/movie',
    // url: 'https://api.themoviedb.org/3/discover/movie',
    params: {api_key: 'f62f750b70a8ef11dad44670cfb6aa57', ...data}
  });
}

function getAllGenres() {
  return api.request({
    method: 'get',
    url: 'genre/movie/list',
    params: {api_key: 'f62f750b70a8ef11dad44670cfb6aa57'}
  });
}

function getMovieDetail(movieID) {
  return api.request({
    method: 'get',
    url: `movie/${movieID}`,
    // url: 'movie/'+movieId,
    params: {api_key: 'f62f750b70a8ef11dad44670cfb6aa57'}
  });
}

function getCredits(movieId) {
  return api.request({
    method: 'get',
    url: `movie/${movieId}/credits`,
    // url: 'movie/'+movieId,
    params: {api_key: 'f62f750b70a8ef11dad44670cfb6aa57'}
  });
}
