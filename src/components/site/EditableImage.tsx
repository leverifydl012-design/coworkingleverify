import { useEffect, useRef, useState } from "react";
import { ImagePlus, RotateCcw, Loader2 } from "lucide-react";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { AUTH_KEY, PW_KEY } from "@/lib/admin-auth";
import { fetchImageOverridesMap } from "@/lib/image-overrides";
import { saveImageOverrideFn, deleteImageOverrideFn } from "@/lib/image-overrides.functions";
import { useImageOverrides } from "./ImageOverridesProvider";

const MAX_WIDTH = 1200;
const MAX_DATA_URL_LENGTH = 1_500_000;

export function useIsAdmin() {
  const [admin, setAdmin] = useState(false);
  useEffect(() => {
    const check = () =>
      setAdmin(typeof window !== "undefined" && sessionStorage.getItem(AUTH_KEY) === "ok");
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
  const fileDataUrl = await new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = fileDataUrl;
  });
  const scale = Math.min(1, MAX_WIDTH / img.width);
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, w, h);

  let quality = 0.82;
  let dataUrl = canvas.toDataURL("image/jpeg", quality);
  while (dataUrl.length > MAX_DATA_URL_LENGTH && quality > 0.45) {
    quality -= 0.08;
    dataUrl = canvas.toDataURL("image/jpeg", quality);
  }
  if (dataUrl.length > 8_000_000) {
    throw new Error("Image is still too large. Try a smaller photo or crop it first.");
  }
  return dataUrl;
}

function imageSaveErrorMessage(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes("Admin session expired") || msg.includes("Unauthorized")) {
    return "Session expired. Sign out and sign in again at /admin, then retry.";
  }
  if (msg.includes("SUPABASE_SERVICE_ROLE_KEY") || msg.includes("Missing Supabase")) {
    return "Server is missing Supabase keys. Add SUPABASE_SERVICE_ROLE_KEY to your .env file.";
  }
  if (msg.includes("too large")) return msg;
  if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
    return "Could not reach the server. Check your connection and try again.";
  }
  return `Failed to save image: ${msg}`;
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

/**
 * Resolves override URL from SSR context or a one-time DB fetch (no localStorage).
 * `undefined` = still resolving — do not show the default asset yet.
 */
function useResolvedOverrideUrl(imageId: string): string | null | undefined {
  const ctx = useImageOverrides();
  const [fetched, setFetched] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    if (ctx !== null) return;
    let alive = true;
    fetchImageOverridesMap().then((map) => {
      if (alive) setFetched(map[imageId] ?? null);
    });
    return () => {
      alive = false;
    };
  }, [ctx, imageId]);

  if (ctx !== null) {
    return imageId in ctx.overrides ? ctx.overrides[imageId] : null;
  }
  return fetched;
}

export function EditableImage({ id, src, alt, className, width, height, loading }: Props) {
  const isAdmin = useIsAdmin();
  const ctx = useImageOverrides();
  const resolvedOverride = useResolvedOverrideUrl(id);
  const [pendingOverride, setPendingOverride] = useState<string | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const overrideUrl =
    pendingOverride !== undefined ? pendingOverride : resolvedOverride;

  const isResolved = overrideUrl !== undefined;
  const displaySrc = isResolved ? (overrideUrl ?? src) : undefined;

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const channel = supabase
      .channel(`image-overrides-${id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "image_overrides",
          filter: `image_id=eq.${id}`,
        },
        (payload) => {
          if (payload.eventType === "DELETE") {
            setPendingOverride(null);
            ctx?.setOverride(id, null);
          } else {
            const url = (payload.new as { url?: string })?.url ?? null;
            if (url) {
              setPendingOverride(url);
              ctx?.setOverride(id, url);
            }
          }
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, ctx]);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const url = await processImage(file);
      const password = sessionStorage.getItem(PW_KEY) || "";
      if (!password) {
        throw new Error("Admin session expired. Sign out, then sign in again at /admin.");
      }
      await saveImageOverrideFn({ data: { password, imageId: id, url } });
      setPendingOverride(url);
      ctx?.setOverride(id, url);
    } catch (err) {
      console.error(err);
      alert(imageSaveErrorMessage(err));
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  async function onReset() {
    setBusy(true);
    try {
      const password = sessionStorage.getItem(PW_KEY) || "";
      if (!password) {
        throw new Error("Admin session expired. Sign out, then sign in again at /admin.");
      }
      await deleteImageOverrideFn({ data: { password, imageId: id } });
      setPendingOverride(null);
      ctx?.setOverride(id, null);
    } catch (err) {
      console.error(err);
      alert(imageSaveErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  const hasOverride = isResolved && overrideUrl !== null;

  return (
    <>
      {isResolved && displaySrc ? (
        <img
          src={displaySrc}
          alt={alt}
          className={className}
          width={width}
          height={height}
          loading={loading}
        />
      ) : (
        <div
          className={className}
          style={{ width, height }}
          aria-hidden
          role="presentation"
        />
      )}
      {isAdmin && isResolved && (
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
          {hasOverride && !busy && (
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
