import { normalizeDocId, resolveLinkTarget, toWikiUrl } from './path-utils.js';
import { fetchJson } from './client-utils.js';

let cachedIndex = null;

async function loadWikiFileIndex() {
    if (cachedIndex) return cachedIndex;
    const data = await fetchJson('/data/wiki-file-index.json');
    cachedIndex = data || {};
    return cachedIndex;
}

function normalizeLinkName(rawTarget) {
    const trimmed = (rawTarget || '').trim();
    return trimmed.replace(/\.md$/i, '');
}

// Obsidian "Shortest" rules we mirror:
// 1) Links can be written as filename only (path omitted).
// 2) If multiple files share the same name, pick the nearest by folder distance.
// 3) File extension (.md) is optional in the link.
function resolveShortestLink(sourceDocId, rawTarget, indexMap) {
    const normalized = normalizeLinkName(rawTarget);
    if (!normalized) return '';
    if (normalized.includes('/')) {
        return resolveLinkTarget(sourceDocId, normalized);
    }

    const candidates = indexMap[normalized];
    if (!Array.isArray(candidates) || candidates.length === 0) {
        return resolveLinkTarget(sourceDocId, normalized);
    }
    if (candidates.length === 1) {
        return candidates[0];
    }

    const sourceDir = sourceDocId ? sourceDocId.split('/').slice(0, -1) : [];

    let best = candidates[0];
    let bestScore = Infinity;

    candidates.forEach((candidate) => {
        const candDir = candidate.split('/').slice(0, -1);
        let common = 0;
        while (
            common < sourceDir.length &&
            common < candDir.length &&
            sourceDir[common] === candDir[common]
        ) {
            common++;
        }
        const score = sourceDir.length - common + (candDir.length - common);
        if (score < bestScore) {
            bestScore = score;
            best = candidate;
        } else if (score === bestScore && candidate < best) {
            best = candidate;
        }
    });

    return best;
}

async function runCreateLink() {
    const tags = document.querySelectorAll('.post-tag');
    if (tags && tags.length > 0) {
        for (let i = 0; i < tags.length; i++) {
            const item = tags[i];
            let tagList = item.innerHTML.trim();
            if (/^\s*$/.test(tagList)) {
                continue;
            }
            tagList = tagList
                .split(/\s+/)
                .map((tag) => `<a href="/tag/#${tag}">#${tag}</a>`)
                .join(' ');
            tags[i].innerHTML = tagList;
        }
    }

    const content = document.querySelector('article.post-content');
    if (!content) {
        return;
    }
    let sourceDocId = '';
    const nameNode = document.getElementById('thisName');
    if (nameNode && nameNode.value) {
        sourceDocId = normalizeDocId(nameNode.value);
    }

    function splitWikiTarget(raw) {
        let parts = raw.split('@@WIKILINK_PIPE@@');
        if (parts.length === 1) {
            parts = raw.split('|');
        }
        const target = (parts[0] || '').trim();
        const label = (parts[1] || target).trim();
        return { target, label };
    }

    function isImageTarget(target) {
        return /\.(png|jpe?g|gif|svg|webp|avif)$/i.test(target);
    }

    function normalizeAssetTarget(target) {
        const cleaned = target.replace(/^\/+/, '');
        if (cleaned.startsWith('assets/')) {
            return encodeURI('/wiki/' + cleaned);
        }
        return encodeURI('/wiki/assets/' + cleaned);
    }

    function buildWikiHref(rawTarget) {
        const trimmed = (rawTarget || '').trim();
        if (!trimmed) {
            return '';
        }
        const resolved = resolveShortestLink(sourceDocId, trimmed, cachedIndex);
        return toWikiUrl(resolved);
    }

    content.innerHTML = content.innerHTML.replace(/!\[\[(.+?)\]\]/g, (_, raw) => {
        const data = splitWikiTarget(raw);
        if (isImageTarget(data.target)) {
            const src = normalizeAssetTarget(data.target);
            const alt = data.label || data.target;
            return `<img src="${src}" alt="${alt}" loading="lazy">`;
        }
        const embedHref = buildWikiHref(data.target);
        return `<a href="${embedHref}">${data.label}</a>`;
    });

    content.innerHTML = content.innerHTML.replace(
        /\[\[\/(.+?)\]\]\{(.+?)\}/g,
        (_, raw, label) => `<a href="${buildWikiHref('/' + raw)}">${label}</a>`,
    );
    content.innerHTML = content.innerHTML.replace(
        /\[\[(.+?)\]\]\{(.+?)\}/g,
        (_, raw, label) => `<a href="${buildWikiHref(raw)}">${label}</a>`,
    );

    content.innerHTML = content.innerHTML.replace(/\[\[\/(.+?)\]\]/g, (_, raw) => {
        const data = splitWikiTarget(raw);
        return `<a href="${buildWikiHref('/' + data.target)}">${data.label}</a>`;
    });

    content.innerHTML = content.innerHTML.replace(/\[\[(.+?)\]\]/g, (_, raw) => {
        const data = splitWikiTarget(raw);
        return `<a href="${buildWikiHref(data.target)}">${data.label}</a>`;
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        cachedIndex = await loadWikiFileIndex();
        runCreateLink();
    });
} else {
    (async () => {
        cachedIndex = await loadWikiFileIndex();
        runCreateLink();
    })();
}
