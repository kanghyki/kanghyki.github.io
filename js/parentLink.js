import { toDataUrl } from './path-utils.js';
import { fetchJson, getDocIdFromPage, getDisplayTitle, setHTML } from './client-utils.js';

(function () {
    const recursiveLimit = 30;
    const target = getDocIdFromPage();
    if (!target) return;
    insertParent(target, 0, []);

    /**
     * 부모 문서 목록을 받아, 부모 문서들의 링크를 만들어준다.
     */
    function makeHTML(plist) {
        if (plist == null || plist.length < 1) {
            return '';
        }
        let pr = '상위 폴더: ';
        for (let i = 0; i < plist.length; i++) {
            const title = getDisplayTitle(plist[i]);
            pr += `<a href="${plist[i].url}">${title}</a>`;
            if (i < plist.length - 1) {
                pr += `<span> › </span>`;
            }
        }
        return pr;
    }

    /**
     * 재귀하며 부모 문서 정보를 가져온다.
     * 모든 부모 문서를 가져오면 화면에 부모 문서 링크를 만들어 준다.
     */
    function insertParent(target, recursiveCount, parentList) {
        if (recursiveCount > recursiveLimit) {
            return;
        }

        fetchJson(toDataUrl('metadata', target)).then((data) => {
            if (data == null) {
                return;
            }
            parentList.unshift(data);

            if (data.parent == null) {
                parentList.pop(); // this 문서가 부모 문서 목록에 나오지 않도록 제거해준다.
                setHTML('parent-list', makeHTML(parentList));
                return;
            }

            setTimeout(() => insertParent(data.parent, recursiveCount + 1, parentList), 0);
        });
    }
})();
