// SERVER component (no 'use client'). Reads the manifest/chunks at build time so the
// category + lesson list is present in the raw HTML that crawlers receive.
import fs from 'fs';
import path from 'path';
import { TUTORIAL_SEO } from '../../lib/tutorialSeo';

function loadCategories(dir) {
    const base = path.join(process.cwd(), 'public', 'data', dir);
    const manifest = JSON.parse(fs.readFileSync(path.join(base, 'manifest.json'), 'utf8'));
    const seen = new Set(); // skip lessons repeated within or across categories
    return manifest.chunks.flatMap((c) => {
        const chunk = JSON.parse(fs.readFileSync(path.join(base, c.file), 'utf8'));
        return (chunk.categories || []).map((cat) => ({
            name: cat.name,
            tutorials: (cat.tutorials || []).filter((t) => {
                const key = String(t.title || t.id).trim().toLowerCase();
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            }).map((t) => ({
                id: t.id,
                title: t.title,
                description: t.description,
                difficulty: t.difficulty,
                durationMinutes: t.durationMinutes,
            })),
        }));
    });
}

function excerpt(text, max = 200) {
    const str = String(text || '').replace(/\s+/g, ' ').trim();
    if (str.length <= max) return str;
    const cut = str.slice(0, max);
    return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:\-–\s]+$/, '') + '…';
}

export default function TutorialOutline({ slug }) {
    const seo = TUTORIAL_SEO[slug];
    let categories = [];
    try { categories = loadCategories(seo.dir); } catch (e) { return null; }

    return (
        <section className="container my-5" aria-labelledby="course-outline">
            <h2 id="course-outline" className="h3">{seo.h1}: all lessons</h2>
            <p>{seo.description}</p>
            {categories.map((cat) => (
                <div key={cat.name} className="mb-4">
                    <h3 className="h5">{cat.name}</h3>
                    <ul>
                        {cat.tutorials.map((t) => (
                            <li key={t.id}>
                                <strong>{t.title}</strong>
                                {t.difficulty ? ` (${t.difficulty}` + (t.durationMinutes ? `, ~${t.durationMinutes} min)` : ')') : ''}
                                {t.description ? ` – ${excerpt(t.description)}` : ''}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </section>
    );
}
