import { getDatabase } from './index';

export async function getSetting(key: string): Promise<string | null> {
  const db = getDatabase();
  return db.getSetting(key);
}

export async function setSetting(key: string, value: string): Promise<void> {
  const db = getDatabase();
  await db.setSetting(key, value);
}

export async function deleteSetting(key: string): Promise<void> {
  const db = getDatabase();
  await db.deleteSetting(key);
}

export async function getUserName(): Promise<string> {
  const name = await getSetting('user_name');
  return name ?? '';
}

export async function setUserName(name: string): Promise<void> {
  await setSetting('user_name', name);
}

export async function hasCompletedOnboarding(): Promise<boolean> {
  const value = await getSetting('onboarding_completed');
  return value === 'true';
}

export async function setOnboardingCompleted(completed: boolean): Promise<void> {
  await setSetting('onboarding_completed', completed ? 'true' : 'false');
}

export async function resetOnboarding(): Promise<void> {
  await deleteSetting('onboarding_completed');
}
