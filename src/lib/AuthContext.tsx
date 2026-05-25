import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, isAdmin: false, signIn: () => {}, signOut: () => {} });

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('local_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setIsAdmin(parsed.email === 'info@dreweb.online');
    }
    setLoading(false);
  }, []);

  const signIn = (email: string) => {
    const newUser = { email, uid: 'local-admin' };
    localStorage.setItem('local_user', JSON.stringify(newUser));
    setUser(newUser);
    setIsAdmin(email === 'info@dreweb.online');
  };

  const signOut = () => {
    localStorage.removeItem('local_user');
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
