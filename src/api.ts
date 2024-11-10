const API_KEY = "10923b261ba94d897ac6b81148314a3f";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  name: string
  vote_average: number;
  known_for: IKnownFor[]
}

interface IKnownFor {
  backdrop_path: string;
}

export interface ISearch {
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

// MOVIE
export function getNowMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
// export function getTopRatedMovies() {
//   return fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}`).then(
//     (response) => response.json()
//   );
// }
export function getTopRatedMovies() {
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
export function getUpcomingMovies() {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

// TV
export function getNowTv() {
  return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
export function getTopRatedTv() {
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
export function getUpcomingTv() {
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

// SEARCH
export function getSearch(keyword: string) {
  return fetch(`${BASE_PATH}/search/multi?api_key=${API_KEY}&query=${keyword}`).then(
    (response) => response.json()
  );
}