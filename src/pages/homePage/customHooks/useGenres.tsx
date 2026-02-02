import { useState, useCallback } from "react";
import { supabase } from "../../../supabase-client";
import type { Genres } from "../../../types";

function useGenres() {
  const [genres, setGenres] = useState<Genres[] | null>(null);

  const [error, setError] = useState<string | null>(null);

  const fetchGenres = useCallback(async () => {
    setError(null);

    try {
      const { data, error } = await supabase.from("genres").select();

      if (error) {
        throw error;
      }

      setGenres(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load genres");
    } finally {
    }
  }, []);

  return {
    genres,
    error,
    fetchGenres,
  };
}

export default useGenres;
