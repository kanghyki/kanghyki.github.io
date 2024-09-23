export class Search {
    constructor(indexer) {
        this.indexer = indexer;
    }

    search(query) {
        const list = this.indexer.trie.getChildList(query);
        let pages = [];
        for (const child of list) {
            const info = this.indexer.find(child);
            if (info) pages = pages.concat(info);
        }
        return Array.from(new Set(pages));
    }
}
