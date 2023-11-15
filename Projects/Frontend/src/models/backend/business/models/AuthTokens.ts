import { Guid } from "types";

export type AuthToken = {
  value: string;
  expiresAt: Date;
}

export type AuthTokens = {
  accessToken: AuthToken;
  refreshToken: AuthToken;
  userId: Guid;
}