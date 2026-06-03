import { useEffect, useRef, useState } from "react";
import { ImagePlus, RotateCcw, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { saveImageOverrideFn, deleteImageOverrideFn } from "@/lib/image-overrides.functions";

const AUTH_KEY = "leverify-circle-admin-auth";
const PW_KEY = "leverify-circle-admin-pw";
const CACHE_KEY = "leverify-image-overrides-cache";
const MAX_WIDTH = 1600;
const QUALITY = 0.8;


type OverrideMap = Record<string, string>;

let cache: OverrideMap | null = null;
let pending: Promise<OverrideMap> | null = null;

function readCache(): OverrideMap {
  if (cache) return cache;
  if (typeof window === "undefined") return {};
  try { cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}"); } catch { cache = {}; }
  return cache!;
}

function writeCache(map: OverrideMap) {
  cache = map;
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(map)); } catch {}
  if (typeof window !== "undefined") window.dispatchEvent(new Event("leverify-image-overrides"));
}

async function fetchAllOverrides(): Promise<OverrideMap> {
  if (pending) return pending;
  pending = (async () => {
    const { data, error } = await supabase.from("image_overrides").select("image_id,url");
    if (error) { console.error("Load overrides failed:", error); return readCache(); }
    const map: OverrideMap = {};
    for (const row of data ?? []) map[row.image_id] = row.url;
    writeCache(map);
    return map;
  })();
  try { return await pending; } finally { pending = null; }
}

async function saveOverride(id: string, url: string | null) {
  const password = typeof window !== "undefined" ? sessionStorage.getItem(PW_KEY) || "" : "";
  if (!password) throw new Error("Admin session expired. Sign in again.");
  const map = { ...readCache() };
  if (url === null) {
    delete map[id];
    writeCache(map);
    await deleteImageOverrideFn({ data: { password, imageId: id } });
  } else {
    map[id] = url;
    writeCache(map);
    await saveImageOverrideFn({ data: { password, imageId: id, url } });
  }
}


export function useIsAdmin() {
  const [admin, setAdmin] = useState(false);
  useEffect(() => {
    const check = () => setAdmin(typeof window !== "undefined" && sessionStorage.getItem(AUTH_KEY) === "ok");
    check();
    window.addEventListener("storage", check);
    window.addEventListener("focus", check);
    window.addEventListener("leverify-admin-auth", check);
    return () => {
      window.removeEventListener("storage", check);
      window.removeEventListener("focus", check);
      window.removeEventListener("leverify-admin-auth", check);
    };
  }, []);
  return admin;
}

async function processImage(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = dataUrl;
  });
  const scale = Math.min(1, MAX_WIDTH / img.width);
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", QUALITY);
}

type Props = {
  id: string;
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
};

export function EditableImage({ id, src, alt, className, width, height, loading }: Props) {
  const isAdmin = useIsAdmin();
  const [override, setOverride] = useState<string | null>(() => readCache()[id] ?? null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let alive = true;
    fetchAllOverrides().then((map) => { if (alive) setOverride(map[id] ?? null); });
    const sync = () => setOverride(readCache()[id] ?? null);
    window.addEventListener("leverify-image-overrides", sync);
    return () => { alive = false; window.removeEventListener("leverify-image-overrides", sync); };
  }, [id]);

  // Realtime sync across browsers/devices
  useEffect(() => {
    const channel = supabase
      .channel(`image-overrides-${id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "image_overrides", filter: `image_id=eq.${id}` },
        (payload) => {
          if (payload.eventType === "DELETE") {
            const map = { ...readCache() }; delete map[id]; writeCache(map);
            setOverride(null);
          } else {
            const url = (payload.new as { url?: string })?.url ?? null;
            if (url) { const map = { ...readCache(), [id]: url }; writeCache(map); setOverride(url); }
          }
        })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [id]);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const url = await processImage(file);
      await saveOverride(id, url);
      setOverride(url);
    } catch (err) {
      console.error(err);
      alert("Failed to save image. Try a smaller file.");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  async function onReset() {
    setBusy(true);
    try {
      await saveOverride(id, null);
      setOverride(null);
    } catch (err) {
      console.error(err);
      alert("Failed to reset image.");
    } finally { setBusy(false); }
  }

  const finalSrc = override ?? src;

  return (
    <>
      <img src={finalSrc} alt={alt} className={className} width={width} height={height} loading={loading} />
      {isAdmin && (
        <div className="absolute top-3 right-3 z-20 flex gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-full bg-foreground/90 text-background text-xs font-semibold px-3 py-1.5 shadow-elegant hover:bg-foreground disabled:opacity-60"
            title="Replace image — saved to cloud"
          >
            {busy ? <Loader2 className="size-3.5 animate-spin" /> : <ImagePlus className="size-3.5" />}
            {busy ? "Saving…" : "Edit"}
          </button>
          {override && !busy && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center justify-center size-7 rounded-full bg-background/90 text-foreground shadow-elegant hover:bg-background"
              title="Reset to original"
            >
              <RotateCcw className="size-3.5" />
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPick} />
        </div>
      )}
    </>
  );
}
