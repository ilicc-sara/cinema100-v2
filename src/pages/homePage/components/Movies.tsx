import MovieItem from "./MovieItem";
import type { ActiveMoviesProps } from "../../../types";

function Movies({ activeMovies }: ActiveMoviesProps) {
  return (
    <div className="grid smallLT:grid-cols-4 max-smallLT:grid-cols-2 smallLT:gap-7 max-smallLT:gap-3 !px-5 smallLT:!px-5 max-smallLT:!px-[0px]">
      {activeMovies?.map((item, index) => {
        return <MovieItem details={true} item={item} index={index} />;
      })}
    </div>
  );
}

export default Movies;
