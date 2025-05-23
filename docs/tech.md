# Technologies used

## Framework 🖼️

This app uses Expo which is a framework of React Native which simplifies the DX drastically for a lot of use cases.

## Data Fetching ⬇️

The project uses `tanstack-query` library for its simplified data handling, automatic background re-fetching, and performance optimization
through built-in caching. Its powerful DevTools and flexibility in supporting various use cases enhance our development
efficiency, while an active community ensures we stay updated with the best practices.

## Navigation 🧭

A significant majority of React Native projects use the `react-navigation` navigation library. This project, however, uses
a file-based routing solution built on top of it by Expo, called `expo-router`. Expo-router comes with some additional features,
such as deploying your application on the web in 3 different ways ('static', 'single' and 'server').

The 'static' export is what allows us to deploy the app to GitHub Pages as a set of html files (hence the name "static").
This allows us to refresh the page without 404 errors unlike a "single" export (which would be the only option if we didn't use `expo-router`).
However, there is currently a problem that comes up when deploying the app to GH Pages, which was patched in the `/patches/` folder. Currently, an issue
in the Expo GitHub repo is created and assigned to a team member there.

Each page is navigated to with a `backend` param so that the chosen instance link is determined by the URL and not the internal memory state.
For example, if the user has `foo.bar` chosen in settings and gets a link to `owntube.tv/video?backend=bar.baz&id=123`, then they will watch a video from `bar.baz` that they were sent.

The video page also has params such as `id` (the video uuid) and `timestamp` (the time when we want the video to start from when the link is opened)

The settings page has only the `backend` param and uses it to show the currently selected instance, when the user select a new one they are "navigated" to the same page with a different `backend` param.

## Video playback 📼

The turnkey solution for Expo apps is expo-video. However, this library is still in beta state and is considered unsupported
on TV devices. So, the OwnTube.tv 📺 client uses an older `expo-av` library.

A PeerTube instance outputs two variants when a video is fetched - either a mp4 video file, or an HLS streaming playlist,
or both. However, not all videos have both, so we need to be able to play both variants.

HLS is a technology which is not supported natively on desktop browsers except for Safari. Thus, we need a custom solution to support Chrome and FF.
The `video.js` library includes the `hls.js` library which is used by PeerTube on the frontend in their custom peer-to-peer loader. However, this custom loader is not
necessary for the current needs of OwnTube.tv 📺.
In our case, a platform-specific component is used for the Web platform (React Native is able to determine where it is running and will supply the specific component).
Through video.js we are converting the hls stream into a stream of mp4 chunks which are readable in any browser on the fly using ffmpeg, thus enabling the hls playback.

The video controls are overlaid above the video player, this way the experience is unified regardless of the platform.
You can skip 10 seconds in each direction, seek through the video, play/pause, mute.

You can also control the player with your keyboard. See shortcuts below:

- [F]: toggle fullscreen;
- [M]: toggle mute;
- [->]: skip forward;
- [<-]: skip backward;
- [space bar]: toggle play/pause;

## Testing ⚙️

Jest is used throughout the app for testing, both for component tests and unit tests. For testing React components, the
`@testing-library/react-native` package is used, which allows us to test components as real functioning entities,
with state changes, user interactions etc. which in turn allows us to write tests similar to integration tests (e.g. user
clicks X button and sees Y result).

Data fetching is tested against a real PeerTube nightly instance, without mocking the API response.

## Internationalization 🌍

The app leverages `react-18next` library for translations, which means text strings are added to components ONLY through
the `t` function from `useTranslation` hook, or if out of React components, through importing `i18n` from `i18n.ts` and
using the `t` method on the said import.
The strings of text for each language are stored in JSON files, using the pattern `[language code].json`, to add or modify
translations for each language you need to edit these files only.
The default locale is chosen depending on your device's preferred language, or the language chosen in settings, and if your language
is unavailable then `en` is chosen as fallback (this can be configured in `i18n.js` file).

## Icons 🖼️

This app uses the IcoMoon format for using a dedicated icon set. Usage: go to [IcoMoon](https://icomoon.io/), go to "App"
section, import the `selection.json` file from `assets/` to IcoMoon selection, press `Generate Font`, download and unzip,
copy the new `selection.json` file to `assets` and `icomoon.ttf` to `assets/fonts`. Then use the `<IcoMoonIcon />` in the
app.

## Instance Configuration 🛠️

OwnTube.tv 📺 uses a configuration system that allows for customization of different PeerTube instances. This configuration is stored in the `public/featured-instances.json5` file. The JSON5 format is used, which is a superset of JSON that allows for comments and more readable syntax.

Each instance in the configuration file is represented by an object with the following key properties:

1. `name`: The display name of the PeerTube instance.
2. `description`: A brief description of the instance's content or purpose.
3. `hostname`: The domain name where the instance is hosted.
4. `logoUrl`: URL to the instance's logo image.
5. `customizations`: An object containing various customization options.

The `customizations` object allows for fine-tuning of the instance's appearance and behavior within the OwnTube.tv 📺 client. Some key customization options include:

- `pageTitle`: Overrides the default page title.
- `pageDefaultTheme`: Sets the default color theme (e.g., "dark" or "light").
- `menuHide*Button`: Toggles visibility of various menu items.
- `playlistsHidden`: An array of playlist IDs to hide from the Playlists page.
- `playlistsShowHiddenButton`: Enables a button to show all playlists, including hidden ones.
- `home*`: Various options to customize the home page, such as video counts and section visibility.
- `menuExternalLinks`: External links to include in the sidebar

To ensure the integrity and consistency of instance configurations, OwnTube.tv 📺 employs a validation mechanism using Zod, a TypeScript-first schema declaration and validation library.

The validation logic is implemented in the `instanceConfigs.test.ts` file, which performs the following steps:

1. Reads the `public/featured-instances.json5` file containing the instance configurations.
2. Parses the JSON5 content into a JavaScript object.
3. Iterates through each instance configuration in the parsed object.
4. Validates each instance against the `instanceConfigSchema` defined in `instanceConfigs.ts`.

The `instanceConfigSchema` is a Zod schema that precisely defines the structure and types of all fields in the instance configuration. This schema ensures that:

- All required fields are present
- Field types are correct (e.g., strings, numbers, booleans)
- Nested objects like `customizations` have the correct structure
- Optional fields are properly handled

If any instance fails to conform to the schema, the test will fail, providing detailed error information about which fields are invalid or missing. This approach offers several benefits:

The instance configurations are retrieved and made available to the application through the `useFeaturedInstancesData` custom hook, defined in `hooks/useFeaturedInstancesData.ts`. It works in the following steps:

1. **Asset Loading**: The hook uses Expo's `Asset` module to load the `featured-instances.json5` file as an asset. This approach ensures that the file is properly bundled with the application and can be accessed efficiently.

2. **Platform-Specific Reading**: Depending on the platform (web or native), the hook uses different methods to read the file contents:

   - For web platforms, it uses the `fetch` API to retrieve the file content.
   - For native platforms, it uses `expo-file-system`'s `readAsStringAsync` function.

3. **JSON5 Parsing**: Once the file content is retrieved, it's parsed using the `JSON5.parse` method.

4. **State Management**: The parsed instance configurations are stored in the component's state using the `useState` hook, making them reactive and easily accessible to components that use this hook.

The current instance configuration is retrieved using the `useInstanceConfig` custom hook, defined in `hooks/useInstanceConfig.ts`. This hook provides a convenient way to access the configuration of the currently active PeerTube instance. Here's how it works:

1. **Context and Params**: The hook utilizes the `useAppConfigContext` to access the `featuredInstances` data, and both `useLocalSearchParams` and `useGlobalSearchParams` from `expo-router` to get the `backend` parameter.

2. **Backend Parameter**: The `backend` parameter, which represents the hostname of the current instance, can be present in either local or global search params. This flexibility allows the instance to be specified at different levels of the application's routing (mainly for use in the Sidebar component which is not an integral part of the navigation structure and has to use the global backend param).

3. **Instance Matching**: The hook searches through the `featuredInstances` array to find an instance whose `hostname` matches either the local or global `backend` parameter.

4. **Return Value**: The hook returns an object with a `currentInstanceConfig` property, which contains the configuration of the matched instance, or `undefined` if no match is found.

This approach allows components throughout the application to easily access the current instance's configuration by accessing the app config context in `useAppConfigContext()`. The returned configuration can then be used to customize the UI, set theme preferences, or control feature visibility based on the specific instance being accessed.

By combining the `useFeaturedInstancesData` hook (which loads all instance configurations) with the `useInstanceConfig` hook (which selects the current instance), OwnTube.tv 📺 is able to customize the experience for the user based on the instance they are currently accessing.

## Error handling ❌

Errors are handled throughout the application on pages and in individual sections on pages. If there is an error loading a page that is blocking the experience, e.g. the list of playlists didn't load on the playlists page, the user is presented with a fullscreen message suggesting to retry fetching the data. However, if an individual section failed to load, e.g. a single playlist failed to load on the playlists page, the user is presented with an error message and a suggestion to re-fetch the individual section.
Going offline and back online is denoted by a toast message on top of the page which can be closed manually if offline, and disappears automatically if online. Some of the pages that require network connection are rendered as disabled when offline. However, the user can still try to visit the respective pages since links do not get disabled.
Error loading video data is presented in a fullscreen message suggesting a retry of the load.
Currently, the error handling extends to everything connected to videos, however in the future error handling should be added for info such as instance name or avatar.

## Fork customization 🍴

Refer to [customizations](customizations.md) docs for more information on how to customize your own fork of OwnTube.

## Building for TV 📺

To run the app for Android TV and TVOS, you need to first run the following commands:

`export EXPO_TV=1
npx expo prebuild --clean`

Then, run `npx expo run:ios` or `npx expo run:android`.

When done developing for TV, run `unset EXPO_TV` and `npx expo prebuild --clean` before developing for mobile again.
