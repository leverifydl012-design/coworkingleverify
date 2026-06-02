import { useEffect, useRef, useState } from "react";
import { ImagePlus, RotateCcw } from "lucide-react";

const STORAGE_KEY = "leverify-image-overrides";
const AUTH_KEY = "leverify-circle-admin-auth";

function loadOverrides(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
}

function saveOverride(id: string, value: string | null) {
  const all = loadOverrides();
  if (value === null) delete all[id]; else all[id] = value;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  window.dispatchEvent(new Event("leverify-image-overrides"));
}

export function useIsAdmin() {
  const [admin, setAdmin] = useState(false);
  useEffect(() => {
    const check = () => setAdmin(typeof window !== "undefined" && sessionStorage.getItem(AUTH_KEY) === "ok");
    check();
    window.addEventListener("storage", check);
    window.addEventListener("focus", check);
    return () => { window.removeEventListener("storage", check); window.removeEventListener("focus", check); };
  }, []);
  return admin;
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
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const sync = () => setOverride(loadOverrides()[id] ?? null);
    sync();
    window.addEventListener("leverify-image-overrides", sync);
    return () => window.removeEventListener("leverify-image-overrides", sync);
  }, [id]);

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result);
      saveOverride(id, url);
      setOverride(url);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
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
            className="inline-flex items-center gap-1.5 rounded-full bg-foreground/90 text-background text-xs font-semibold px-3 py-1.5 shadow-elegant hover:bg-foreground"
            title="Replace image"
          >
            <ImagePlus className="size-3.5" /> Edit
          </button>
          {override && (
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
