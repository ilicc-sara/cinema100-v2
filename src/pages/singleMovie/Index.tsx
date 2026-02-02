import { useState, useEffect } from "react";
import { useParams } from "react-router";
import YouTube from "react-youtube";
import type { singleMovie } from "../../types";
import useSingleMovie from "./customHooks/useGetSingleMovie";

function SingleMovie() {
  const [movie, setMovie] = useState<null | singleMovie>(null);

  const params = useParams();

  useEffect(() => {
    useSingleMovie(setMovie, params.movieId);
  }, []);

  return (
    <section>
      <div className="smallLT:w-[70%] tablet:w-[80%] max-tablet:w-[85%] !mx-auto  !my-5 max-tablet:grid max-tablet:grid-cols-2 max-tablet:gap-4">
        <img src={movie?.image} className="h-full min-tablet:hidden " />
        <div className="flex max-tablet:flex-col text-[#e8f0fe] text-left justify-between tablet:items-center max-tablet:items-start">
          <div>
            <p className="text-xl "> {movie?.title} </p>
            <span> ({movie?.year}) </span>
          </div>

          <div className="flex max-tablet:flex-col gap-5">
            <div>
              <p className="text-xl "> Imdb rating </p>
              <p>
                <i className="bxr  bxs-star"></i>{" "}
                <span className="font-medium"> {movie?.rating} </span> / 10
              </p>
            </div>
            <div>
              <p className="text-xl "> Rank </p>
              <p>
                {" "}
                <span className="font-medium"> {movie?.rank} </span> / 100{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="smallLT:w-[70%] tablet:w-[80%] max-tablet:w-[85%] !mx-auto tablet:grid tablet:grid-cols-[1.1fr_3fr]  gap-4">
        <img src={movie?.image} className="h-full max-tablet:hidden " />
        <div className="w-full aspect-video overflow-hidden">
          <YouTube
            className="w-full h-full"
            videoId={movie?.trailer.replace(
              "https://www.youtube.com/embed/",
              ""
            )}
            opts={{
              width: "100%",
              height: "100%",
              playerVars: {
                autoplay: 1,
                mute: 1,
                controls: 1,
                modestbranding: 1,
              },
            }}
          />
        </div>
      </div>
      <div className="smallLT:w-[70%] tablet:w-[80%] max-tablet:w-[85%] !mx-auto">
        <div className=" flex flex-col text-[#e8f0fe] text-left items-start !my-5 gap-4 w-[70%]">
          <p className="text-xl font-medium"> {movie?.genre}</p>
          <p> {movie?.description} </p>
          <hr className="w-full border-t border-[#fff] flex-1 mx-4" />
          <p className="text-xl font-medium"> Director </p>
          <p> {movie?.director} </p>
          <hr className="w-full border-t border-[#fff] flex-1 mx-4" />
          <p className="text-xl font-medium"> Writers </p>
          <p> {movie?.writers} </p>
        </div>
      </div>
    </section>
  );
}

export default SingleMovie;
