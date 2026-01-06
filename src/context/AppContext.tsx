import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getUserName, setUserName as setUserNameDb } from '../services/database/settings';

interface AppContextType {
  userName: string;
  setUserName: (name: string) => Promise<void>;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userName, setUserNameState] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserName();
  }, []);

  const loadUserName = async () => {
    try {
      const name = await getUserName();
      setUserNameState(name);
    } catch (error) {
      console.error('Error loading user name:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setUserName = useCallback(async (name: string) => {
    await setUserNameDb(name);
    setUserNameState(name);
  }, []);

  return (
    <AppContext.Provider value={{ userName, setUserName, isLoading }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
