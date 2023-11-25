import { useState, PropsWithChildren } from 'react';
import { useCallbackOnce, useEffectOnce } from 'danholibraryrjs';
import type { User } from 'models/backend/common/dtos';
import { AuthProviderContext } from './AuthProviderConstants';
import { Request, showNotification } from 'utils';
import { LoginPayload } from 'models/backend/business/models/payloads';
import { Guid, Nullable } from 'types';
import { useNavigate } from 'react-router-dom';

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

  // TODO: Remove this - it's only for development purposes
  useEffectOnce(() => {
    // login('admin', 'admin123');
    login('carl', 'carl123');
  })

  return (
    <AuthProviderContext.Provider value={{
      user, loggingIn: logginIn,
      login, logout,
    }}>
      {children}
    </AuthProviderContext.Provider>
  );
}