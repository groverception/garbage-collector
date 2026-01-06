export interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  icon: string;
  isLast?: boolean;
}

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: 1,
    title: 'Welcome to Garbage Collector',
    description: 'Help keep our city clean by reporting garbage in public spaces.',
    icon: 'leaf',
  },
  {
    id: 2,
    title: 'Snap a Photo',
    description: 'Take a picture of garbage you see in your neighborhood or while commuting.',
    icon: 'camera',
  },
  {
    id: 3,
    title: 'Report the Location',
    description: 'Tell us where you found it and who should be notified for cleanup.',
    icon: 'map-marker',
  },
  {
    id: 4,
    title: 'Make a Difference',
    description: 'Your reports help municipal workers prioritize cleanup efforts and keep our city beautiful.',
    icon: 'check-circle',
    isLast: true,
  },
];
