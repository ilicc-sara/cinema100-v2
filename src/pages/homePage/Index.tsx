import { useEffect, useState } from "react";
import { supabase } from "../../supabase-client";
import TrendingMovies from "./components/TrendingMovies";
import Movies from "./components/Movies";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import SliderButton from "../../UI/SliderButton";
import Button from "../../UI/Button";
import { useNavigate } from "react-router";
import { UserAuth } from "../../context/AuthContext";
import type { singleMovie } from "../../types";
import type { Genres } from "../../types";

function Home() {
  const [activeMovies, setActiveMovies] = useState<singleMovie[] | null>(null);
  const [bookmarked, setBookmarked] = useState<boolean>(false);

  const [slidesAmount, setSlidesAmount] = useState<string[] | null>(null);

  // prettier-ignore
  const [currentlyTrending, setCurrentlyTrending] = useState<singleMovie[] | null>(null);

  const [genres, setGenres] = useState<Genres[] | null>(null);

  const [activeSlide, setActiveSlide] = useState<number>(1);
  const [activeGenre, setActiveGenre] = useState<string>("all");

  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const MAX_SLIDES = slidesAmount?.length;

  const { setSession, setUserId } = UserAuth();

  const navigate = useNavigate();

  const selectActiveSlideMovies = async (
    rangeIndex1: number,
    rangeIndex2: number,
  ) => {
    try {
      const { data, error } = await supabase
        .from("moviesData")
        .select()
        .range(rangeIndex1, rangeIndex2);

      if (error) throw error;

      setActiveMovies(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCountData = async () => {
    try {
      const { count, error } = await supabase
        .from("moviesData")
        .select("*", { count: "exact", head: true });

      if (error) {
        throw error;
      }

      if (count !== null) {
        const slidesArray = Array(Math.ceil(count / 12)).fill("");
        setSlidesAmount(slidesArray);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTrendingData = async () => {
    try {
      const { data, error } = await supabase.from("trendingMovies").select();

      if (error) throw error;

      setCurrentlyTrending(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchGenres = async () => {
    try {
      const { data, error } = await supabase.from("genres").select();
      if (error) throw error;
      setGenres(data);
    } catch (err) {
      console.error(err);
    }
  };

  const findGenreMovies = async (genre: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("moviesData")
        .select()
        .ilike("genre", `%${genre}%`)
        .limit(12);

      if (error) throw error;

      setActiveMovies(data);
      setActiveSlide(1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (selectActiveSlideMovies(0, 11),
      fetchCountData(),
      fetchTrendingData(),
      fetchGenres());
  }, []);

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

  useEffect(() => {
    if (activeGenre === "all") {
      selectActiveSlideMovies(0, 11);
      setActiveSlide(1);
      return;
    }

    findGenreMovies(activeGenre);
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

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Controling slide index and movies range accordingly  ⬇️
  const setActiveSlideAndMovies = (index: number) => {
    setActiveSlide(index + 1);
    selectActiveSlideMovies(index * 12, (index + 1) * 12 - 1);
  };

  const increaseActiveSlide = () => {
    setActiveSlide((prev) => {
      if (prev !== MAX_SLIDES) {
        const next = prev + 1;
        selectActiveSlideMovies((next - 1) * 12, next * 12 - 1);
        return prev + 1;
      } else {
        return MAX_SLIDES;
      }
    });
  };

  const decreaseActiveSlide = () => {
    setActiveSlide((prev) => {
      if (prev !== 1) {
        const next = prev - 1;
        selectActiveSlideMovies((next - 1) * 12, next * 12 - 1);
        return prev - 1;
      } else return 1;
    });
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////

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
            ></i>
            <i
              className={`bxr bxs-home text-[24px]`}
              style={{ color: `${bookmarked ? "#bfbfbf" : "#fc4747"}` }}
              onClick={() =>
                selectActiveSlideMovies(
                  (activeSlide - 1) * 12,
                  activeSlide * 12 - 1,
                )
              }
            ></i>
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
            handleClick={() => decreaseActiveSlide()}
          >
            <i className="bxrds  bx-arrow-left text-xl"></i>
          </Button>
          <div className="flex gap-1">
            {slidesAmount &&
              slidesAmount.map((_, index) => (
                <SliderButton
                  index={index}
                  activeSlide={activeSlide}
                  handleClick={() => setActiveSlideAndMovies(index)}
                />
              ))}
          </div>
          <Button
            variation="arr-button"
            handleClick={() => increaseActiveSlide()}
          >
            <i className="bxrds  bx-arrow-right text-xl"></i>
          </Button>
        </div>
      </section>
    </>
  );
}

export default Home;
