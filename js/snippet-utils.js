export const SNIPPET_CONTEXT = 40;
export const SNIPPET_MAX = 120;
export const SNIPPET_JOINER = " … ";

export function escapeRegExp(str) {
    return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function buildQueryRegex(query) {
    const safe = escapeRegExp(query || "");
    if (!safe) return null;
    return new RegExp(safe, "gi");
}

export function buildContextRegex(query, context = SNIPPET_CONTEXT) {
    const safe = escapeRegExp(query || "");
    if (!safe) return null;
    return new RegExp(`.{0,${context}}${safe}.{0,${context}}`, "gi");
}

export function applyMark(text, queryRegex) {
    if (!text || !queryRegex) return text || "";
    return String(text).replace(queryRegex, "<mark>$&</mark>");
}

export function clampSnippet(text, max = SNIPPET_MAX) {
    if (!text) return "";
    if (text.length <= max) return text;
    return text.slice(0, max).trimEnd() + "…";
}
