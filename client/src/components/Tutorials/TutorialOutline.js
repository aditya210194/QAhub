// SERVER component (no 'use client'). Reads the manifest/chunks at build time so the
// category + lesson list is present in the raw HTML that crawlers receive.
import fs from 'fs';
import path from 'path';
import { TUTORIAL_SEO } from '../../lib/tutorialSeo';

function loadCategories(dir) {
    const base = path.join(process.cwd(), 'public', 'data', dir);
    const manifest = JSON.parse(fs.readFileSync(path.join(base, 'manifest.json'), 'utf8'));
    return manifest.chunks.flatMap((c) => {
        const chunk = JSON.parse(fs.readFileSync(path.join(base, c.file), 'utf8'));
        return (chunk.categories || []).map((cat) => ({
            name: cat.name,
            tutorials: (cat.tutorials || []).map((t) => ({
                id: t.id,
                title: t.title,
                description: t.description,
                difficulty: t.difficulty,
                durationMinutes: t.durationMinutes,
            })),
        }));
    });
}

export default function TutorialOutline({ slug }) {
    const seo = TUTORIAL_SEO[slug];
    let categories = [];
    try { categories = loadCategories(seo.dir); } catch (e) { return null; }

    return (
        <section className="container my-5" aria-labelledby="course-outline">
            <h1 id="course-outline" className="h3">{seo.h1}</h1>
            <p>{seo.description}</p>
            {categories.map((cat) => (
                <div key={cat.name} className="mb-4">
                    <h2 className="h5">{cat.name}</h2>
                    <ul>
                        {cat.tutorials.map((t) => (
                            <li key={t.id}>
                                <strong>{t.title}</strong>
                                {t.difficulty ? ` (${t.difficulty}` + (t.durationMinutes ? `, ~${t.durationMinutes} min)` : ')') : ''}
                                {t.description ? ` – ${String(t.description).slice(0, 220)}` : ''}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </section>
    );
}
