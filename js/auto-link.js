(() => {
    const urlRegex = /\bhttps?:\/\/[^\s<>"']+/g;
    const excludedTags = new Set([
        "A",
        "CODE",
        "PRE",
        "SCRIPT",
        "STYLE",
        "TEXTAREA",
        "KBD",
        "SAMP",
    ]);

    const isExcluded = (node) => {
        let current = node.parentNode;
        while (current && current.nodeType === Node.ELEMENT_NODE) {
            if (excludedTags.has(current.tagName)) return true;
            current = current.parentNode;
        }
        return false;
    };

    const linkifyTextNode = (node) => {
        const text = node.nodeValue;
        const matches = Array.from(text.matchAll(urlRegex));
        if (matches.length === 0) return;

        const frag = document.createDocumentFragment();
        let lastIndex = 0;

        for (const match of matches) {
            const start = match.index;
            let url = match[0];
            let trailing = "";

            while (/[),.;:!?]$/.test(url)) {
                trailing = url.slice(-1) + trailing;
                url = url.slice(0, -1);
            }

            if (start > lastIndex) {
                frag.append(document.createTextNode(text.slice(lastIndex, start)));
            }

            if (url.length > 0) {
                const link = document.createElement("a");
                link.href = url;
                link.textContent = url;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                frag.append(link);
            } else {
                frag.append(document.createTextNode(match[0]));
            }

            if (trailing) frag.append(document.createTextNode(trailing));
            lastIndex = start + match[0].length;
        }

        if (lastIndex < text.length) {
            frag.append(document.createTextNode(text.slice(lastIndex)));
        }

        node.parentNode.replaceChild(frag, node);
    };

    const linkify = (root) => {
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode(node) {
                    if (!node.nodeValue || !urlRegex.test(node.nodeValue)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    if (isExcluded(node)) return NodeFilter.FILTER_REJECT;
                    return NodeFilter.FILTER_ACCEPT;
                },
            }
        );

        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach(linkifyTextNode);
    };

    const run = () => {
        const root = document.querySelector("main.page") || document.body;
        if (root) linkify(root);
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", run);
    } else {
        run();
    }
})();
