import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
} as const;

export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (SCREEN_WIDTH >= BREAKPOINTS.desktop) return 'desktop';
  if (SCREEN_WIDTH >= BREAKPOINTS.tablet) return 'tablet';
  return 'mobile';
}

export const deviceType = getDeviceType();
export const isTablet = deviceType === 'tablet' || deviceType === 'desktop';
export const isDesktop = deviceType === 'desktop';

const baseWidth = 375;
const baseHeight = 812;

export function wp(percentage: number): number {
  return PixelRatio.roundToNearestPixel((SCREEN_WIDTH * percentage) / 100);
}

export function hp(percentage: number): number {
  return PixelRatio.roundToNearestPixel((SCREEN_HEIGHT * percentage) / 100);
}

export function normalize(size: number): number {
  const scale = SCREEN_WIDTH / baseWidth;
  const newSize = size * scale;

  if (isDesktop) {
    return Math.round(PixelRatio.roundToNearestPixel(newSize * 0.85));
  }
  if (isTablet) {
    return Math.round(PixelRatio.roundToNearestPixel(newSize * 0.9));
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export function responsiveValue<T>(mobile: T, tablet?: T, desktop?: T): T {
  if (isDesktop && desktop !== undefined) return desktop;
  if (isTablet && tablet !== undefined) return tablet;
  return mobile;
}

export const MAX_CONTENT_WIDTH = 600;

export function getContentWidth(): number {
  if (isDesktop || isTablet) {
    return Math.min(SCREEN_WIDTH - 48, MAX_CONTENT_WIDTH);
  }
  return SCREEN_WIDTH;
}

export const SPACING = {
  xs: normalize(4),
  sm: normalize(8),
  md: normalize(16),
  lg: normalize(24),
  xl: normalize(32),
  xxl: normalize(48),
} as const;

export const FONT_SIZES = {
  xs: normalize(12),
  sm: normalize(14),
  md: normalize(16),
  lg: normalize(18),
  xl: normalize(24),
  xxl: normalize(32),
  title: normalize(40),
} as const;
