import { TrieElement } from "./trie.js";

export class Indexer {
    constructor() {
        this.storage = new Map();
        this.trie = new TrieElement("");
    }

    find(word) {
        const indexes = this.storage.get(word);
        if (indexes) return indexes;
        return [];
    }

    addIndex(id, data) {
        const tokens = data
            .replace(/\[(.+)\]\(.*\)/gm, "$1")
            .match(/<?\/?([a-zA-Z가-힣0-9]+|".+"|'.+')>?/g);
        if (!tokens) return;
        for (let i = 0; i < tokens.length; ++i) {
            const lower_token = tokens[i].toLowerCase();
            let word_index = this.storage.get(lower_token);
            if (word_index) word_index.push({ id: id, pos: i });
            else this.storage.set(lower_token, [{ id: id, pos: i }]);
            this.trie.insert(lower_token);
        }
    }

    findChildIndex(str) {
        return this.trie.getChildList(str?.toLowerCase());
    }

    toJson() {
        return JSON.stringify(Array.from(this.storage.entries()), null, 1);
    }

    fromJson(json) {
        this.storage = new Map(json);
        for (const key of this.storage.keys()) {
            this.trie.insert(key);
        }
    }
}
