class Cache<T> {
    private store = new Map<string, { data: T; expiry: number }>();

    get(key: string): T | undefined {
        const entry = this.store.get(key);
        if (!entry) return undefined;
        if (Date.now() > entry.expiry) {
            this.store.delete(key);
            return undefined;
        }
        console.log("get from cache with key : " + key);
        return entry.data;
    }

    set(key: string, data: T, ttlMs: number): void {
        this.store.set(key, {data, expiry: Date.now() + ttlMs});
    }

    delete(key: string): void {
        this.store.delete(key);
    }
}

export const cache = new Cache();
