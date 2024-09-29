(async () => {
    function getTarget() {
        var thisName = document.getElementById("thisName").value;
        return encodeURI(thisName);
    }
    const target = getTarget();

    function makeHTML(mention_map) {
        let ret = '<h2>이 문서를 참조한 문서</h2><ul class="mention-ul">';
        for (const key of mention_map.keys()) {
            const value = mention_map.get(key);
            ret += `<li>
                <a class="mention-link" href="${value.metadata.url}">
                    <span>${value.metadata.title}</span>`;
            for (const paragraph of value.paragraphs) {
                const para = paragraph.replace(
                    /\[\[(.+?)\]\](\{(.+?)\})?/g,
                    (match, p1, p2, p3) => (p3 ? p3 : p1)
                );
                ret += `<div> - ${para}</div>`;
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
            const res = await fetch(`/data/metadata/${file_path}.json`);
            if (!res.ok) continue;
            const data = await res.json();
            mention_map.get(file_path).metadata = data;
        } catch (e) {
            console.log(e);
            continue;
        }
    }

    document.getElementById("mention-list").innerHTML = makeHTML(mention_map);
})();
