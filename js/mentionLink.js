(async () => {
    function getTarget() {
        var thisName = document.getElementById('thisName').value;
        return encodeURI(thisName);
    }

    function makeHTML(mlist) {
        if (mlist == null || mlist.length < 1) return '';

        let ret = '<h2>이 문서를 참조한 문서</h2><ul class="mention-ul">';
        for (const mention of mlist) {
            ret += `<li>
                <a class="mention-link" href="${mention.url}">
                    <span>${mention.title}</span>
                    <div>${mention.paragraph}</div>
                </a>
            </li>`;
        }
        ret += '</ul>'

        return ret;
    }

    const target = getTarget();
    let target_res = null;
    try {
        target_res = await fetch(`/data/mention/${target}.json`);
        if (!target_res.ok) return;
        target_data = await target_res.json();
    } catch (e) {
        console.log(e);
        return;
    }

    const mlist = [];
    for (const mention of target_data) {
        let uri = `/data/metadata/${mention.from}.json`
        let child_data = null;
        try {
            const child_res = await fetch(uri)
            child_data = await child_res.json();
        }
        catch (e) {
            console.log(e);
            continue;
        }
        child_data.paragraph = mention.paragraph;
        mlist.push(child_data);
    }
    document.getElementById('mention-list').innerHTML = makeHTML(mlist);
})()
