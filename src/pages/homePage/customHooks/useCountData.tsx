import { useState, useCallback } from "react";
import { supabase } from "../../../supabase-client";

function useCountData() {
  const [slidesAmount, setSlidesAmount] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCountData = useCallback(async () => {
    setError(null);

    try {
      const { count, error } = await supabase
        .from("moviesData")
        .select("*", { count: "exact", head: true });

      if (error) {
        throw error;
      }

      if (count !== null) {
        const slidesCount = Array(Math.ceil(count / 12)).fill("");
        setSlidesAmount(slidesCount);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load count data");
    } finally {
    }
  }, []);

  return {
    slidesAmount,
    error,
    fetchCountData,
  };
}

export default useCountData;
