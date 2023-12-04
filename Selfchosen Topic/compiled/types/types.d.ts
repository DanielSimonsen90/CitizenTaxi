export type Data = {
    name: string;
    age: number;
};
export declare enum StatusCode {
    OK = 200,
    NOT_FOUND = 404
}
export type SimulatedResponse<T> = {
    statusCode: StatusCode;
    data: T;
};
