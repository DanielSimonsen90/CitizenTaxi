export type Data = {
  name: string;
  age: number;
};

export enum StatusCode {
  OK = 200,
  NOT_FOUND = 404,
}

export type SimulatedResponse<T> = {
  statusCode: StatusCode;
  data: T;
};

export type ReturnTypes<ReturnString extends boolean> =
  ReturnString extends true ? string : number;