import React from "react";
import { supabase } from "../../../supabase-client";
import type { singleMovie } from "../../../types";

function useSingleMovie(
  setMovie: React.Dispatch<React.SetStateAction<singleMovie | null>>,
  id: string | undefined
) {
  const getMovie = async () => {
    try {
      const { error, data } = await supabase
        .from("moviesData")
        .select()
        .eq("imdbid", id)
        .single();

      setMovie(data);

      if (error) {
        console.error("Error finding single movie: ", error.message);
      }
    } catch (error: any) {
      console.error("Error finding single movie: ", error.message);
    }
  };

  return getMovie();
}

export default useSingleMovie;
