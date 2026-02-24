# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OwnTube.tv is a simple and portable video client for the PeerTube video streaming platform, built with React Native/Expo and supporting web, iOS, Android, tvOS, and Android TV. The codebase is located in the `OwnTube.tv/` directory within this repository.

**Tagline:** "Your own tube, for Your own content" — emphasizing user autonomy and content ownership.

**Key Philosophy:** This project aims to democratize video distribution by leveraging PeerTube's decentralized infrastructure. Rather than building a centralized YouTube-like app with many users, OwnTube enables many branded apps (one per content distributor) with relatively few users per application. The result is: "Your videos, your user experience, on your apps!" Each organization maintains their own app store presence, review processes, and content responsibility.

**Repository Structure:**

- **This repo (web-client):** Canonical development and testing environment, continuously auto-deployed with vanilla branding
- **Branded fork** ([mykhailodanilenko/web-client](https://github.com/mykhailodanilenko/web-client) - "Misha Tube"): Development fork that uses external customizations mechanism (`CLIENT_CUSTOMIZATIONS_REPO` + `CLIENT_CUSTOMIZATIONS_FILE`) to verify customizations work correctly with swift CI/CD before production branded apps adopt them
- **Template repo** ([cust-app-template](https://github.com/OwnTube-tv/cust-app-template)): GitHub template for creating new branded apps with pre-configured CI/CD workflows and `.customizations` file
- **Branded app repos** (e.g., [cust-app-blender](https://github.com/OwnTube-tv/cust-app-blender), [cust-app-xrtube](https://github.com/OwnTube-tv/cust-app-xrtube), [cust-app-basspistol](https://github.com/OwnTube-tv/cust-app-basspistol)): Production delivery mechanism that pulls code + CI/CD from this repo, applies branding via `.customizations` file, and deploys to their own GitHub Pages, TestFlight, and Google Play with manual push-button releases

## Build/Test/Lint Commands

All commands should be run from the `OwnTube.tv/` directory unless otherwise noted.

- Build (web webpack): `npm run build`
- Test all: `npm test`
- Test single file: `npm test -- path/to/file.test.tsx`
- Start development: `npm start`
- Web development: `npm run web`
- Mobile development: `npm run ios` or `npm run android`
- TV development (iOS): `export EXPO_TV=1 && npx expo prebuild --clean && npx expo run:ios`
- TV development (Android): `export EXPO_TV=1 && npx expo prebuild --clean && npx expo run:android`
  - After TV development: `unset EXPO_TV && npx expo prebuild --clean` before returning to mobile
- Lint: `npx eslint .`
- Format check: `npx prettier --check ./`
- Format write: `npx prettier --write ./`
- Apply patches: `npm run postinstall` (runs patch-package)

## Architecture

### Core Technologies

- **Framework:** Expo (React Native) with file-based routing via expo-router
- **State Management:** TanStack Query (React Query) for server state, React Context for global state (ColorScheme, AppConfig, FullScreenModal), Zustand for some local state
- **Data Fetching:** Axios with custom error handling, wrapped in React Query hooks
- **Navigation:** expo-router (file-based routing built on react-navigation)
- **Testing:** Jest with React Testing Library, tests run against real PeerTube nightly instance
- **i18n:** react-i18next with locale files in `locales/`
- **Validation:** Zod for runtime type checking and instance config validation
- **TV Support:** react-native-tvos fork instead of standard React Native

### Project Structure

- `api/`: API layer with queries (React Query hooks), axios instance setup, and error handling
  - `queries/`: React Query hooks organized by feature (categories.ts, videos.ts, etc.)
  - `axiosInstance.ts`: Base API class with axios configuration
  - `errorHandler.ts`: Universal error handler with toast notifications
  - `helpers.ts`: Contains `getLocalData()` for test data and `retry()` logic
- `app/`: expo-router file-based routing structure
  - Route structure: `(home)/<screen>` with `backend` parameter on all routes
  - `_layout.tsx`: Main app navigation and providers
  - `+html.tsx`: Required for static export to GitHub Pages
- `components/`: React components (shared components in `shared/` subfolder)
- `contexts/`: React Context providers (ColorScheme, AppConfig, FullScreenModal)
- `hooks/`: Custom React hooks with co-located tests
- `screens/`: Screen components imported by routes in `app/`
- `utils/`: Utility functions (time formatting, async storage, etc.)
- `locales/`: Translation files in `[language-code].json` format
- `theme/`: Design tokens (colors, typography)
- `__mocks__/`: Shared mocks for Jest tests
- `public/featured-instances.json5`: Instance configuration file
- `instanceConfigs.ts`: Zod schema for instance config validation
- `i18n.ts`: i18next setup and configuration
- `metro.config.js`: Metro bundler config with TV-specific source extensions
- `app.config.ts`: Expo configuration with environment variable support

### Key Architectural Patterns

**Backend Parameter Pattern:** All routes include a `backend` URL parameter representing the PeerTube instance hostname. This allows users to be directed to specific instances via deep links (e.g., `/video?backend=bar.baz&id=123`) regardless of their current instance selection.

**Instance Configuration System:** Multi-instance support with feature toggles and white-labeling via `public/featured-instances.json5`. Each instance config specifies hostname, branding, and customizations. Accessed via `useInstanceConfig()` hook which reads from `AppConfigContext`. Validated at test-time using Zod schema.

For branded apps, the multi-instance architecture remains functional under the hood but is hidden from users through:

1. `EXPO_PUBLIC_PRIMARY_BACKEND` env var sets the default/primary instance
2. `customizations.menuHideLeaveButton: true` in featured-instances.json5 hides the instance switcher UI
3. Deep links with different `backend` parameters still work (useful for testing and edge cases)

This approach satisfies Apple/Google content review requirements (single-instance experience) while maintaining technical flexibility.

**Platform-Specific Components:** Use platform extensions (`.tv.tsx`, `.web.tsx`, `.ios.tsx`, `.android.tsx`) for platform-specific implementations. Metro bundler automatically resolves the correct file. TV builds controlled by `EXPO_TV` environment variable.

**Video Playback:** Platform-specific video players—native player for mobile/TV using expo-av, video.js with HLS support for web (required because Chrome/Firefox don't natively support HLS). Custom overlay controls for unified experience.

**Error Handling:** Multi-level error handling with fullscreen messages for blocking errors (e.g., playlist page failed to load) and inline errors for section failures (e.g., single playlist failed). Toast messages for network status changes.

**Data Fetching:** All API calls wrapped in React Query hooks with automatic background refetching, caching, and retry logic. Error handling via `errorHandler.ts` shows toast messages. APIs throw `OwnTubeError` with status code and message.

**Customization Pipeline:** Branded apps use GitHub environment variables in the `owntube` environment to configure branding. Variables with `EXPO_PUBLIC_*` prefix are loaded at build time from an external git repo specified by `CLIENT_CUSTOMIZATIONS_REPO` and `CLIENT_CUSTOMIZATIONS_FILE`. The main web-client repo uses vanilla OwnTube.tv branding without external customizations. See docs/customizations.md for complete details on available customization options.

## Code Style Guidelines

- **Formatting:** All code must pass Prettier checks. Run `npx prettier --write ./` before submitting PRs.
- **TypeScript:** Use proper types; avoid `any`. Use `_` prefix for unused parameters. Project uses strict mode.
- **Components:** Organize in folders with index.ts export. Use platform-specific extensions (.tv.tsx, .web.tsx, .ios.tsx) when needed.
- **State Management:** Use React Query for API data. Context for global state (ColorScheme, AppConfig, FullScreenModal).
- **Error Handling:** Use API error handler for API requests. Show appropriate error messages with retry options.
- **Imports:** Group in order: React/libraries, project modules, types.
- **Testing:** Test components with React Testing Library. Mock external dependencies. Use `__mocks__` directory for shared mocks. Tests run against real PeerTube nightly instance without mocking API responses.
- **Naming:** PascalCase for components, camelCase for functions/variables. Descriptive names.
- **i18n:** Always use the `t` function from `useTranslation` for text strings. Never hard-code user-facing text.
- **Customization:** Use the instance config system for feature toggles and white-labeling via `public/featured-instances.json5`.
- **Platform Support:** Test changes across all platforms: Web (desktop/mobile), iOS, Android, tvOS, Android TV.
- **Commit Messages:** NEVER mention AI agents, Claude, or AI assistance in commit messages. Write commits as if they were written by a human developer.
- **PR Guidelines:** Squash changes into descriptive commits. Reference GitHub issues. Sign your commits. Code must pass ESLint and Prettier checks. Request reviews from @mykhailodanilenko, @ar9708, and @mblomdahl.

## Branded App Architecture

The OwnTube project uses a distributed architecture with three distinct branding approaches:

### 1. Main Repository (this repo)

Serves as the canonical development environment:

- Continuous auto-deployment to GitHub Pages (web) and app stores (mobile/TV)
- Uses vanilla OwnTube.tv branding (no customizations)
- All feature development and testing happens here
- Main branch should always be production-ready

### 2. Branded Fork (Development/Testing)

Repository: [mykhailodanilenko/web-client](https://github.com/mykhailodanilenko/web-client) ("Misha Tube")

**Purpose:** Testing vehicle to verify external customizations mechanism works correctly before production branded apps adopt updates.

**How it works:**

- Fork of main repo maintaining same CI/CD workflows (continuous auto-deploy)
- Uses environment variables in `owntube` GitHub environment:
  - `CLIENT_CUSTOMIZATIONS_REPO`: Points to external git repo with customizations
  - `CLIENT_CUSTOMIZATIONS_FILE`: Specifies which config file to use
- Pulls customizations from [OwnTube-tv/client-customizations](https://github.com/OwnTube-tv/client-customizations)
- Deployments: [Google Play](https://play.google.com/store/apps/details?id=com.mishadanilenko.mishatube), [TestFlight](https://testflight.apple.com/join/PaM9r7AF), [Web](https://cust-app-mishatube.owntube.tv)

**Why this approach:** Maintains swift development velocity while testing that customizations work as intended. Catches issues before they affect production branded apps that deploy manually on their own schedules.

### 3. Template Repository

Repository: [OwnTube-tv/cust-app-template](https://github.com/OwnTube-tv/cust-app-template)

**Purpose:** GitHub template for creating new production branded apps.

**Contains:**

- Pre-configured CI/CD workflows (pulled from main repo)
- `.customizations` file template with all available options
- Assets folder structure for custom branding files
- Use GitHub's "Use this template" button to create new branded app repos

### 4. Branded App Repositories (Production)

Examples: `cust-app-blender`, `cust-app-xrtube`, `cust-app-basspistol`, `cust-app-pitube`

**Purpose:** Production delivery for content distributors with their own branding.

**How they work:**

- Created from cust-app-template repository
- Pull code and CI/CD workflows from main web-client repo
- Apply organization-specific branding via `.customizations` file in repo root
- Manual workflow_dispatch deployment model (push-button releases)
- Deploy **after** mainline updates, on their own schedule
- Each maintains their own:
  - GitHub Pages deployment with optional custom domain
  - TestFlight and Google Play accounts
  - App review processes
  - Content responsibility and legal entity

### Customization Mechanisms Compared

**External Config (Branded Fork method):**

- Uses `CLIENT_CUSTOMIZATIONS_REPO` + `CLIENT_CUSTOMIZATIONS_FILE` environment variables
- Customizations stored in separate git repository
- Enables swift CI/CD testing of customization mechanism
- Example: Misha Tube (mykhailodanilenko/web-client)

**Inline Config (Branded App method):**

- Uses `.customizations` file in repo root
- All branding contained within branded app repo
- Manual deployment workflow for production control
- Examples: Blender Tube, XR Tube, Privacy Tube, Basspistol

**Both methods support:**

- Environment variables with `EXPO_PUBLIC_*` prefix configure:
  - App name, slug, and bundle identifiers
  - Icons, splash screens, and branding assets (512x512 icon, 1152x1152 splash, TV-specific sizes)
  - Legal entity information (for privacy policy)
  - Primary backend instance (`EXPO_PUBLIC_PRIMARY_BACKEND`)
  - PostHog diagnostics configuration
  - Feature toggles (hide video site links, hide git details, etc.)
- Assets stored in `/assets` folder (or external repo), referenced with appropriate paths

### Single-Instance UX (for branded apps)

- `EXPO_PUBLIC_PRIMARY_BACKEND` sets the default instance
- `customizations.menuHideLeaveButton: true` in featured-instances.json5 hides instance switcher in UI
- Multi-instance architecture remains functional for deep links (note: can be bypassed via URL parameters)
- Satisfies Apple/Google content review requirements

### Getting Started

- **For production branded apps:** Use the [cust-app-template](https://github.com/OwnTube-tv/cust-app-template) repository
- **For development/testing:** Fork main repo and configure external customizations
- Consult docs/customizations.md and docs/pipeline.md for detailed setup instructions

## CI/CD & Deployment

### Main Repository (web-client)

- **Trigger:** Automatic on push to `main` branch, or manual via workflow_dispatch
- **Deployment Strategy:** Continuous deployment (every commit to main is production-ready)
- **Platforms Built:**
  - Web: Static export to GitHub Pages
  - iOS & tvOS: Simulator builds + optional TestFlight upload
  - Android & Android TV: APK builds + optional Google Play upload
- **Build Info:** Injects `build-info.json` with GitHub actor, commit SHA, timestamp, and web URL

### Branded App Repositories

- **Trigger:** Manual workflow_dispatch only (push-button releases)
- **Deployment Strategy:** Controlled releases by content distributors
- **Customizations:** Pulled from external git repo during build
- **Infrastructure:** Each branded app has separate:
  - GitHub Pages environment with optional custom domain
  - App Store Connect and Google Play accounts
  - Certificate/signing keys in GitHub Secrets

### macOS Runner & Xcode Version

iOS/tvOS build workflows pin both the macOS runner image and Xcode version to ensure compatibility with Expo SDK 52 / React Native 0.76:

- **Xcode:** Pinned to `16.4` via `maxim-lobanov/setup-xcode@v1`. Do NOT use `latest-stable` — the `macos-15` runner now ships both Xcode 16.x and Xcode 26.3 RC, and `latest-stable` resolves to 26.x which is incompatible with React Native 0.76. Apple skipped versions 17–25 (jumped from 16 to 26).
- **Runner:** `macos-15` (default in reusable workflow inputs). Do NOT use `macos-latest` — it resolves to macOS 26.
- **Override:** The main repo can override the runner via `PREFERRED_MACOS_RUNNER` variable in the `owntube` environment. Downstream branded app repos use the default from the reusable workflow inputs.

When upgrading Expo SDK or React Native, re-evaluate whether newer Xcode/runner versions are compatible and update the pins accordingly.

### Environments

1. **`owntube` environment:** Stores sensitive secrets for app builds

   - Apple API keys, certificates, provisioning profiles
   - Android keystore and signing credentials
   - Google Play service account JSON
   - `CLIENT_CUSTOMIZATIONS_REPO` and `CLIENT_CUSTOMIZATIONS_FILE` (for branded apps)
   - PostHog API keys (if using custom analytics)

2. **`github-pages` environment:** Stores deployment configuration
   - `CUSTOM_DEPLOYMENT_URL` (optional, for custom domains)
   - Deep linking configuration (Android fingerprint, package names, Apple bundle ID)

### Deep Linking Setup (Optional)

For custom domain deployments, configure in `github-pages` environment:

- `CUSTOM_DEPLOYMENT_URL`: Your custom domain
- `ANDROID_FINGERPRINT`: SHA256 fingerprint from Google Play Console
- `ANDROID_PACKAGE`: Android package name
- `APPLE_BUNDLE_ID`: iOS bundle identifier
- `APPLE_DEVELOPMENT_TEAM`: Team ID from App Store Connect

**Reference:** See docs/pipeline.md for detailed CI/CD setup instructions.

## Diagnostics & Privacy

OwnTube uses PostHog for product diagnostics with an opt-out default (suitable for general audiences).

**Configuration:**

- `EXPO_PUBLIC_POSTHOG_API_KEY`: PostHog project key
  - Main repo: Uses OwnTube.tv PostHog project
  - Branded apps: Can specify their own key or set to `null` to disable
- `EXPO_PUBLIC_POSTHOG_HOST`: PostHog instance URL
  - US: `https://app.posthog.com` (default)
  - EU: `https://eu.posthog.com`
  - Self-hosted: Your own PostHog instance URL

**User Control:**

- Users can opt out via "Opt-out of diagnostics" checkbox in Settings
- If opted out, no diagnostics data is sent
- If `EXPO_PUBLIC_POSTHOG_API_KEY` is `null`, diagnostics are disabled for all users

**Events Captured:**

- Backend server changes (instance switching)
- Rate limit errors and HTTP request failures
- Product usage patterns for improvement

**Reference:** See docs/diagnostics.md for complete details.

## Patches & Workarounds

The `patches/` directory contains temporary fixes for upstream library issues. These patches are applied automatically by `patch-package` during `npm install`.

### Current Patches

1. **`@react-native-tvos/config-tv+0.1.1.patch`**

   - **Issue:** Plugin overwrites Android TV launcher icons even when `.webp` versions exist
   - **Fix:** Adds existence check before copying `.png` icons (prevents overwriting `.webp` files)
   - **Status:** Temporary workaround for upstream bug

2. **`@react-native-async-storage/async-storage+1.23.1.patch`**
   - **Issue:** Library assumes `window` object always exists, causing SSR/build errors
   - **Fix:** Adds `typeof window !== "undefined"` guards to all localStorage operations
   - **Status:** Temporary workaround for web platform compatibility

### Maintenance

- **When upgrading dependencies:** Check if patches still apply cleanly
- **Test if patches are still needed:** Try removing patch file and running tests
- **Monitor upstream:** Check if issues have been fixed in newer versions
- **Document new patches:** Add entry here when creating new patches with `npx patch-package`

**Note:** Patches are intentionally temporary. If a patch exists for >6 months, consider:

- Contributing fix upstream
- Finding alternative library
- Accepting the issue as permanent (document why)

## Technical Notes

### Core Technologies

- Project uses **react-native-tvos (0.76.9-0)** fork instead of standard React Native for TV support
- **Metro bundler** extends asset extensions (json, json5, ttf, otf) and prioritizes `.tv.*` extensions when `EXPO_TV=1`
- **Zod** is used for validation of instance configurations (`instanceConfigs.ts`) and other runtime type checks
- **Icons** use IcoMoon format with custom font (assets/fonts/icomoon.ttf and selection.json)

### Environment Variables

- Variables with `EXPO_PUBLIC_*` prefix are accessible in app.config.ts and throughout the app via `process.env`
- Loaded at build time (not runtime), so changes require rebuild
- Main repo uses defaults defined in app.config.ts
- Branded apps override via external customizations file

### TV Development

- Set `EXPO_TV=1` environment variable before running `npx expo prebuild --clean`
- After TV development, **must clean up:** `unset EXPO_TV && npx expo prebuild --clean` before mobile development
- Failing to clean up causes build errors on non-TV platforms
- TV builds use platform-specific files (`.tv.tsx` extensions)

### Build System

- **Build numbers:** Generated from UTC timestamp in app.config.ts
  - Format: `YYMMDDHHmm` (iOS keeps full, Android truncates last digit)
  - TV builds offset by 20 minutes for Android to avoid conflicts
- **Build info injection:** CI/CD injects `build-info.json` with GitHub actor, commit SHA, timestamp, and web URL
  - Displayed in app settings (unless `EXPO_PUBLIC_HIDE_GIT_DETAILS` is set)
- **Static web export:** Uses expo-router's static export feature for GitHub Pages deployment
  - Requires special handling for routing (see `+html.tsx` in app directory)
  - Avoids 404 errors on page refresh unlike single-page export

### Expo Plugins

Custom Expo config plugins in `plugins/` directory:

- **withReleaseSigningConfig.js:** Injects Android release signing configuration from environment variables
- **fixAndroidChromecastLib.js:** Fixes Chromecast library compatibility (enables Jetifier, increases heap size)
- **withAndroidNotificationControls.js:** Adds foreground service permissions for media playback controls

### Video Playback

- **Mobile/TV:** expo-av (native player) - older but TV-supported
- **Web:** video.js with HLS.js - required because Chrome/Firefox don't natively support HLS
- **Keyboard shortcuts:** F (fullscreen), M (mute), arrows (skip 10s), space (play/pause)
- **Casting:** Google Cast SDK integration for Chromecast support

### Deep Linking

- All routes accept `backend` parameter (PeerTube instance hostname)
- Additional parameters vary by route (e.g., video ID, timestamp, playlist ID)
- Custom domains require configuration in GitHub Pages environment
- Associated domains configured in app.config.ts for iOS/Android

### Testing

- Tests run against **real PeerTube nightly instance** without mocking API responses
- Ensures compatibility with actual PeerTube behavior
- Shared mocks in `__mocks__/` for native modules that can't render in test environment

## Project & Community

### Organization

- **GitHub Organization:** [OwnTube-tv](https://github.com/OwnTube-tv)
- **Project Website:** [www.owntube.tv](https://www.owntube.tv)
- **Company:** OwnTube Nordic AB (Swedish org. number: 559517-7196)
  - Location: Stockholm, Sweden
  - Website: [www.owntube.se](https://www.owntube.se)
  - Contact: hello@owntube.se / +46 730 567 567
- **Project Contact:** hello@owntube.tv
- **Year Founded:** 2024

### Contributing

- **Process:** Use the Forking workflow (see README.md for details)
- **PR Requirements:** Squash commits, sign commits, reference issues, pass linters
- **Reviewers:** Request reviews from @mykhailodanilenko, @ar9708, and @mblomdahl
- **Getting Involved:** Contact @ar9708 for contribution opportunities

### Other Repositories

The OwnTube-tv organization maintains 15+ repositories including:

- **web-client** (this repo): Main client codebase (React Native/Expo)
- **cust-app-template**: Template for creating branded apps
- **Branded apps**: cust-app-blender, cust-app-xrtube, cust-app-privacytube, cust-app-basspistol
- **Infrastructure**: peertube-runner (containerized transcoding for Kubernetes)
- **Marketing websites**:
  - [www.owntube.tv](https://github.com/OwnTube-tv/www.owntube.tv): Official project website (React/Vite/TypeScript with Tailwind CSS)
  - [www.owntube.se](https://github.com/OwnTube-tv/www.owntube.se): OwnTube Nordic AB corporate information page (simple Markdown-to-HTML)
  - Both deployed via GitHub Pages

### Example Branded Apps

Production examples of apps built with OwnTube:

- **Blender Tube:** Videos presenting the evolutions of the 3D creation software, tutorials and animated films supported by the Blender Foundation

  - PeerTube instance: [video.blender.org](https://video.blender.org)
  - Repository: [cust-app-blender](https://github.com/OwnTube-tv/cust-app-blender)
  - Web app: [cust-app-blender.owntube.tv](https://cust-app-blender.owntube.tv)

- **XR Tube:** The PeerTube platform of Extinction Rebellion

  - PeerTube instance: [tube.rebellion.global](https://tube.rebellion.global)
  - Repository: [cust-app-xrtube](https://github.com/OwnTube-tv/cust-app-xrtube)
  - Web app: [cust-app-xrtube.owntube.tv](https://cust-app-xrtube.owntube.tv)

- **Privacy Tube:** Videos presenting excessive state and corporate surveillance issues and advice on how to increase security and freedom through better privacy

  - PeerTube instance: [media.privacyinternational.org](https://media.privacyinternational.org)
  - Repository: [cust-app-pitube](https://github.com/OwnTube-tv/cust-app-pitube)
  - Web app: [cust-app-pitube.owntube.tv](https://cust-app-pitube.owntube.tv)

- **Basspistol:** Video platform for the Underground Artists sharing their music under free license

  - PeerTube instance: [v.basspistol.org](https://v.basspistol.org)
  - Repository: [cust-app-basspistol](https://github.com/OwnTube-tv/cust-app-basspistol)
  - Web app: [cust-app-basspistol.owntube.tv](https://cust-app-basspistol.owntube.tv)

- **Misha Tube:** Development/testing branded fork (not a production app)
  - Repository: [mykhailodanilenko/web-client](https://github.com/mykhailodanilenko/web-client) (fork with external customizations)
  - Customizations: [OwnTube-tv/client-customizations](https://github.com/OwnTube-tv/client-customizations)
  - Android: [Google Play](https://play.google.com/store/apps/details?id=com.mishadanilenko.mishatube)
  - iOS: [TestFlight](https://testflight.apple.com/join/PaM9r7AF)
  - Web: [cust-app-mishatube.owntube.tv](https://cust-app-mishatube.owntube.tv)
  - **Purpose:** Verifies customization mechanism works before production branded apps adopt updates

For more branded app examples, visit [owntube.tv](https://www.owntube.tv).
