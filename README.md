# 🗑️ Garbage Collector

A cross-platform mobile application built with React Native and Expo that empowers citizens to report and manage garbage cleanup in their communities. This app bridges the gap between concerned citizens and municipal cleanup efforts, making it easy to document, report, and volunteer for garbage cleanup tasks.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Building for Production](#building-for-production)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

**Garbage Collector** is a civic engagement tool that allows users to:
- 📸 Photograph and report garbage in public spaces
- 📍 Specify exact locations of reported garbage
- 🤝 Volunteer for cleanup tasks
- 📊 Track cleanup progress and impact
- ✅ Verify completed cleanup efforts

The app uses a local SQLite database to store reports and manage volunteer tasks, ensuring data persistence across sessions.

## ✨ Features

### 🆕 Onboarding Experience
- Interactive multi-slide onboarding flow
- Introduction to app features and purpose
- First-time user setup

### 📤 Report Garbage
- Camera or gallery photo selection
- Location input for reported garbage
- Detailed description of the situation
- User attribution for accountability
- Form validation and error handling

### 👥 Volunteer System
- Browse available cleanup tasks
- Filter by status (Open, In Progress, Resolved, Verified)
- Volunteer for specific tasks
- Update task status with comments
- Activity timeline tracking
- Task verification system

### 📜 History Tracking
- View all submitted reports
- See report status and timestamps
- Track personal contribution

### ⚙️ Settings
- Manage user preferences
- View app information

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) (v0.81.5)
- **Platform**: [Expo](https://expo.dev/) (~v54.0.30)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (~v5.9.2)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (~v6.0.21)
- **Database**: [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/) (~v16.0.10)
- **Animations**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) (~v4.1.1)
- **UI Components**: Custom components with [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.x or higher ([Download](https://nodejs.org/))
- **npm**: v8.x or higher (comes with Node.js)
- **Expo CLI**: Install globally via `npm install -g expo-cli`
- **iOS Development** (macOS only):
  - Xcode 14.0 or higher
  - iOS Simulator
- **Android Development**:
  - Android Studio
  - Android SDK
  - Android Emulator or physical device

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd garbage-collector
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Verify installation**
   ```bash
   npx expo doctor
   ```
   This command checks for common issues with your Expo installation.

## 📱 Running the Application

### Development Server

Start the Expo development server:

```bash
npm start
```

This will open the Expo Developer Tools in your browser, where you can:
- Scan the QR code with the Expo Go app (iOS/Android)
- Press `i` to open iOS Simulator
- Press `a` to open Android Emulator
- Press `w` to open in web browser

### Platform-Specific Commands

#### iOS (macOS only)
```bash
npm run ios
```

Runs the app in the iOS Simulator. Requires Xcode to be installed.

#### Android
```bash
npm run android
```

Runs the app in the Android Emulator or connected device. Requires Android Studio and SDK setup.

#### Web
```bash
npm run web
```

Runs the app in a web browser at `http://localhost:8081`.

### Linting

Run ESLint to check for code quality issues:

```bash
npm run lint
```

## 🏗️ Building for Production

### Development Build (Recommended for testing)

```bash
# iOS
eas build --platform ios --profile development

# Android
eas build --platform android --profile development
```

### Production Build

```bash
# iOS (requires Apple Developer account)
eas build --platform ios --profile production

# Android
eas build --platform android --profile production
```

> **Note**: Production builds require setting up an [Expo Application Services (EAS)](https://expo.dev/eas) account and configuring `eas.json`.

### Web Build

Generate a static web build:

```bash
npx expo export:web
```

The built files will be in the `dist/` directory.

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `refactor:` - Code refactoring
- `docs:` - Documentation changes
- `test:` - Test additions or modifications
- `chore:` - Maintenance tasks

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- Icons from [@expo/vector-icons](https://icons.expo.fyi/)
- Powered by [React Native](https://reactnative.dev/)
- Documentation and development assistance by [Claude](https://claude.ai/) by Anthropic

---

**Made with ❤️ for cleaner communities**
