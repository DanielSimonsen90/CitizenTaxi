import { AuthTokens } from "models/backend/business/models/AuthTokens";
import { AuthTokensJSON } from "types";

export function parseCookieString(parsed: AuthTokensJSON): AuthTokens {
  const tokens = Object.keysOf(parsed).reduce((acc, key) => {
    if (key === 'userId') {
      acc.userId = parsed[key];
      return acc;
    }

    const { value, expiresAt: expiresAtString } = parsed[key];
    const expiresAt = new Date(expiresAtString);
    acc[key] = { value, expiresAt };
    return acc;
  }, {} as AuthTokens);

  return tokens;
}

// export function stringifyTokens(value: AuthTokens) {
//   console.log('stringifyTokens', value);
//   const tokens = Object.keysOf(value).reduce((acc, key) => {
//     if (key === 'userId') {
//       acc.userId = value.userId;
//       return acc;
//     }

//     const { value: tokenValue, expiresAt } = value[key];
//     acc[key] = { value: tokenValue, expiresAt: expiresAt.toISOString() };
//     return acc;
//   }, {} as AuthTokensJSON);

//   return tokens;
// }