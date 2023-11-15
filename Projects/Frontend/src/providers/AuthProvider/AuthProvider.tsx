import { useState, PropsWithChildren } from 'react';
import { useCallbackOnce } from 'danholibraryrjs';
import type { User } from 'models/backend/common/dtos';
import { AuthProviderContext } from './AuthProviderConstants';

export default function AuthProviderProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User>();
  const [logginIn, setLogginIn] = useState<boolean>(false);
  const [token, setToken] = useState<string>();
  const [refreshToken, setRefreshToken] = useState<string>();

  const login = useCallbackOnce((username: string, password: string) => {
    throw new Error('Not implemented');
  });
  const logout = useCallbackOnce(() => {
    throw new Error('Not implemented');
  });

  return (
    <AuthProviderContext.Provider value={{
      user, logginIn,
      login, logout,
      token, refreshToken
    }}>
      {children}
    </AuthProviderContext.Provider>
  );
}