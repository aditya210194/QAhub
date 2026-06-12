module.exports = {
    ci: {
        collect: {
            url: ['http://localhost:3000/'],
            startServerCommand: 'npm start',
            numberOfRuns: 3,
            settings: {
                preset: 'desktop',
                throttling: {
                    rttMs: 40,
                    throughputKbps: 11024,
                    cpuSlowdownMultiplier: 1,
                    requestLatencyMs: 0,
                    downloadThroughputKbps: 0,
                    uploadThroughputKbps: 0,
                },
                onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
            },
        },
        assert: {
            assertions: {
                'categories:performance': ['error', { minScore: 0.8 }],
                'categories:accessibility': ['error', { minScore: 0.9 }],
                'categories:best-practices': ['error', { minScore: 0.9 }],
                'categories:seo': ['error', { minScore: 0.9 }],
                'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
                'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
                'total-blocking-time': ['warn', { maxNumericValue: 300 }],
                'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
                'speed-index': ['warn', { maxNumericValue: 3400 }],
            },
        },
        upload: {
            target: 'temporary-public-storage',
        },
    },
};