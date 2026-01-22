(async () => {
    function getTarget() {
        var thisName = document.getElementById("thisName").value;
        return encodeURI(thisName);
    }
    const target = getTarget();

    function makeHTML(mention_map, targetKey) {
        let ret = '<h2>이 문서를 참조한 문서</h2><ul class="mention-ul">';
        for (const key of mention_map.keys()) {
            const value = mention_map.get(key);
            ret += `<li>
                <a class="mention-link" href="${value.metadata.url}">
                    <span>${value.metadata.title}</span>`;
            for (const paragraph of value.paragraphs) {
                const snippet = extractSnippet(
                    paragraph,
                    value.metadata.resource,
                    targetKey
                );
                ret += `<div> - ${snippet}</div>`;
            }
            ret += `</a></li>`;
        }
        ret += "</ul>";

        return ret;
    }

    let target_data = null;
    try {
        let target_res = await fetch(`/data/mention/${target}.json`);
        if (!target_res.ok) return;
        target_data = await target_res.json();
    } catch (e) {
        console.log(e);
        return;
    }

    // mention_map의 value는 다음과 같이 저장된다.
    // {
    //     "paragraphs": [
    //           "...",
    //           "..."
    //     ],
    //     "metadata": {
    //         "type": "...",
    //         "title": "...",
    //         "summary": "...",
    //         "parent": "...",
    //         "url": "...",
    //         "updated": "...",
    //         "resource": "...",
    //         "children": [],
    //         "body": "..."
    //     }
    // }
    const mention_map = new Map();
    for (const obj of target_data) {
        const val = mention_map.get(obj.from);
        val
            ? val.paragraphs.push(obj.paragraph)
            : mention_map.set(obj.from, { paragraphs: [obj.paragraph] });
    }

    for (const file_path of mention_map.keys()) {
        try {
            const res = await fetch(`/data/metadata/${encodeURI(file_path)}.json`);
            if (!res.ok) continue;
            const data = await res.json();
            mention_map.get(file_path).metadata = data;
        } catch (e) {
            console.log(e);
            continue;
        }
    }

    document.getElementById("mention-list").innerHTML = makeHTML(
        mention_map,
        target
    );
})();

function extractSnippet(paragraph, sourceFile, targetKey) {
    if (!paragraph) return "";
    const text = paragraph.toString();
    const regex = /\[\[([^\]]+?)\]\](\{([^}]+)\})?/g;
    let output = "";
    let lastIndex = 0;
    let targetStart = -1;
    let targetEnd = -1;
    let match;

    while ((match = regex.exec(text)) !== null) {
        output += text.slice(lastIndex, match.index);

        const raw = match[1] || "";
        const rawLabel = match[3];
        const parts = raw.split("|");
        const target = (parts[0] || "").trim();
        const label = (rawLabel || parts[1] || target).trim();

        if (isTargetMatch(target, sourceFile, targetKey)) {
            targetStart = output.length;
            targetEnd = output.length + label.length;
        }

        output += label;
        lastIndex = match.index + match[0].length;
    }
    output += text.slice(lastIndex);

    if (targetStart === -1) {
        return output.trim();
    }

    const context = 40;
    const start = Math.max(0, targetStart - context);
    const end = Math.min(output.length, targetEnd + context);
    let snippet = output.slice(start, end).trim();
    if (start > 0) snippet = "…" + snippet;
    if (end < output.length) snippet = snippet + "…";
    return snippet;
}

function isTargetMatch(linkTarget, sourceFile, targetKey) {
    if (!linkTarget) return false;

    let resolved = linkTarget;
    if (!resolved.startsWith("/")) {
        const prefix = getSourcePrefix(sourceFile);
        resolved = prefix + resolved;
    }

    resolved = resolved.replace(/^\/+/, "").replace(/^wiki\//, "");
    if (resolved === targetKey) return true;
    if (`${resolved}/index` === targetKey) return true;
    return false;
}

function getSourcePrefix(sourceFile) {
    if (!sourceFile) return "/";
    const normalized = sourceFile.replace(/^\/+/, "");
    if (!normalized.includes("/")) return "/";
    return `/${normalized.replace(/\/[^/]+$/, "")}/`;
}
