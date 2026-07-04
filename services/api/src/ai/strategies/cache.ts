import { createHash } from 'crypto';

const CACHE_TTL = parseInt(process.env.AI_CACHE_TTL || '86400', 10); // 24 hours default

interface CacheEntry {
  response: string;
  timestamp: number;
  model: string;
}

export class AICache {
  private store = new Map<string, CacheEntry>();

  getKey(message: string, systemPrompt: string): string {
    return createHash('md5').update(message + systemPrompt).digest('hex');
  }

  get(key: string): CacheEntry | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > CACHE_TTL * 1000) {
      this.store.delete(key);
      return null;
    }
    return entry;
  }

  set(key: string, response: string, model: string): void {
    this.store.set(key, { response, timestamp: Date.now(), model });
  }

  clear(): void {
    this.store.clear();
  }
}
