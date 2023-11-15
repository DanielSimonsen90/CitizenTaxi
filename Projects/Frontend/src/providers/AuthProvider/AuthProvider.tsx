import { useState, PropsWithChildren } from 'react';
import { useAsyncEffect, useCallbackOnce } from 'danholibraryrjs';
import type { User } from 'models/backend/common/dtos';
import { AuthProviderContext, COOKIE_NAME } from './AuthProviderConstants';
import { Request } from 'utils';
import { LoginPayload } from 'models/backend/business/models/payloads';
import { parseCookieString } from 'utils/CookieUtil';
import { AuthTokensJSON, Guid } from 'types';
import { useCookie } from 'hooks';

export default function AuthProviderProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User>();
  const [logginIn, setLogginIn] = useState<boolean>(false);
  const [jsonCookie, updateCookie, deleteCookie] = useCookie<AuthTokensJSON>(COOKIE_NAME, {} as AuthTokensJSON);

  const login = useCallbackOnce(async (username: string, password: string) => {
    setLogginIn(true);
    const payload: LoginPayload = {
      username,
      password
    }
    const response = await Request<Guid>('users/authenticate', {
      method: 'POST',
      body: payload
    });

    setLogginIn(false);
    if (!response.success) return alert(response.text);

    const userId = response.data;
    const userResponse = await Request<User, Guid>(`users/${userId}`);
    if (!userResponse.success) return alert(userResponse.text);

    setUser(userResponse.data);
  });
  const logout = useCallbackOnce(async () => {
    const response = await Request('users/authenticate', { method: 'DELETE' });
    if (!response.success) return alert(response.text);

    deleteCookie();
    setUser(undefined);
  });

  return (
    <AuthProviderContext.Provider value={{
      user, logginIn,
      login, logout,
    }}>
      {children}
    </AuthProviderContext.Provider>
  );
}