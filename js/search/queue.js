export class Queue {
    constructor() {
        this.arr = [];
    }

    clear() {
        this.arr = [];
    }

    toArray() {
        return this.arr;
    }

    enqueue(s) {
        this.arr.push(s);
    }

    dequeue() {
        return this.arr.shift();
    }

    isEmpty() {
        return this.arr.length === 0;
    }
}
