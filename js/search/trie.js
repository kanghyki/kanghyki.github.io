import { Queue } from "./queue.js";

export class TrieElement {
    constructor(c) {
        this.ch = c;
        this.isWord = false;
        this.children = [];
        this.value = "";
    }

    getChild(c) {
        return this.children.find((child) => child.ch === c);
    }

    insert(s, value) {
        if (value) this.value = value;
        if (!s || !s.length) {
            this.isWord = true;
            return;
        }

        const c = s.substring(0, 1);
        const sub = s.substring(1);

        const child = this.getChild(c);
        if (child) child.insert(sub);
        else {
            const node = new TrieElement(c);
            this.children.push(node);
            node.insert(sub, this.value + c);
        }
    }

    find(c) {
        if (!c || !c.length) return this;
        const child = this.getChild(c.substring(0, 1));
        if (child) return child.find(c.substring(1));
        return null;
    }

    getChildList(str, max = 5) {
        if (!str) return [];
        const node = this.find(str);
        if (!node) return [];
        const ret = [];
        const queue = new Queue();
        queue.enqueue(node);

        while (!queue.isEmpty()) {
            const node = queue.dequeue();
            if (!node) continue;

            if (node.isWord) ret.push(node.value);
            if (ret.length >= max) break;

            const children = node.children;
            for (let child of children) {
                queue.enqueue(child);
            }
        }
        return ret;
    }
}
