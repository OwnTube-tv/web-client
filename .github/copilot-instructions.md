# GitHub Copilot Instructions

This file provides guidance to GitHub Copilot when working with code in this repository.

## Project Overview

OwnTube.tv is a portable video client for the PeerTube video streaming platform, built with React Native/Expo and supporting web, iOS, Android, tvOS, and Android TV. The codebase is located in the `OwnTube.tv/` directory within this repository.

**Key Philosophy:** This project democratizes video distribution by leveraging PeerTube's decentralized infrastructure. OwnTube enables many branded apps (one per content distributor) with relatively few users per application: "Your videos, your user experience, on your apps!"

## Build/Test/Lint Commands

All commands should be run from the `OwnTube.tv/` directory unless otherwise noted.

### Essential Commands

- **Build (web):** `npm run build`
- **Test all:** `npm test`
- **Test single file:** `npm test -- path/to/file.test.tsx`
- **Lint:** `npx eslint .`
- **Format check:** `npx prettier --check ./`
- **Format write:** `npx prettier --write ./`

### Development Commands

- **Start development:** `npm start`
- **Web development:** `npm run web`
- **Mobile development:** `npm run ios` or `npm run android`
- **TV development (iOS):** `export EXPO_TV=1 && npx expo prebuild --clean && npx expo run:ios`
- **TV development (Android):** `export EXPO_TV=1 && npx expo prebuild --clean && npx expo run:android`
  - **Important:** After TV development, run `unset EXPO_TV && npx expo prebuild --clean` before returning to mobile development

## Core Technologies

- **Framework:** Expo (React Native) with file-based routing via expo-router
- **State Management:** TanStack Query (React Query) for server state, React Context for global state (ColorScheme, AppConfig, FullScreenModal), Zustand for some local state
- **Data Fetching:** Axios with custom error handling, wrapped in React Query hooks
- **Navigation:** expo-router (file-based routing built on react-navigation)
- **Testing:** Jest with React Testing Library, tests run against real PeerTube nightly instance
- **i18n:** react-i18next with locale files in `locales/`
- **Validation:** Zod for runtime type checking and instance config validation
- **TV Support:** react-native-tvos fork instead of standard React Native

## Project Structure

- `api/`: API layer with queries (React Query hooks), axios instance setup, and error handling
  - `queries/`: React Query hooks organized by feature (categories.ts, videos.ts, etc.)
  - `axiosInstance.ts`: Base API class with axios configuration
  - `errorHandler.ts`: Universal error handler with toast notifications
- `app/`: expo-router file-based routing structure
  - Route structure: `(home)/<screen>` with `backend` parameter on all routes
  - `_layout.tsx`: Main app navigation and providers
- `components/`: React components (shared components in `shared/` subfolder)
- `contexts/`: React Context providers (ColorScheme, AppConfig, FullScreenModal)
- `hooks/`: Custom React hooks with co-located tests
- `screens/`: Screen components imported by routes in `app/`
- `utils/`: Utility functions (time formatting, async storage, etc.)
- `locales/`: Translation files in `[language-code].json` format
- `theme/`: Design tokens (colors, typography)
- `__mocks__/`: Shared mocks for Jest tests
- `public/featured-instances.json5`: Instance configuration file
- `patches/`: Temporary fixes for upstream library issues (applied by patch-package)

## Code Style Guidelines

### TypeScript

- Use proper types; avoid `any`
- Use `_` prefix for unused parameters
- Project uses strict mode

### Component Organization

- Organize components in folders with index.ts export
- Use platform-specific extensions when needed:
  - `.tv.tsx` for TV platforms
  - `.web.tsx` for web
  - `.ios.tsx` for iOS
  - `.android.tsx` for Android

### State Management

- Use React Query for API data
- Use Context for global state (ColorScheme, AppConfig, FullScreenModal)
- Use Zustand for local state when appropriate

### Error Handling

- Use API error handler for API requests
- Show appropriate error messages with retry options
- Multi-level error handling: fullscreen for blocking errors, inline for section failures

### Import Organization

Group imports in this order:

1. React/libraries
2. Project modules
3. Types

### Naming Conventions

- **PascalCase** for components
- **camelCase** for functions and variables
- Use descriptive names

### Internationalization (i18n)

- Always use the `t` function from `useTranslation` for text strings
- Never hard-code user-facing text
- Translation files are in `locales/` directory

### Testing

- Test components with React Testing Library
- Mock external dependencies using `__mocks__` directory for shared mocks
- Tests run against real PeerTube nightly instance without mocking API responses
- Ensure compatibility with actual PeerTube behavior

### Formatting

- All code must pass Prettier checks
- Run `npx prettier --write ./` before submitting PRs
- Code must also pass ESLint checks

### Platform Support

- Test changes across all platforms: Web (desktop/mobile), iOS, Android, tvOS, Android TV
- Use platform-specific files (`.tv.tsx`, `.web.tsx`, etc.) when needed
- TV builds controlled by `EXPO_TV` environment variable

### Customization

- Use the instance config system for feature toggles and white-labeling via `public/featured-instances.json5`
- Environment variables with `EXPO_PUBLIC_*` prefix are accessible throughout the app
- Variables are loaded at build time (not runtime), so changes require rebuild

## Key Architectural Patterns

### Backend Parameter Pattern

All routes include a `backend` URL parameter representing the PeerTube instance hostname. This allows users to be directed to specific instances via deep links regardless of their current instance selection.

### Instance Configuration System

Multi-instance support with feature toggles and white-labeling via `public/featured-instances.json5`. Each instance config specifies hostname, branding, and customizations. Accessed via `useInstanceConfig()` hook which reads from `AppConfigContext`. Validated at test-time using Zod schema.

### Platform-Specific Components

Use platform extensions (`.tv.tsx`, `.web.tsx`, `.ios.tsx`, `.android.tsx`) for platform-specific implementations. Metro bundler automatically resolves the correct file.

### Video Playback

- **Mobile/TV:** expo-av (native player)
- **Web:** video.js with HLS support (required because Chrome/Firefox don't natively support HLS)

## Commit Guidelines

- Squash changes into descriptive commits
- Reference GitHub issues
- Sign your commits (required by automated PR checks)
- **Important:** Never mention AI agents, Claude, Copilot, or AI assistance in commit messages
- Write commits as if they were written by a human developer

## PR Requirements

1. Squash changes into clear and thoroughly descriptive commits
2. Reference the GitHub issue in commit title or body
3. Sign commits (required by automated GitHub PR checks)
4. Ensure code passes ESLint: `npx eslint .`
5. Ensure code passes Prettier: `npx prettier --check ./`
6. Include links and illustrations in PR to make it easy to review
7. Request reviews from @mykhailodanilenko, @ar9708, and @mblomdahl

## Security Practices

- Never hardcode secrets or passwords in the code
- Use environment variables for sensitive configuration
- Environment variables with `EXPO_PUBLIC_*` prefix are exposed to the client
- Keep API keys and tokens in GitHub Secrets for CI/CD

## Common Patterns

### API Calls

- All API calls wrapped in React Query hooks
- Automatic background refetching, caching, and retry logic
- Error handling via `errorHandler.ts` shows toast messages
- APIs throw `OwnTubeError` with status code and message

### Data Fetching

- Use React Query hooks from `api/queries/` directory
- Follow existing patterns for new API endpoints
- Include proper TypeScript types from `@peertube/peertube-types`

### Routing

- All routes in `app/` directory using expo-router
- Include `backend` parameter for instance routing
- Use typed route parameters

## Build System Notes

- Build numbers generated from UTC timestamp in app.config.ts
- Build info injection: CI/CD injects `build-info.json` with GitHub actor, commit SHA, timestamp
- Static web export uses expo-router's static export feature for GitHub Pages

## Patches & Dependencies

- The `patches/` directory contains temporary fixes for upstream library issues
- Patches are applied automatically by `patch-package` during `npm install`
- When upgrading dependencies, check if patches still apply cleanly
- Document new patches when creating them with `npx patch-package`

## Debugging Tips

- Use React Query DevTools for debugging API calls
- Check browser console or React Native debugger for errors
- Tests run against real PeerTube instance (https://peertube.nightly.re)
- For TV development issues, ensure `EXPO_TV` environment variable is set correctly

## Additional Resources

- **Architecture documentation:** See `docs/` directory for detailed information
- **Customizations:** See `docs/customizations.md` for branding and configuration options
- **CI/CD Pipeline:** See `docs/pipeline.md` for deployment details
- **Main README:** See `README.md` in repository root for contribution guidelines
