export class Search {
    constructor(indexer) {
        this.indexer = indexer;
    }

    search(query) {
        const query_words = query.match(/<?\/?([a-zA-Z가-힣0-9]+|".+"|'.+')>?/g);
        if (!query_words) return [];
        const page_prior_map = new Map();
        for (const query_word of query_words) {
            const list = this.indexer.findChildIndex(query_word);
            for (const child of list) {
                const indexes = this.indexer.find(child);
                for (const index of indexes) {
                    const add_score = this.calcScore(index);
                    const orig_score = page_prior_map.get(index.id) || 0;
                    page_prior_map.set(index.id, orig_score + add_score);
                }
            }
        }

        const sorted_file_names_by_prior = [];
        new Map(Array.from(page_prior_map).sort((a, b) => b[1] - a[1])).forEach(
            (_, key) => {
                sorted_file_names_by_prior.push(key);
            }
        );
        return sorted_file_names_by_prior;
    }

    calcScore(index) {
        const metawords = [
            { keyword: "title", score: 50 },
            { keyword: "tag", score: 15 },
            { keyword: "summray", score: 10 },
        ];
        for (const meta of metawords) {
            if (this.isInMetaWord(index, meta.keyword)) {
                return meta.score;
            }
        }

        return 1;
    }

    isInMetaWord(index, meta_name) {
        const meta_first = this.indexer.find(`<${meta_name}>`);
        const meta_last = this.indexer.find(`</${meta_name}>`);
        if (meta_first.length === 0 || meta_last.length === 0) return false;

        const s = meta_first.find((e) => e.id === index.id);
        const e = meta_last.find((e) => e.id === index.id);
        if (!s || !e) return false;

        return s.pos < index.pos && index.pos < e.pos ? true : false;
    }
}
