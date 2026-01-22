import { normalizeDocId } from "./path-utils.js";
import { fetchJson, setHTML } from "./client-utils.js";

(() => {
    const container = document.getElementById("misc-list");
    if (!container) return;
    const current = document.getElementById("thisName");
    if (current && normalizeDocId(current.value) !== "index") return;

    function makeHTML(list) {
        if (!list || list.length === 0) return "";
        let html = "<h2>기타 문서</h2><ul>";
        list.forEach((item) => {
            html += `<li><a href="${item.url}">${item.title}</a></li>`;
        });
        html += "</ul>";
        return html;
    }

    fetchJson("/data/misc.json").then((data) => {
        if (!data) return;
        setHTML("misc-list", makeHTML(data));
    });
})();
