// server/middleware/cache.js
const NodeCache = require('node-cache');

// Initialize cache with 5 minutes default TTL
const cache = new NodeCache({
    stdTTL: 300,        // 5 minutes default
    checkperiod: 60,    // Check for expired keys every 60 seconds
    useClones: false    // Better performance
});

// Cache middleware for GET requests
const cacheMiddleware = (duration = 300) => {
    return (req, res, next) => {
        // Only cache GET requests
        if (req.method !== 'GET') {
            return next();
        }

        // Skip caching for authenticated/admin routes
        if (req.path.includes('/admin') || req.headers.authorization) {
            return next();
        }

        // Create cache key from URL + query params
        const key = req.originalUrl || req.url;

        // Check if cached data exists
        const cachedData = cache.get(key);

        if (cachedData) {
            console.log(`✅ Cache HIT: ${key}`);
            return res.json(cachedData);
        }

        console.log(`❌ Cache MISS: ${key}`);

        // Store original send function
        const originalSend = res.json;

        // Override json method to cache response
        res.json = function(data) {
            // Store in cache
            cache.set(key, data, duration);
            // Send response
            originalSend.call(this, data);
        };

        next();
    };
};

// Invalidate cache for specific key pattern
const invalidateCache = (pattern) => {
    const keys = cache.keys();
    keys.forEach(key => {
        if (key.includes(pattern)) {
            cache.del(key);
            console.log(`🗑️ Cache invalidated: ${key}`);
        }
    });
};

// Clear entire cache
const clearCache = () => {
    cache.flushAll();
    console.log('🗑️ Entire cache cleared');
};

module.exports = { cacheMiddleware, invalidateCache, clearCache };