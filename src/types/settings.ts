export interface UserSettings {
  userName: string;
  hasCompletedOnboarding: boolean;
}

export interface SettingRow {
  key: string;
  value: string;
  updatedAt: string;
}
