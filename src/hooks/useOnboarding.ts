import { useState, useEffect, useCallback } from 'react';
import {
  hasCompletedOnboarding,
  setOnboardingCompleted,
  resetOnboarding as resetOnboardingDb,
} from '../services/database/settings';

export function useOnboarding() {
  const [isCompleted, setIsCompleted] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    try {
      const completed = await hasCompletedOnboarding();
      setIsCompleted(completed);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setIsCompleted(false);
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = useCallback(async () => {
    try {
      await setOnboardingCompleted(true);
      setIsCompleted(true);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  }, []);

  const resetOnboarding = useCallback(async () => {
    try {
      await resetOnboardingDb();
      setIsCompleted(false);
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  }, []);

  return {
    isCompleted,
    isLoading,
    completeOnboarding,
    resetOnboarding,
  };
}
