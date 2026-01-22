(async () => {
    function getTarget() {
        var thisName = document.getElementById('thisName').value;
        return window.PathUtils.normalizeDocId(thisName);
    }

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

    const target = getTarget();
    const clist = [];
    let target_data = null;
    try {
        const target_res = await fetch(window.PathUtils.toDataUrl("metadata", target));
        if (!target_res.ok) return;
        target_data = await target_res.json();
    }
    catch (e) {
        console.log(e);
        return;
    }

    for (let i = 0; i < target_data.children.length; ++i) {
        let uri = window.PathUtils.toDataUrl("metadata", target_data.children[i]);
        let child_data = null;
        try {
            const child_res = await fetch(uri)
            if (!child_res.ok) continue;
            child_data = await child_res.json();
        }
        catch (e) {
            console.log(e);
            continue;
        }
        clist.push(child_data);
    }
    document.getElementById('child-list').innerHTML = makeHTML(clist);
})()
