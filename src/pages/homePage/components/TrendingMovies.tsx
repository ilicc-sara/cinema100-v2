import { Splide, SplideSlide } from "@splidejs/react-splide";
import MovieItem from "./MovieItem";
import type { TrendingProps, singleMovie } from "../../../types";

function TrendingMovies({ currentlyTrending }: TrendingProps) {
  function TrendingMoviesSlide(
    currentlyTrending: singleMovie[],
    rangeIndex1: number,
    rangeIndex2?: number
  ) {
    if (rangeIndex2) {
      return (
        <div className="grid smallLT:grid-cols-4 max-smallLT:grid-cols-2 smallLT:gap-7 max-smallLT:gap-3 smallLT:!px-5 max-smallLT:!px-[0px] w-[90%] !mx-auto">
          {currentlyTrending.map((item: any, index: number) => {
            if (index > rangeIndex1 && index <= rangeIndex2) {
              return <MovieItem details={false} item={item} index={index} />;
            }
          })}
        </div>
      );
    } else {
      return (
        <div className="grid smallLT:grid-cols-4 max-smallLT:grid-cols-2 smallLT:gap-7 max-smallLT:gap-3 smallLT:!px-5 max-smallLT:!px-3 w-[90%] !mx-auto">
          {currentlyTrending.map((item, index) => {
            if (index <= rangeIndex1) {
              return <MovieItem details={false} item={item} index={index} />;
            }
          })}
        </div>
      );
    }
  }
  return (
    <Splide
      className="currently-trending-slider"
      options={{
        type: "slide",
        perPage: 1,
        gap: "1rem",
        rewind: true,
      }}
    >
      <SplideSlide>
        {currentlyTrending && TrendingMoviesSlide(currentlyTrending, 3)}
      </SplideSlide>
      <SplideSlide>
        {currentlyTrending && TrendingMoviesSlide(currentlyTrending, 3, 7)}
      </SplideSlide>
      <SplideSlide>
        {currentlyTrending && TrendingMoviesSlide(currentlyTrending, 7, 11)}
      </SplideSlide>
      <SplideSlide>
        {currentlyTrending && TrendingMoviesSlide(currentlyTrending, 11, 15)}
      </SplideSlide>
      <SplideSlide>
        {currentlyTrending && TrendingMoviesSlide(currentlyTrending, 15, 19)}
      </SplideSlide>
    </Splide>
  );
}

export default TrendingMovies;
