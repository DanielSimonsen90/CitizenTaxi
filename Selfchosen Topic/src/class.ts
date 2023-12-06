type BaseEntity = {
  id: any;
}

class Repository<T extends BaseEntity> {
  private log(message: string) {
    console.log(message);
  }
  
  protected data = new Map<T['id'], T>();

  public add(item: T) {
    this.data.set(item.id, item);
    this.log(`Added item with id: ${item.id}`);
  }

  public remove(item: T) {
    this.data.delete(item.id);
    this.log(`Removed item with id: ${item.id}`);
  }

  public getAll() {
    this.log(`Returning all items`);
    return this.data;
  }

  public getById(id: BaseEntity['id']) {
    this.log(`Returning item with id: ${id}`);
    return this.data.get(id);
  }
}

const testRepo = new Repository<{ id: number, name: string }>();
