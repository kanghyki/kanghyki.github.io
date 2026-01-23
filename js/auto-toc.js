(function () {
    function slugify(text) {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');
    }

    function ensureHeadingId(heading, index) {
        if (heading.id && heading.id.trim() !== '') {
            return heading.id;
        }
        var base = slugify(heading.textContent || '');
        var id = base ? base : 'toc-' + index;
        heading.id = id;
        return id;
    }

    function buildToc(headings) {
        var toc = document.createElement('ul');
        toc.id = 'markdown-toc';
        var stack = [{ level: 1, list: toc }];

        headings.forEach(function (heading, index) {
            var id = ensureHeadingId(heading, index);
            var level = parseInt(heading.tagName.replace('H', ''), 10) || 1;

            while (stack.length > 1 && level <= stack[stack.length - 1].level) {
                stack.pop();
            }

            var parentList = stack[stack.length - 1].list;
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.href = '#' + encodeURIComponent(id);
            a.textContent = heading.textContent || id;
            li.appendChild(a);
            parentList.appendChild(li);

            var subList = document.createElement('ul');
            li.appendChild(subList);
            stack.push({ level: level, list: subList });
        });

        return toc;
    }

    function main() {
        var content = document.querySelector('article.post-content');
        if (!content) return;
        if (document.getElementById('markdown-toc')) return;

        var headings = Array.from(content.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        if (headings.length === 0) return;

        var toc = buildToc(headings);
        content.insertBefore(toc, content.firstChild);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();
