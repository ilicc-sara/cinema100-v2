import { useState, useCallback } from "react";
import { supabase } from "../../../supabase-client";
import type { singleMovie } from "../../../types";

function useTrendingData() {
  const [currentlyTrending, setCurrentlyTrending] = useState<
    singleMovie[] | null
  >(null);

  const [error, setError] = useState<string | null>(null);

  const fetchTrendingData = useCallback(async () => {
    setError(null);

    try {
      const { data, error } = await supabase.from("trendingMovies").select();

      if (error) {
        throw error;
      }

      setCurrentlyTrending(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load trending movies");
    } finally {
    }
  }, []);

  return {
    currentlyTrending,
    error,
    fetchTrendingData,
  };
}

export default useTrendingData;
