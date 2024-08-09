## Technologies used

### Framework 🖼️

This app uses Expo which is a framework of React Native which simplifies the DX drastically for a lot of use cases.

### Data Fetching ⬇️

The project uses `tanstack-query` library for its simplified data handling, automatic background refetching, and performance optimization
through built-in caching. Its powerful DevTools and flexibility in supporting various use cases enhance our development
efficiency, while an active community ensures we stay updated with the best practices.

### Navigation 🧭

A significant majority of React Native projects use the `react-navigation` navigation library. This project, however, uses
a file-based routing solution built on top of it by Expo, called `expo-router`. Expo-router comes with some additional features,
such as deploying your application on the web in 3 different ways ('static', 'single' and 'server').

The 'static' export is what allows us to deploy the app to GitHub pages as a set of html files (hence the name "static").
This allows us to refresh the page without 404 errors unlike a "single" export (which would be the only option if we didn't use `expo-router`).
However, there is currently a problem that comes up when deploying the app to GH Pages, which was patched in the `/patches/` folder. Currently, an issue
in the Expo Github repo is created and assigned to a team member there.

Each page is navigated to with a `backend` param so that the chosen instance link is determined by the URL and not the internal memory state.
For example, if the user has `foo.bar` chosen in settings and gets a link to `owntube.tv/video?backend=bar.baz&id=123`, then they will watch a video from `bar.baz` that they were sent.

The video page also has params such as `id` (the video uuid) and `timestamp` (the time when we want the video to start from when the link is opened)

The settings page has only the `backend` param and uses it to show the currently selected instance, when the user select a new one they are "navigated" to the same page with a different `backend` param.

### Video playback 📼

The turnkey solution for Expo apps is expo-video. However, this library is still in beta state and is considered unsupported
on TV devices. So, the OwnTube.tv client uses an older `expo-av` library.

A PeerTube instance outputs two variants when a video is fetched - either an mp4 video file, or an HLS streaming playlist,
or both. However, not all videos have both, so we need to be able to play both variants.

HLS is a technology which is not supported natively on desktop browsers except for Safari. Thus, we need a custom solution to support Chrome and FF.
The `video.js` library includes the `hls.js` library which is used by PeerTube on the frontend in their custom peer-to-peer loader. However this custom loader is not
necessary for the current needs of OwnTube.tv.
In our case, a platform-specific component is used for the Web platform (React Native is able to determine where it is running and will supply the specific component).
Through video.js we are converting the hls stream into a stream of mp4 chunks which are readable in any browser on the fly using ffmpeg, thus enabling the hls playback.

The video controls are overlaid above the video player, this way the experience is unified regardless of the platform.
You can skip 10 seconds in each direction, seek through the video, play/pause, mute.

You can also control the player with your keyboard. See shortcuts below:

- [F]: toggle fullscreen;
- [M]: toggle mute;
- [->]: skip forward;
- [<-]: skip backward;
- [spacebar]: toggle play/pause;

### Testing ⚙️

Jest is used throughout the app for testing, both for component tests and unit tests. For testing React components, the
`@testing-library/react-native` package is used, which allows us to test components as real functioning entities,
with state changes, user interactions etc. which in turn allows us to write tests similar to integration tests (e.g. user
clicks X button and sees Y result).

Data fetching is tested against a real peertube nightly instance, without mocking the API response.

### Internationalization 🌍

The app leverages `react-18next` library for translations, which means text strings are added to components ONLY through
the `t` function from `useTranslation` hook, or if out of React components, through importing `i18n` from `i18n.ts` and
using the `t` method on the said import.
The strings of text for each language are stored in JSON files, using the pattern `[language code].json`, to add or modify
translations for each language you need to edit these files only.
The default locale is chosen depending on your device's preferred language, or the language chosen in settings, and if your language
is unavailable then `en` is chosen as fallback (this can be configured in `i18n.js` file).

### Icons

This app uses the IcoMoon format for using a dedicated icon set. Usage: go to [IcoMoon](https://icomoon.io/), go to "App"
section, import the `selection.json` file from `assets/` to IcoMoon selection, press `Generate Font`, download and unzip,
copy the new `selection.json` file to `assets` and `icomoon.ttf` to `assets/fonts`. Then use the `<IcoMoonIcon />` in the
app.
