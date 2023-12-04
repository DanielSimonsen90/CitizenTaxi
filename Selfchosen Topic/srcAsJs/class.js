/**
 * @typedef {Object} BaseEntity
 * @property {any} id
 */

/**
 * @template {BaseEntity} T
 */
class Repository {
  /**
   * @private
   * @param {string} message
   */
  log(message) {
    console.log(message);
  }

  /**
   * @protected
   * @type {Map<BaseEntity['id'], T>}
   */
  data = new Map();

  /**
   * @param {T} item 
   */
  add(item) {
    this.data.set(item.id, item);
    this.log(`Added item with id ${item.id}`);
  }

  /**
   * @param {T} item 
   */
  remove(item) {
    this.data.delete(item.id);
    this.log(`Removed item with id ${item.id}`);
  }

  /**
   * @param {T} item 
   */
  getAll() {
    this.log('Returning all items');
    return this.data;
  }

  /**
   * @param {BaseEntity['id']} id 
   */
  getById(id) {
    this.log(`Returning item with id ${id}`);
    return this.data.get(id);
  }
}

const testRepo = new Repository();