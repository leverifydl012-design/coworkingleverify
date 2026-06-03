import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const LEGACY_CACHE_KEY = "leverify-image-overrides-cache";
import {
  fetchImageOverridesMap,
  type ImageOverrideMap,
} from "@/lib/image-overrides";

type ImageOverridesContextValue = {
  overrides: ImageOverrideMap;
  setOverride: (imageId: string, url: string | null) => void;
  refreshFromDatabase: () => Promise<void>;
};

const ImageOverridesContext = createContext<ImageOverridesContextValue | null>(
  null,
);

export function ImageOverridesProvider({
  initial,
  children,
}: {
  initial: ImageOverrideMap;
  children: ReactNode;
}) {
  const [overrides, setOverrides] = useState<ImageOverrideMap>(initial);

  useEffect(() => {
    try {
      localStorage.removeItem(LEGACY_CACHE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const setOverride = useCallback((imageId: string, url: string | null) => {
    setOverrides((prev) => {
      const next = { ...prev };
      if (url) next[imageId] = url;
      else delete next[imageId];
      return next;
    });
  }, []);

  const refreshFromDatabase = useCallback(async () => {
    const map = await fetchImageOverridesMap();
    setOverrides(map);
  }, []);

  const value = useMemo(
    () => ({ overrides, setOverride, refreshFromDatabase }),
    [overrides, setOverride, refreshFromDatabase],
  );

  return (
    <ImageOverridesContext.Provider value={value}>
      {children}
    </ImageOverridesContext.Provider>
  );
}

export function useImageOverrides() {
  return useContext(ImageOverridesContext);
}
