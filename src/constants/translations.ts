export interface TitleTranslation {
  language: string;
  text: string;
  script: string;
}

export const TITLE_TRANSLATIONS: TitleTranslation[] = [
  { language: 'English', text: 'Garbage Collector', script: 'latin' },
  { language: 'Hindi', text: 'कचरा संग्राहक', script: 'devanagari' },
  { language: 'Tamil', text: 'குப்பை சேகரிப்பான்', script: 'tamil' },
  { language: 'Telugu', text: 'చెత్త సేకరించేవాడు', script: 'telugu' },
  { language: 'Kannada', text: 'ಕಸ ಸಂಗ್ರಾಹಕ', script: 'kannada' },
  { language: 'Malayalam', text: 'മാലിന്യ ശേഖരകൻ', script: 'malayalam' },
  { language: 'Bengali', text: 'আবর্জনা সংগ্রাহক', script: 'bengali' },
  { language: 'Marathi', text: 'कचरा गोळा करणारा', script: 'devanagari' },
  { language: 'Gujarati', text: 'કચરો ભેગો કરનાર', script: 'gujarati' },
  { language: 'Punjabi', text: 'ਰੱਦੀ ਇਕੱਠਾ ਕਰਨ ਵਾਲਾ', script: 'gurmukhi' },
];

export const ANIMATION_CONFIG = {
  displayDuration: 2000,
  fadeDuration: 500,
};
