import { useEffect, useState } from "react";
import { supabase } from "../../supabase-client";
import useCountData from "./customHooks/useCountData";
import useTrendingData from "./customHooks/useTrendingData";
import useGenres from "./customHooks/useGenres";
import useSelectSlide from "./customHooks/useSelectSlide";
import useFindGenre from "./customHooks/useFindGenre";
import TrendingMovies from "./components/TrendingMovies";
import Movies from "./components/Movies";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import SliderButton from "../../UI/SliderButton";
import Button from "../../UI/Button";
import { useNavigate } from "react-router";
import { UserAuth } from "../../context/AuthContext";

function Home() {
  // prettier-ignore
  const { activeMovies, setActiveMovies, selectActiveSlideMovies, bookmarked, setBookmarked } = useSelectSlide();
  const { slidesAmount, fetchCountData } = useCountData();
  const { currentlyTrending, fetchTrendingData } = useTrendingData();
  const { genres, fetchGenres } = useGenres();
  const [activeSlide, setActiveSlide] = useState<number>(1);
  const [activeGenre, setActiveGenre] = useState<string>("all");

  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const MAX_SLIDES = slidesAmount?.length;

  const { setSession, setUserId, userId } = UserAuth();

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("sb-yyocycmzxqjdvkwqlpzd-auth-token");
    if (token) {
      setUserId(JSON.parse(token).user.id);
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
      });

      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });
    } else {
      console.error();
      navigate("/login");
    }
  }, []);

  // COUNTING MOVIES IN THE BASE AND FORMING SLIDES ACCORDINGLY, SELECTING TRENDING DATA AND SELECTING GENRES
  useEffect(() => {
    fetchCountData();
    fetchTrendingData();
    fetchGenres();
  }, []);

  // SELECTIGN ACTIVE MOVIES FROM ACTIVE SLIDE
  useEffect(() => {
    selectActiveSlideMovies((activeSlide - 1) * 12, activeSlide * 12 - 1);
    setSearch("");
    setBookmarked(false);
  }, [activeSlide, selectActiveSlideMovies]);

  // FINDING MOVIES ACCORDING TO SELECTED GENRE OR ELSE (if activated "all") RETURNING TO SLIDE 1
  useEffect(() => {
    if (activeGenre !== "all") {
      useFindGenre(setLoading, activeGenre, setActiveMovies, setActiveSlide);
    } else {
      selectActiveSlideMovies((activeSlide - 1) * 12, activeSlide * 12 - 1);
      setSearch("");
    }
    setBookmarked(false);
  }, [activeGenre]);

  const handleSumbit = async (e: any) => {
    e.preventDefault();
    try {
      const { error, data } = await supabase
        .from("moviesData")
        .select()
        .ilike("title", `%${search}%`)
        .limit(12);
      if (data?.length === 0) {
        setSearch("");
        throw new Error(`No movies with this name: ${search}`);
      } else {
        setActiveMovies(data);
      }
      if (error) {
        toast.error(error.message);
      }
    } catch (error: any) {
      console.error("Error finding single movie: ", error.message);
      toast.error(error.message);
    }
    setSearch("");
    setBookmarked(false);
  };

  const showBookmarkedMovies = async (userID: string) => {
    let bookmarkedMoviesIds = [];
    try {
      const { data, error } = await supabase
        .from("bookmarkedMovies")
        .select()
        .eq("userID", userID);

      if (data) {
        bookmarkedMoviesIds = data.map((movie) => movie.movieID);
        console.log(data);
      }
      if (error) {
        console.error(error, "Could not find bookmarked movies");
      }

      const { data: movies, error: moviesError } = await supabase
        .from("moviesData")
        .select("*")
        .in("imdbid", bookmarkedMoviesIds);

      setActiveMovies(movies);
      setBookmarked(true);

      if (moviesError) {
        console.error(moviesError, "Could not load bookmarked movies");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <section className="!mb-10">
        <ToastContainer position="top-center" />
        <div>
          <h1 className="text-left text-[#e8f0fe] w-[70%] !mx-auto mobile:text-2xl max-mobile:text-xl font-medium !my-5">
            Currently trending
          </h1>

          <div className="w-[80%] !mx-auto relative">
            {loading && <div className="loader"></div>}
            <TrendingMovies currentlyTrending={currentlyTrending} />
          </div>
        </div>

        <div className="bg-[#161d2f] w-[80%] !mx-auto rounded-xl !py-3 !px-5 !my-10 flex justify-between items-center">
          <div className="bg-[#bfbfbf] w-[fit-content] flex items-center justify-between !py-1 rounded-lg cursor-pointer active:shadow-[0_0_0_5px_rgb(252,71,71)] ">
            <form onSubmit={handleSumbit}>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="!pl-2 focus:outline-none focus:ring-0 mobile:w-50 smallmobile:w-25 max-smallmobile:w-20"
                type="text"
                placeholder="search"
              />
              <button type="submit" className="hidden"></button>
            </form>
            <button className="bg-[#bfbfbf] text-center !mx-2">
              <i className="bxr  bx-search"></i>
            </button>
          </div>

          <div className="flex justify-between items-center gap-3">
            <select
              onChange={(e) => setActiveGenre(e.target.value)}
              className="bg-[#bfbfbf] rounded"
            >
              <option value="all">All</option>
              {genres &&
                genres.map((genre, index) => (
                  <option key={index} value={genre.genre}>
                    {" "}
                    {genre.genre}{" "}
                  </option>
                ))}
            </select>
            <i
              className={`bxr bxs-bookmark text-[24px]`}
              style={{ color: `${bookmarked ? "#fc4747" : "#bfbfbf"}` }}
              onClick={() => showBookmarkedMovies(userId ? userId : "")}
            ></i>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={`${bookmarked ? "#bfbfbf" : "#fc4747"}`}
              width="28"
              height="28"
              onClick={() =>
                selectActiveSlideMovies(
                  (activeSlide - 1) * 12,
                  activeSlide * 12 - 1,
                )
              }
            >
              <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z"></path>
              <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z"></path>
            </svg>
          </div>
        </div>
        <div className="flex w-[80%] !mx-auto !my-5 relative justify-between items-center">
          <h1 className="text-left text-[#e8f0fe]  text-2xl font-medium !mb-5">
            Top 100
          </h1>
        </div>

        <div className="w-[80%] !mx-auto !my-5 relative">
          {loading && <div className="loader"></div>}
          <Movies activeMovies={activeMovies} />
        </div>
        <div className="flex !mx-auto w-[fit-content] gap-4 !my-10">
          <Button
            variation="arr-button"
            handleClick={() =>
              setActiveSlide((prev) => {
                if (prev !== 1) {
                  return prev - 1;
                } else return 1;
              })
            }
          >
            <i className="bxrds  bx-arrow-left text-xl"></i>
          </Button>
          <div className="flex gap-1">
            {slidesAmount &&
              slidesAmount.map((_, index) => (
                <SliderButton
                  index={index}
                  activeSlide={activeSlide}
                  handleClick={() => setActiveSlide(index + 1)}
                />
              ))}
          </div>
          <Button
            variation="arr-button"
            handleClick={() =>
              setActiveSlide((prev) => {
                if (prev !== MAX_SLIDES) {
                  return prev + 1;
                } else {
                  return MAX_SLIDES;
                }
              })
            }
          >
            <i className="bxrds  bx-arrow-right text-xl"></i>
          </Button>
        </div>
      </section>
    </>
  );
}

export default Home;
