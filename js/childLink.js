import { toDataUrl } from "./path-utils.js";
import {
    fetchJson,
    getDocIdFromPage,
    getDisplayTitle,
    setHTML,
} from "./client-utils.js";

(async () => {
    function makeHTML(sections) {
        if (!sections || sections.length < 1) return "";

        let ret = '<h2>하위 문서</h2>';
        sections.forEach((section) => {
            if (section.heading) {
                ret += `<h3 class="child-index-title">${section.heading}</h3>`;
            }
            if (section.items && section.items.length > 0) {
                ret += '<ul class="child-index-list">';
                section.items.forEach((item) => {
                    ret += `<li><a href="${item.url}">${item.title}</a></li>`;
                });
                ret += "</ul>";
            }
        });
        return ret;
    }

    const target = getDocIdFromPage();
    if (!target) return;
    const sections = [];
    const target_data = await fetchJson(toDataUrl("metadata", target));
    if (!target_data) return;

    const children = target_data.children || [];
    const indexChildren = children.filter((id) => id.endsWith("/index"));
    const leafChildren = children.filter((id) => !id.endsWith("/index"));

    // Show direct documents under current index
    if (leafChildren.length > 0) {
        const items = [];
        for (const id of leafChildren) {
            const data = await fetchJson(toDataUrl("metadata", id));
            if (!data || !data.url) continue;
            items.push({ url: data.url, title: getDisplayTitle(data) });
        }
        items.sort((a, b) => a.title.localeCompare(b.title));
        sections.push({ heading: "문서 목록", items });
    }

    // Show child index pages, and list their documents
    for (const indexId of indexChildren) {
        const indexData = await fetchJson(toDataUrl("metadata", indexId));
        if (!indexData) continue;

        const indexTitle = getDisplayTitle(indexData);
        const indexItems = [];
        const indexKids = indexData.children || [];
        for (const kid of indexKids) {
            if (kid.endsWith("/index")) continue;
            const doc = await fetchJson(toDataUrl("metadata", kid));
            if (!doc || !doc.url) continue;
            indexItems.push({ url: doc.url, title: getDisplayTitle(doc) });
        }
        indexItems.sort((a, b) => a.title.localeCompare(b.title));

        const heading = indexData.url
            ? `<a href="${indexData.url}">${indexTitle}</a>`
            : indexTitle;
        sections.push({ heading, items: indexItems });
    }

    setHTML("child-list", makeHTML(sections));
})()
