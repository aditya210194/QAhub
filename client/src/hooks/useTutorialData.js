import { useState, useEffect, useRef } from 'react';
import { transformApiResponse } from '../utils/tutorialUtils';

// ─── Map the same filenames TutorialPage already uses → chunked directories ───
//
// Key   = what TutorialPage passes in (e.g. 'software-testing.json')
// Value = the folder inside /data/ that contains manifest.json + chunks
//
const CHUNK_DIR_MAP = {
    'software-testing.json':                    'software-testing',
    'automation-testing.json':                  'automation-testing',
    'api-testing.json':                         'api-testing',
    'agile-testing.json':                       'agile-testing',
    'manual-testing.json':                      'manual-testing',
    'automation_tools_and_frameworks_guide.json': 'automation-tools',
};

// ─── Simple in-memory cache so navigating back doesn't re-fetch ──────────────
const _cache = new Map();

async function _fetchJSON(url) {
    if (_cache.has(url)) return _cache.get(url);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    _cache.set(url, data);
    return data;
}

// ─── Load a source: reads manifest then fetches all chunks in parallel ────────
async function loadChunkedSource(dirName) {
    const base = `/data/${dirName}/`;

    // 1. Load manifest (tiny — just the index)
    const manifest = await _fetchJSON(`${base}manifest.json`);

    // 2. Fetch all chunks in parallel
    const chunkPromises = manifest.chunks.map(chunk =>
        _fetchJSON(`${base}${chunk.file}`)
    );
    const chunkDataArray = await Promise.all(chunkPromises);

    // 3. Merge all chunks back into one {categories:[...]} object
    //    — identical shape to the original monolithic JSON
    const allCategories = chunkDataArray.flatMap(chunk => chunk.categories || []);
    return { categories: allCategories };
}

// ─── Fallback: load the original monolithic file (no chunking needed) ─────────
async function loadMonolithicFile(fileName) {
    const filePath = `/data/${fileName}`;
    return _fetchJSON(filePath);
}

// ─── Main fetch function (exported so other code can use it if needed) ────────
export const fetchTutorialContent = async (fileName) => {
    console.log('📥 Loading content for:', fileName);

    const dirName = CHUNK_DIR_MAP[fileName];

    let rawData;
    if (dirName) {
        console.log(`📦 Using chunked source: /data/${dirName}/`);
        try {
            rawData = await loadChunkedSource(dirName);
        } catch (err) {
            // Chunked directory not deployed yet → fall back to monolithic file
            console.warn(`⚠️  Chunked load failed, falling back to monolithic file: ${fileName}`, err);
            rawData = await loadMonolithicFile(fileName);
        }
    } else {
        // No chunk dir registered → load as monolithic
        console.log(`📄 Loading monolithic file: /data/${fileName}`);
        rawData = await loadMonolithicFile(fileName);
    }

    console.log('📄 Raw data keys:', Object.keys(rawData));
    return transformApiResponse(rawData);
};

// ─── Hook — identical return shape to the original ───────────────────────────
//
// TutorialPage.js calls:  useTutorialData(fileName)
// and reads:              { contentData, loading, error }
// Nothing in TutorialPage needs to change.
//
const useTutorialData = (fileName = 'software-testing.json') => {
    const [contentData, setContentData] = useState(null);
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState(null);
    const previousFileName = useRef(fileName);

    useEffect(() => {
        if (previousFileName.current !== fileName) {
            console.log('🔄 fileName changed from', previousFileName.current, 'to', fileName);
            previousFileName.current = fileName;
        }

        let isMounted = true;

        const loadContent = async () => {
            setLoading(true);
            setContentData(null);
            setError(null);

            try {
                const data = await fetchTutorialContent(fileName);
                if (isMounted) {
                    console.log('✅ Setting contentData for:', fileName);
                    setContentData(data);
                }
            } catch (err) {
                console.error('❌ Error for', fileName, ':', err);
                if (isMounted) setError(err.message);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadContent();
        return () => { isMounted = false; };
    }, [fileName]);

    return { contentData, loading, error };
};

export default useTutorialData;