# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Test/Lint Commands

- Build: `npm run build`
- Test all: `npm test`
- Test single file: `npm test -- path/to/file.test.tsx`
- Start app: `npm start`
- Web: `npm run web`
- Mobile: `npm run ios` or `npm run android`
- TV: `export EXPO_TV=1 && npx expo prebuild --clean && npx expo run:ios/android`
- Lint: `npx eslint .` (from OwnTube.tv directory)
- Format check: `npx prettier --check ./` (from OwnTube.tv directory)
- Apply patches: `npm run postinstall` (runs patch-package)

## Code Style Guidelines

- **Formatting:** All code must pass Prettier checks. Run `npx prettier --write ./` before submitting PRs.
- **TypeScript:** Use proper types; avoid `any`. Use `_` prefix for unused parameters. Project uses strict mode.
- **Components:** Organize in folders with index.ts export. Use platform-specific extensions (.tv.tsx, .web.tsx, .ios.tsx) when needed.
- **State Management:** Use React Query for API data. Context for global state.
- **Error Handling:** Use API error handler for API requests. Show appropriate error messages with retry options.
- **Imports:** Group in order: React/libraries, project modules, types.
- **Testing:** Test components with React Testing Library. Mock external dependencies. Use `__mocks__` directory for shared mocks.
- **Naming:** PascalCase for components, camelCase for functions/variables. Descriptive names.
- **i18n:** Always use the `t` function from `useTranslation` for text strings.
- **Customization:** Use the instance config system for feature toggles and white-labeling.
- **Platform Support:** Test changes across all platforms: Web (desktop/mobile), iOS, Android, tvOS, Android TV.
- **PR Guidelines:** Squash changes into descriptive commits. Reference GitHub issues. Sign your commits. Code must pass ESLint and Prettier checks.

## Technical Notes

- Project uses react-native-tvos (0.76.9-0) instead of standard React Native
- Configure dynamic values via environment variables with EXPO*PUBLIC*\* prefix in app.config.ts
- Use Zod for validation of instance configurations and other runtime type checks
- Metro config extends asset extensions (json, json5, ttf, otf) and has TV-specific configuration
- Platform-specific builds use the EXPO_TV environment variable to control behavior
