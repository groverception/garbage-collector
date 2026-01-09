# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
NO need to create documentation of everything you do

## Project Overview

**Garbage Collector** is a civic engagement React Native mobile app built with Expo that enables citizens to report garbage in public spaces and volunteer for cleanup tasks. The app features onboarding, garbage reporting with photos, volunteer task management, history tracking, and user settings.

## Common Commands

### Development

```bash
npm install          # Install dependencies
npm start            # Start Expo development server
npm run ios          # Run on iOS Simulator (macOS only)
npm run android      # Run on Android Emulator
npm run web          # Run in web browser
npm run lint         # Run ESLint
npx expo doctor      # Check for common Expo issues
```

### Building

```bash
# Development builds (for testing)
eas build --platform ios --profile development
eas build --platform android --profile development

# Production builds
eas build --platform ios --profile production
eas build --platform android --profile production

# Web build
npx expo export:web  # Output to dist/ directory
```

## Architecture

### Routing & Navigation

- Uses **Expo Router** (file-based routing) with TypeScript typed routes
- Three main navigation groups:
  - `app/index.tsx` - Entry point that checks onboarding status and redirects
  - `app/(onboarding)/` - First-time user onboarding flow
  - `app/(tabs)/` - Main tab navigation (Home, Upload, Volunteer, History, Settings)
- Navigation is wrapped in `GestureHandlerRootView` for gesture support

### Data Layer

- **SQLite database** via `expo-sqlite` for persistent local storage
- Database initialized in `app/_layout.tsx` before app renders
- Two main tables:
  - `uploads` - User-reported garbage submissions
  - `settings` - App settings and user preferences (including onboarding status)
- Database service pattern:
  - `src/services/database/index.ts` - Main database implementation (SQLite for native)
  - `src/services/database/index.web.ts` - Mock implementation for web platform
  - `src/services/database/settings.ts` - Settings-specific operations
  - `src/services/database/uploads.ts` - Upload-specific operations
- Database must be initialized via `initDatabase()` before use; access via `getDatabase()`

### State Management

- **Global State**: `AppContext` (in `src/context/AppContext.tsx`) manages userName globally
- **Local State**: Custom hooks in `src/hooks/` for feature-specific state:
  - `useVolunteer` - Volunteer task management (currently uses dummy data from `src/constants/volunteerData.ts`)
  - `useUploads` - Upload form and history via SQLite
  - `useOnboarding` - Onboarding flow state
  - `useImagePicker` - Camera/gallery image selection
  - `useSettings` - Settings persistence

### Component Organization

Components are organized by feature in `src/components/`:

- `common/` - Shared UI components (buttons, cards, etc.)
- `landing/` - Home screen components (CompletedTasksSection, ImpactStatsSection)
- `upload/` - Upload form components
- `volunteer/` - Volunteer task list and detail components (VolunteerDetailModal)
- `history/` - Upload history display components
- `onboarding/` - Onboarding slide components
- Root `components/` directory contains legacy Expo template components

### Type System

All types are centralized in `src/types/`:

- `upload.ts` - Upload/report data structures and status types
- `volunteer.ts` - Volunteer task workflow, status transitions, comments, and verification
- `settings.ts` - Settings-related types
- All exported through `src/types/index.ts`

### Volunteer Workflow

The volunteer system has a specific status flow:

1. `open` - Task available for volunteers
2. `in_progress` - Someone is actively working on it
3. `resolved` - Volunteer marked as complete, awaiting verification
4. `verified` - Another user verified the task is complete

Status changes require mandatory comments for accountability. Tasks support comments and maintain a complete status history.

### Platform-Specific Code

Uses `.web.ts` extension for web-specific implementations:

- `src/services/database/index.web.ts` - Mock database for web
- `components/useClientOnlyValue.web.ts` - Web-specific SSR handling

### Styling & Theming

- Constants in `src/constants/` (colors, translations, onboarding data, animations)
- Supports light/dark mode via React Navigation theming
- Responsive utilities in `src/utils/responsive.ts`
- Uses StyleSheet.create for all styles

### Modern Design System & Animations

The app features a **bold, experimental design system** with abstract graphics and sophisticated animations:

**Animation Hooks** (in `src/hooks/`):

- `useAnimatedEntrance` - Component entrance animations (fade, slide, scale, bounce, rotate)
- `useStaggeredEntrance` - List items with sequential stagger delays
- `useContinuousAnimation` - Infinite loop animations for backgrounds
- `useFloatingAnimation` - Floating/hovering effects
- `usePulseAnimation` - Pulsing/breathing scale effects
- `useRotationAnimation` - Continuous rotation
- `useWaveAnimation` - Oscillating wave motion

**Abstract Graphic Components** (in `src/components/common/`):

- `MorphingBlob` - Organic shapes that morph with gradient effects
- `AnimatedWave` / `LayeredWaves` - Flowing SVG wave patterns
- `FloatingParticles` - Nature/eco-themed floating particle system
- `GeometricPattern` - Minimalist patterns (circles, grids, hexagons)

**Animation Constants** (`src/constants/animations.ts`):

- Duration presets (fast, normal, slow, continuous)
- Spring configurations (gentle, bouncy, snappy, wobbly)
- Parallax factors for multi-layer depth
- Easing functions for different effects

**Implementation:**

- Onboarding screens use parallax effects, morphing blobs, waves, and floating particles
- Home screen features scroll-driven parallax, geometric patterns, entrance animations, and continuous morphing backgrounds
- All powered by React Native Reanimated 4.1.1 for 60fps performance

See `DESIGN_SYSTEM.md` for comprehensive documentation on usage and best practices.

### Path Aliases

TypeScript is configured with `@/*` path alias mapping to project root for cleaner imports.

## Commit Conventions

Follow Conventional Commits:

- `feat:` - New features
- `fix:` - Bug fixes
- `refactor:` - Code refactoring
- `docs:` - Documentation changes
- `test:` - Test additions or modifications
- `chore:` - Maintenance tasks
