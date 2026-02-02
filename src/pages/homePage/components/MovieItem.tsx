import { Link } from "react-router";
import type { MovieItemProps } from "../../../types";
import { UserAuth } from "../../../context/AuthContext";
import { supabase } from "../../../supabase-client";
import useSelectSlide from "../customHooks/useSelectSlide";

function MovieItem({ item, index, details }: MovieItemProps) {
  const { userId, bookmarkedMovies, setBookmarkedMovies } = UserAuth();
  // prettier-ignore
  // const { activeMovies, setActiveMovies, selectActiveSlideMovies, bookmarked, setBookmarked } = useSelectSlide();

  const checkIfMovieIsBookmarked = async (userID: string, movieID: string) => {
    try {
      const { data, error } = await supabase
        .from("bookmarkedMovies")
        .select("id")
        .eq("movieID", movieID)
        .eq("userID", userID)
        .maybeSingle();

      if (error) {
        console.error(error);
        return false;
      }
      return !!data;
    } catch (error) {
      console.error(error);
      return false;
    }
  };
  const bookmarkMovie = async (userID: string, movieID: string) => {
    const isBookmarked = await checkIfMovieIsBookmarked(userID, movieID);
    if (!isBookmarked) {
      try {
        const { data, error } = await supabase
          .from("bookmarkedMovies")
          .insert([{ userID: userID, movieID: movieID }])
          .single();

        console.log("data data", data);
        if (error) {
          console.error(error, "data can not be saved");
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      const { error } = await supabase
        .from("bookmarkedMovies")
        .delete()
        .eq("userID", userID)
        .eq("movieID", movieID);

      if (error) {
        console.error("Delete failed", error);
        return;
      }
    }
  };

  return (
    <article className="text-[#e8f0fe] flex flex-col gap-2 h-full">
      <div className="relative">
        <img
          className="w-full h-full object-cover"
          key={index}
          src={item.image}
        />
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.4)] opacity-0 hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
          <Link to={`movie/${item.imdbid}`} relative="path">
            <button className="text-[#141414] bg-[#e8f0fe80] hover:text-[#e8f0fe] hover:bg-[#14141480] transition-all duration-200 flex justify-center items-center gap-1 !px-2 !py-1 rounded-xl cursor-pointer">
              <span>See more</span> <i className="bxr  bx-search"></i>
            </button>
          </Link>

          <button
            onClick={() => bookmarkMovie(userId ? userId : "", item.imdbid)}
            className="absolute top-[10px] right-[10px] z-20 text-[#141414] bg-[#e8f0fe80] hover:text-[#e8f0fe] hover:bg-[#14141480] transition-all duration-200 flex justify-center items-center gap-1 !p-2 rounded-full cursor-pointer"
          >
            <i className="bxr  bx-bookmark"></i>
          </button>
        </div>
      </div>

      <div className={`!mt-auto ${details ? "visible" : "invisible"}`}>
        <p className="text-base text-left font-medium w-full truncate">
          {" "}
          {item.title}{" "}
        </p>
        <div className="flex justify-start items-center">
          <span> {item.year} </span>
          <div className="flex items-center !px-2 gap-1">
            <i className="bxr  bxs-star"></i>
            <span> {item.rating} </span>
          </div>
          <span className="w-full truncate"> {item.genre} </span>
        </div>
      </div>
    </article>
  );
}

export default MovieItem;
