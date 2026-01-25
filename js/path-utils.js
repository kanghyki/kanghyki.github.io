const DATA_PREFIX = '/data';
const NOTES_PREFIX = '/notes';

export function normalizeDocId(raw) {
    if (!raw) return '';
    let id = String(raw).trim();
    id = id.replace(/^\/+/, '');
    id = id.replace(/^wiki\//, '');
    id = id.replace(/^notes\//, '');
    id = id.replace(/\\/g, '/');
    id = id.replace(/\/{2,}/g, '/');
    return id;
}

export function normalizeTagName(raw) {
    if (!raw) return '';
    return String(raw).trim();
}

export function resolveLinkTarget(sourceDocId, linkTarget) {
    if (!linkTarget) return '';
    const trimmed = String(linkTarget).trim();
    if (trimmed.startsWith('/')) {
        return normalizeDocId(trimmed);
    }
    const looksAbsolute = trimmed.includes('/');
    if (looksAbsolute) {
        return normalizeDocId(trimmed);
    }
    const source = normalizeDocId(sourceDocId);
    if (!source || !source.includes('/')) {
        return normalizeDocId(trimmed);
    }
    const prefix = source.replace(/\/[^/]+$/, '');
    return normalizeDocId(`${prefix}/${trimmed}`);
}

export function toDataUrl(type, docId) {
    const safeType = String(type || '').trim();
    const safeDocId = normalizeDocId(docId);
    if (!safeType || !safeDocId) return '';
    return `${DATA_PREFIX}/${safeType}/${encodeURI(safeDocId)}.json`;
}

export function toTagUrl(tagName) {
    const safe = normalizeTagName(tagName);
    if (!safe) return '';
    return `${DATA_PREFIX}/tag/${encodeURIComponent(safe)}.json`;
}

export function toWikiUrl(docId) {
    const safeDocId = normalizeDocId(docId);
    if (!safeDocId) return '';
    return `${NOTES_PREFIX}/${encodeURI(safeDocId)}`;
}
