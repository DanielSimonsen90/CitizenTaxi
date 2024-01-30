import { User } from "models/backend/common/dtos";
import { Nullable } from "types";

export type AuthProviderContextType<AllowNullable extends boolean> = {
  user: AllowNullable extends true ? Nullable<User> : User;

  login: (username: string, password: string) => void;
  logout: () => void;
  loggingIn: boolean;
}