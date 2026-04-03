class MemoryCache {
    constructor() {
        this.cache = new Map();
    }
    set(key, value, ttlSeconds = 60) {
        const expiresAt = Date.now() + (ttlSeconds * 1000);
        this.cache.set(key, { value, expiresAt });
    }
    get(key) {
        const item = this.cache.get(key);
        if(!item) return null;
        if(Date.now() > item.expiresAt){
            this.cache.delete(key);
            return null;
        }
        return item.value;
    }
    refresh(key, ttlSeconds = 60){
        const item = this.cache.get(key);
        if (!item) return null;
        const expiresAt = Date.now() + (ttlSeconds * 1000);
        this.cache.set(key, { item, expiresAt });
    }
    has(key) {
        return this.get(key) !== null;
    }
    clear() {
        this.cache.clear();
    }
}

export const cache = new MemoryCache();