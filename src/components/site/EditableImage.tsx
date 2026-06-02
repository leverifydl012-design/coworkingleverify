import { useEffect, useRef, useState } from "react";
import { ImagePlus, RotateCcw, Loader2 } from "lucide-react";

const STORAGE_KEY = "leverify-image-overrides";
const AUTH_KEY = "leverify-circle-admin-auth";
const MAX_WIDTH = 1920;
const QUALITY = 0.82;

function loadOverrides(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
}

function saveOverride(id: string, value: string | null) {
  const all = loadOverrides();
  if (value === null) delete all[id]; else all[id] = value;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (err) {
    console.error("Image storage full — try a smaller image", err);
    alert("Storage limit reached. Try a smaller image.");
    return;
  }
  window.dispatchEvent(new Event("leverify-image-overrides"));
}

export function useIsAdmin() {
  const [admin, setAdmin] = useState(false);
  useEffect(() => {
    const check = () => setAdmin(typeof window !== "undefined" && sessionStorage.getItem(AUTH_KEY) === "ok");
    check();
    const onStorage = () => check();
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", check);
    window.addEventListener("leverify-admin-auth", check);
    return () => {
      window.removeEventListener("storage", onStorage);
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
  const [override, setOverride] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const sync = () => setOverride(loadOverrides()[id] ?? null);
    sync();
    window.addEventListener("leverify-image-overrides", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("leverify-image-overrides", sync);
      window.removeEventListener("storage", sync);
    };
  }, [id]);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const url = await processImage(file);
      saveOverride(id, url);
      setOverride(url);
    } catch (err) {
      console.error(err);
      alert("Failed to process image.");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
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
            title="Replace image (auto-resized and compressed)"
          >
            {busy ? <Loader2 className="size-3.5 animate-spin" /> : <ImagePlus className="size-3.5" />}
            {busy ? "Optimizing…" : "Edit"}
          </button>
          {override && !busy && (
            <button
              type="button"
              onClick={() => { saveOverride(id, null); setOverride(null); }}
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
