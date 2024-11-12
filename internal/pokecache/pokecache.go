package pokecache

import "time"

type Cache struct {
	cache map[string]cacheEntry
}

type cacheEntry struct {
	val         []byte
	timeCreated time.Time
}

func NewCache(interval time.Duration) Cache {
	c := Cache{
		cache: make(map[string]cacheEntry),
	}
	go c.reapLoop(interval)
	// return Cache{
	// 	cache: make(map[string]cacheEntry),
	// }
	return c
}

func (c *Cache) Add(key string, val []byte) {
	c.cache[key] = cacheEntry{
		val:         val,
		timeCreated: time.Now().UTC(),
	}
}

func (c *Cache) Get(key string) ([]byte, bool) {
	cEntry, ok := c.cache[key]
	return cEntry.val, ok
}

func (c *Cache) reapLoop(interval time.Duration) {
	ticker := time.NewTicker(interval)
	for range ticker.C {
		c.reap(interval)
	}
}

func (c *Cache) reap(interval time.Duration) {
	timeCutoff := time.Now().UTC().Add(-interval)
	for k, v := range c.cache {
		if v.timeCreated.Before(timeCutoff) {
			delete(c.cache, k)
		}
	}
}
