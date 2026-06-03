import { createClient } from "@supabase/supabase-js";

export type ImageOverrideMap = Record<string, string>;

function getSupabaseReadConfig() {
  const url =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL) ||
    process.env.SUPABASE_URL;
  const key =
    (typeof import.meta !== "undefined" &&
      (import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY ||
        import.meta.env?.VITE_SUPABASE_ANON_KEY)) ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY;
  return { url, key };
}

/** Load all image overrides from Supabase (SSR + client). */
export async function fetchImageOverridesMap(): Promise<ImageOverrideMap> {
  const { url, key } = getSupabaseReadConfig();
  if (!url || !key) return {};

  const supabase = createClient(url, key);
  const { data, error } = await supabase
    .from("image_overrides")
    .select("image_id, url")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("[image-overrides] fetch failed:", error.message);
    return {};
  }

  const map: ImageOverrideMap = {};
  for (const row of data ?? []) {
    if (row.image_id && row.url && !(row.image_id in map)) {
      map[row.image_id] = row.url;
    }
  }
  return map;
}
