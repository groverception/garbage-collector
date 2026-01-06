import { useState, useEffect, useCallback } from 'react';
import { getUserName, setUserName as setUserNameDb } from '../services/database/settings';

export function useSettings() {
  const [userName, setUserNameState] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const name = await getUserName();
      setUserNameState(name);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setUserName = useCallback(async (name: string) => {
    try {
      await setUserNameDb(name);
      setUserNameState(name);
    } catch (error) {
      console.error('Error saving user name:', error);
    }
  }, []);

  return {
    userName,
    setUserName,
    isLoading,
    reload: loadSettings,
  };
}
