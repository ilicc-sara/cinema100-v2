export type singleMovie = {
  rank: number;
  title: string;
  thumbnail: string;
  rating: string;
  id: string;
  year: number;
  image: string;
  description: string;
  trailer: string;
  genre: string[];
  director: string[];
  writers: string[];
  imdbid: string;
};

export type Filters = {
  search: string;
  activeGenre: string;
};

export type MovieItemProps = {
  item: singleMovie;
  index: number;
  details: boolean;
};

export type TrendingProps = {
  currentlyTrending: singleMovie[] | null;
};

export type ActiveMoviesProps = {
  activeMovies: singleMovie[] | null;
};

export type Genres = {
  id: number;
  created_at: string;
  genre: string;
};
