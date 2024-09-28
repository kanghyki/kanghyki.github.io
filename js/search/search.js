export class Search {
    constructor(indexer) {
        this.indexer = indexer;
    }

    search(query) {
        const query_words = query.match(
            /<?\/?([a-zA-Z가-힣0-9]+|".+"|'.+')>?/g
        );
        if (!query_words) return [];
        const page_prior_map = new Map(); // (file_name : String) -> (priority : int)
        let word_children = [];
        let word_indexes = [];

        for (const query_word of query_words) {
            // 하위 노드에서 단어를 찾아 값을 리스트에 추가한다.
            // 찾지 못하면 아무것도 추가되지 않는다.
            word_children = word_children.concat(
                this.indexer.getTrieChildren(query_word)
            );
        }
        for (const child of word_children) {
            // 단어 인덱스를 찾아서 리스트에 추가한다.
            // 찾지 못하면 아무것도 추가되지 않는다.
            word_indexes = word_indexes.concat(this.indexer.find(child));
        }

        for (const index of word_indexes) {
            // 단어의 위치에 따라 점수를 계산해서 우선순위 맵에 계속해서 더한다.
            const add_score = this.calcScore(index);
            const orig_score = page_prior_map.get(index.id) || 0;
            page_prior_map.set(index.id, orig_score + add_score);
        }

        // 우선순위에 따라 내림차순으로 정렬하고,
        // 파일 이름을 추출해 새로운 배열을 만든다.
        const sorted_file_names_by_prior = Array.from(page_prior_map)
            .sort((a, b) => b[1] - a[1])
            .map((index) => index[0]);

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
