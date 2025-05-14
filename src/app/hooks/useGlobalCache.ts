import { useCallback, useRef, useEffect } from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

class GlobalCache {
  private static instance: GlobalCache;
  private cache: Map<string, CacheItem<any>>;
  private readonly DEFAULT_EXPIRATION = 5 * 60 * 1000; // 5 minutos

  private constructor() {
    this.cache = new Map();
  }

  static getInstance(): GlobalCache {
    if (!GlobalCache.instance) {
      GlobalCache.instance = new GlobalCache();
    }
    return GlobalCache.instance;
  }

  set<T>(key: string, data: T, expiresIn: number = this.DEFAULT_EXPIRATION): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const isExpired = Date.now() - item.timestamp > item.expiresIn;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }
}

export function useGlobalCache<T>(key: string, fetchFn: () => Promise<T>, expiresIn?: number) {
  const cache = useRef(GlobalCache.getInstance());
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const getData = useCallback(async (forceRefresh = false): Promise<T | null> => {
    if (!forceRefresh) {
      const cachedData = cache.current.get<T>(key);
      if (cachedData) return cachedData;
    }

    try {
      const data = await fetchFn();
      if (isMounted.current) {
        cache.current.set(key, data, expiresIn);
      }
      return data;
    } catch (error) {
      console.error(`Error fetching data for key ${key}:`, error);
      return null;
    }
  }, [key, fetchFn, expiresIn]);

  const invalidate = useCallback(() => {
    cache.current.delete(key);
  }, [key]);

  return {
    getData,
    invalidate,
    hasData: () => cache.current.has(key)
  };
}

// Función de utilidad para generar claves de caché
export const generateCacheKey = (...parts: (string | number)[]): string => {
  return parts.join(':');
}; 