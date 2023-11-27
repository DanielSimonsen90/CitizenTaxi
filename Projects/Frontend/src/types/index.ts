import { AuthToken, AuthTokens } from "models/backend/business/models/AuthTokens";
import { Role, CarHeight, Companion, Follow, HelpingUtil } from "models/backend/common";

// Generic T can be either T or null
export type Nullable<T> = T | null; 

// Generic T cannot be null or undefined
export type NonNullable<T> =
  T extends null ? never :
  T extends undefined ? never :
  T;

// Generic T can be either T or awaited T
export type Promiseable<T> = T | Promise<T>;

// Type for storing a value in local or session storage using a key
export type StorageOptions = {
  storage: Storage,
  key: string,
};

// TypeScript doesn't have a built-in type for Guid, however it is interpreted as a string
export type Guid = string;

export type AuthTokensJSON = {
  [key in keyof AuthTokens]: AuthTokens[key] extends AuthToken 
    ? Record<string, string> 
    : AuthTokens[key];
}

export type AllStringValues<T> = {
  [key in keyof T]: string;
}

export type ErrorForModel<T extends Record<string, any>> = {
  // @ts-ignore -- Doesn't understand that key is a string
  [key in keyof T as `${key}Error`]?: string;
}

export type Enum = Role | CarHeight | Companion | Follow | HelpingUtil;
export type EnumTypes = typeof Role | typeof CarHeight | typeof Companion | typeof Follow | typeof HelpingUtil;

export type FunctionComponent<P extends {} | undefined> = (props: P) => JSX.Element | null;