import { useState, PropsWithChildren } from 'react';
import { useCallbackOnce } from 'danholibraryrjs';
import { useNavigate } from 'react-router-dom';

import type { User } from 'models/backend/common/dtos';
import { LoginPayload } from 'models/backend/business/models/payloads';
import { Request, showNotification } from 'utils';
import { Guid, Nullable } from 'types';

import { AuthProviderContext } from './AuthProviderConstants';

export default function AuthProviderProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<Nullable<User>>(null);
  const [logginIn, setLogginIn] = useState<boolean>(false);
  const navigate = useNavigate();

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
    if (!response.success) return showNotification({ type: 'error', message: response.text });

    const userId = response.data;
    const userResponse = await Request<User, Guid>(`users/${userId}`);
    if (!userResponse.success) return showNotification({ type: 'error', message: userResponse.text });

    setUser(userResponse.data);
  });
  const logout = useCallbackOnce(async () => {
    const response = await Request('users/authenticate', { method: 'DELETE' });
    if (!response.success) return alert(response.text);

    setUser(null);
    navigate('/')
  });

  return (
    <AuthProviderContext.Provider value={{
      user, loggingIn: logginIn,
      login, logout,
    }}>
      {children}
    </AuthProviderContext.Provider>
  );
}