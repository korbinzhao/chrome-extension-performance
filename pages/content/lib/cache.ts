interface CacheData {
  resources?: PerformanceEntryList;
}

type CacheKey = 'resources';

class Cache {
  constructor() {
    if (Cache.instance) {
      return Cache.instance;
    }
    Cache.instance = this;
  }

  static instance: Cache;

  private data: CacheData = {};

  set(key: CacheKey, value: CacheData[CacheKey]) {
    this.data[key] = value;
  }

  get(key: CacheKey) {
    return this.data[key];
  }
}

const cache = new Cache();

export default cache;
