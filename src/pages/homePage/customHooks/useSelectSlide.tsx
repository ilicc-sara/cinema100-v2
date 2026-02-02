import { useState, useCallback } from "react";
import { supabase } from "../../../supabase-client";
import type { singleMovie } from "../../../types";

function useSelectSlide() {
  const [activeMovies, setActiveMovies] = useState<singleMovie[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState<boolean>(false);

  const selectActiveSlideMovies = useCallback(
    async (rangeIndex1: number, rangeIndex2: number) => {
      setError(null);

      try {
        const { data, error } = await supabase
          .from("moviesData")
          .select()
          .range(rangeIndex1, rangeIndex2);

        if (error) throw error;

        setActiveMovies(data);
        setBookmarked(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load slide movies");
      }
    },
    [],
  );

  return {
    activeMovies,
    setActiveMovies,
    error,
    selectActiveSlideMovies,
    bookmarked,
    setBookmarked,
  };
}

export default useSelectSlide;
