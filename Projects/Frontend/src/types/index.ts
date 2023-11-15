export type Nullable<T> = T | null;
export type NonNullable<T> =
  T extends null ? never :
  T extends undefined ? never :
  T;

export type Promiseable<T> = T | Promise<T>;

export type StorageOptions = {
  storage: Storage,
  key: string,
};

export type Guid = string;