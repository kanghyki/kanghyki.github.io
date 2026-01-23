import { toDataUrl } from './path-utils.js';
import { fetchJson, getDocIdFromPage, getDisplayTitle, setHTML } from './client-utils.js';

(async () => {
    function makeHTML(folderItems, docItems) {
        let ret = '';

        ret += '<section class="child-index-section">';
        ret += '<h2>하위 폴더</h2>';
        if (folderItems && folderItems.length > 0) {
            ret += '<ul class="child-index-list">';
            folderItems.forEach((item) => {
                ret += `<li><a href="${item.url}">${item.title}</a></li>`;
            });
            ret += '</ul>';
        } else {
            ret += '<p class="child-index-empty">하위 폴더가 없습니다.</p>';
        }
        ret += '</section>';

        ret += '<section class="child-index-section">';
        ret += '<h2>하위 문서</h2>';
        if (docItems && docItems.length > 0) {
            ret += '<ul class="child-index-list">';
            docItems.forEach((item) => {
                ret += `<li><a href="${item.url}">${item.title}</a></li>`;
            });
            ret += '</ul>';
        } else {
            ret += '<p class="child-index-empty">하위 문서가 없습니다.</p>';
        }
        ret += '</section>';

        return ret;
    }

    const target = getDocIdFromPage();
    if (!target) return;
    const folderItems = [];
    const docItems = [];
    const target_data = await fetchJson(toDataUrl('metadata', target));
    if (!target_data) return;

    const children = target_data.children || [];
    const indexChildren = children.filter((id) => id.endsWith('/index'));
    const leafChildren = children.filter((id) => !id.endsWith('/index'));
    // Show direct child index pages only
    for (const indexId of indexChildren) {
        const indexData = await fetchJson(toDataUrl('metadata', indexId));
        if (!indexData || !indexData.url) continue;
        folderItems.push({ url: indexData.url, title: getDisplayTitle(indexData) });
    }

    // Show documents under current index
    for (const id of leafChildren) {
        const data = await fetchJson(toDataUrl('metadata', id));
        if (!data || !data.url) continue;
        docItems.push({ url: data.url, title: getDisplayTitle(data) });
    }

    folderItems.sort((a, b) => a.title.localeCompare(b.title));
    docItems.sort((a, b) => a.title.localeCompare(b.title));
    setHTML('child-list', makeHTML(folderItems, docItems));
})();
