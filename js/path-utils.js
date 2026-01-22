(() => {
    const DATA_PREFIX = "/data";
    const WIKI_PREFIX = "/wiki";

    function normalizeDocId(raw) {
        if (!raw) return "";
        let id = String(raw).trim();
        id = id.replace(/^\/+/, "");
        id = id.replace(/^wiki\//, "");
        id = id.replace(/\\/g, "/");
        id = id.replace(/\/{2,}/g, "/");
        return id;
    }

    function normalizeTagName(raw) {
        if (!raw) return "";
        return String(raw).trim();
    }

    function resolveLinkTarget(sourceDocId, linkTarget) {
        if (!linkTarget) return "";
        const trimmed = String(linkTarget).trim();
        if (trimmed.startsWith("/")) {
            return normalizeDocId(trimmed);
        }
        const looksAbsolute = trimmed.includes("/");
        if (looksAbsolute) {
            return normalizeDocId(trimmed);
        }
        const source = normalizeDocId(sourceDocId);
        if (!source || !source.includes("/")) {
            return normalizeDocId(trimmed);
        }
        const prefix = source.replace(/\/[^/]+$/, "");
        return normalizeDocId(`${prefix}/${trimmed}`);
    }

    function toDataUrl(type, docId) {
        const safeType = String(type || "").trim();
        const safeDocId = normalizeDocId(docId);
        if (!safeType || !safeDocId) return "";
        return `${DATA_PREFIX}/${safeType}/${encodeURI(safeDocId)}.json`;
    }

    function toTagUrl(tagName) {
        const safe = normalizeTagName(tagName);
        if (!safe) return "";
        return `${DATA_PREFIX}/tag/${encodeURIComponent(safe)}.json`;
    }

    function toWikiUrl(docId) {
        const safeDocId = normalizeDocId(docId);
        if (!safeDocId) return "";
        return `${WIKI_PREFIX}/${encodeURI(safeDocId)}`;
    }

    window.PathUtils = {
        normalizeDocId,
        normalizeTagName,
        resolveLinkTarget,
        toDataUrl,
        toTagUrl,
        toWikiUrl,
    };
})();
