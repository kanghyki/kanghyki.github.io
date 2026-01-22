import {
    normalizeDocId,
    resolveLinkTarget,
    toWikiUrl,
} from "./path-utils.js";

function runCreateLink() {
    const tags = document.querySelectorAll(".post-tag");
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
                .join(" ");
            tags[i].innerHTML = tagList;
        }
    }

    const content = document.querySelector("article.post-content");
    if (!content) {
        return;
    }
    let sourceDocId = "";
    const nameNode = document.getElementById("thisName");
    if (nameNode && nameNode.value) {
        sourceDocId = normalizeDocId(nameNode.value);
    }

    function splitWikiTarget(raw) {
        let parts = raw.split("@@WIKILINK_PIPE@@");
        if (parts.length === 1) {
            parts = raw.split("|");
        }
        const target = (parts[0] || "").trim();
        const label = (parts[1] || target).trim();
        return { target, label };
    }

    function isImageTarget(target) {
        return /\.(png|jpe?g|gif|svg|webp|avif)$/i.test(target);
    }

    function normalizeAssetTarget(target) {
        const cleaned = target.replace(/^\/+/, "");
        if (cleaned.startsWith("assets/")) {
            return encodeURI("/wiki/" + cleaned);
        }
        return encodeURI("/wiki/assets/" + cleaned);
    }

    function buildWikiHref(rawTarget) {
        const trimmed = (rawTarget || "").trim();
        if (!trimmed) {
            return "";
        }
        const resolved = resolveLinkTarget(sourceDocId, trimmed);
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
        (_, raw, label) => `<a href="${buildWikiHref("/" + raw)}">${label}</a>`
    );
    content.innerHTML = content.innerHTML.replace(
        /\[\[(.+?)\]\]\{(.+?)\}/g,
        (_, raw, label) => `<a href="${buildWikiHref(raw)}">${label}</a>`
    );

    content.innerHTML = content.innerHTML.replace(
        /\[\[\/(.+?)\]\]/g,
        (_, raw) => {
            const data = splitWikiTarget(raw);
            return `<a href="${buildWikiHref("/" + data.target)}">${
                data.label
            }</a>`;
        }
    );

    content.innerHTML = content.innerHTML.replace(/\[\[(.+?)\]\]/g, (_, raw) => {
        const data = splitWikiTarget(raw);
        return `<a href="${buildWikiHref(data.target)}">${data.label}</a>`;
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runCreateLink);
} else {
    runCreateLink();
}
