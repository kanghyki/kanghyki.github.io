import { normalizeDocId } from './path-utils.js';

export function getDocIdFromPage() {
    const node = document.getElementById('thisName');
    if (!node || !node.value) return '';
    return normalizeDocId(node.value);
}

export async function fetchJson(url) {
    if (!url) return null;
    try {
        const res = await fetch(url);
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        return null;
    }
}

export function setHTML(id, html) {
    const el = document.getElementById(id);
    if (!el) return false;
    el.innerHTML = html;
    return true;
}

export function getDisplayTitle(page) {
    if (!page) return '';
    if (Array.isArray(page.hierarchy) && page.hierarchy.length > 0) {
        return page.hierarchy[page.hierarchy.length - 1];
    }
    if (page.title) {
        return page.title;
    }
    if (page.url) {
        return page.url.split('/').pop();
    }
    return '';
}
