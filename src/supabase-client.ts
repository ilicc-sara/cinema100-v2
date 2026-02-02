import { createClient } from "@supabase/supabase-js";
import.meta.env.VITE_RAPID_API_KEY;

export const supabase = createClient(
  "https://yyocycmzxqjdvkwqlpzd.supabase.co",
  import.meta.env.VITE_RAPID_API_KEY
);
