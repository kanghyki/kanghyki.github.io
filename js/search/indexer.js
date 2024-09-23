import { TrieElement } from "./trie.js";

export class Indexer {
    constructor() {
        this.storage = {};
        this.trie = new TrieElement("");
    }

    find(word) {
        if (this.storage[word]) return this.storage[word];
        return [];
    }

    addIndex(id, data) {
        const words = data.match(/[a-zA-Z가-힣0-9]+/g);
        if (!words) return;
        for (let i = 0; i < words.length; ++i) {
            const low_word = words[i].toLowerCase();
            if (this.storage[low_word]) this.storage[low_word].add(id);
            else this.storage[low_word] = new Set([id]);
            this.trie.insert(low_word);
        }
    }

    findChildIndex(str) {
        return this.trie.getChildList(str?.toLowerCase());
    }

    toJson() {
        const ret = JSON.stringify(
            this.storage,
            (_, val) => {
                if (val instanceof Set) return Array.from(val);
                return val;
            },
            1
        );
        return ret;
    }

    fromJson(json) {
        this.storage = json;
        for (const key in this.storage) this.trie.insert(key);
    }
}
