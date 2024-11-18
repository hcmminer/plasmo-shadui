import { create } from "zustand";

type CacheItem = {
  translation: string;
  timestamp: number; // Thời gian lưu kết quả
};

type TranslationStore = {
  cache: Record<string, CacheItem>;
  addTranslation: (word: string, translation: string) => void;
  getTranslation: (word: string) => string | null;
  clearExpiredCache: () => void;
};

const CACHE_EXPIRATION_TIME = 5 * 60 * 1000; // 5 phút
const MAX_CACHE_SIZE = 100; // Tối đa 100 mục trong cache

export const useTranslationStore = create<TranslationStore>((set, get) => ({
  cache: {},

  addTranslation: (word, translation) => {
    set((state) => {
      const now = Date.now();
      const newCache = { ...state.cache, [word]: { translation, timestamp: now } };

      // Xóa các mục cũ nếu vượt quá giới hạn
      const keys = Object.keys(newCache);
      if (keys.length > MAX_CACHE_SIZE) {
        const oldestKey = keys.reduce((oldest, key) =>
          newCache[key].timestamp < newCache[oldest].timestamp ? key : oldest
        );
        delete newCache[oldestKey];
      }

      return { cache: newCache };
    });
  },

  getTranslation: (word) => {
    const item = get().cache[word];
    if (item) {
      // Kiểm tra xem mục đó có hết hạn chưa
      if (Date.now() - item.timestamp < CACHE_EXPIRATION_TIME) {
        return item.translation;
      } else {
        // Xóa mục hết hạn
        set((state) => {
          const newCache = { ...state.cache };
          delete newCache[word];
          return { cache: newCache };
        });
      }
    }
    return null;
  },

  clearExpiredCache: () => {
    set((state) => {
      const now = Date.now();
      const newCache = Object.fromEntries(
        Object.entries(state.cache).filter(
          ([, { timestamp }]) => now - timestamp < CACHE_EXPIRATION_TIME
        )
      );
      return { cache: newCache };
    });
  },
}));
