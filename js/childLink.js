(async () => {
    function getTarget() {
        var thisName = document.getElementById('thisName').value;
        return encodeURI(thisName);
    }

    function makeHTML(clist) {
        if (clist == null || clist.length < 1) return '';

        let ret = '<h2>하위 문서</h2><ul>';
        for (let i = 0; i < clist.length; ++i) {
            console.log(clist[i])
            ret += `<li><a href="${clist[i].url}">${clist[i].title}</a></li>`;
        }
        ret += '</ul>'
        return ret;
    }

    const target = getTarget();
    const clist = [];
    let target_data = null;
    try {
        const target_res = await fetch(`/data/metadata/${target}.json`);
        target_data = await target_res.json();
    }
    catch (e) {
        console.log(e);
        return;
    }

    for (let i = 0; i < target_data.children.length; ++i) {
        let uri = `/data/metadata/${target_data.children[i]}.json`
        let child_data = null;
        try {
            const child_res = await fetch(uri)
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
