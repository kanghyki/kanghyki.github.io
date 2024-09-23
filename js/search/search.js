export class Search {
    constructor(indexer) {
        this.indexer = indexer;
    }

    search(query) {
        const list = this.indexer.findChildIndex(query);
        let pages = [];
        for (const child of list) {
            const file_names = this.indexer.find(child);
            if (file_names) pages = pages.concat(file_names);
        }
        return Array.from(new Set(pages));
    }
}
