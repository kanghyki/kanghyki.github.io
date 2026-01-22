import { toDataUrl } from "./path-utils.js";
import { fetchJson, getDocIdFromPage, setHTML } from "./client-utils.js";

(async () => {
    function makeHTML(clist) {
        if (clist == null || clist.length < 1) return '';

        clist.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        let ret = '<h2>하위 문서</h2><ul>';
        for (let i = 0; i < clist.length; ++i) {
            ret += `<li><a href="${clist[i].url}">${clist[i].title}</a></li>`;
        }
        ret += '</ul>'
        return ret;
    }

    const target = getDocIdFromPage();
    if (!target) return;
    const clist = [];
    const target_data = await fetchJson(toDataUrl("metadata", target));
    if (!target_data) return;

    for (let i = 0; i < target_data.children.length; ++i) {
        const uri = toDataUrl("metadata", target_data.children[i]);
        const child_data = await fetchJson(uri);
        if (child_data) clist.push(child_data);
    }
    setHTML("child-list", makeHTML(clist));
})()
