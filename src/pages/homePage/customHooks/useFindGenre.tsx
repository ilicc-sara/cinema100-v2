import { useState } from "react";
import { supabase } from "../../../supabase-client";
import type { singleMovie } from "../../../types";

function useFindGenre(
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  activeGenre: string,
  setActiveMovies: React.Dispatch<React.SetStateAction<singleMovie[] | null>>,
  setActiveSlide: React.Dispatch<React.SetStateAction<number>>
) {
  const findGenreMovies = async () => {
    setLoading(true);
    try {
      const { error, data } = await supabase
        .from("moviesData")
        .select()
        .ilike("genre", `%${activeGenre}%`)
        .limit(12);

      setActiveMovies(data);
      setActiveSlide(1);
      setLoading(false);

      if (error) {
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
    }
  };

  return findGenreMovies();
}

export default useFindGenre;
