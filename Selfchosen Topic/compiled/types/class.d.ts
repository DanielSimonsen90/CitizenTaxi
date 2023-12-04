type BaseEntity = {
    id: any;
};
declare class Repository<T extends BaseEntity> {
    private log;
    protected data: Map<T["id"], T>;
    add(item: T): void;
    remove(item: T): void;
    getAll(): Map<T["id"], T>;
    getById(id: BaseEntity['id']): T;
}
declare const testRepo: Repository<{
    id: number;
    name: string;
}>;
