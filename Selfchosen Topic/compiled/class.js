class Repository {
    log(message) {
        console.log(message);
    }
    data = new Map();
    add(item) {
        this.data.set(item.id, item);
        this.log(`Added item with id: ${item.id}`);
    }
    remove(item) {
        this.data.delete(item.id);
        this.log(`Removed item with id: ${item.id}`);
    }
    getAll() {
        this.log(`Returning all items`);
        return this.data;
    }
    getById(id) {
        this.log(`Returning item with id: ${id}`);
        return this.data.get(id);
    }
}
const testRepo = new Repository();
//# sourceMappingURL=class.js.map