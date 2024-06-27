## Folder structure 

For convenience, we will consider all folder names prefixed by `./OwnTube.tv/`

### 📁`/__mocks__/`: 

This is a utility folder where you can put mocks for modules that you are sure will be used in all tests across the app.

File structure: `/__mocks__/<moduleName>/<fileToMockName>.js`

This is quite handy for react-native projects as some native modules will never render in a test renderer (e.g. *Camera*).
Some libraries have instructions for creating such mock files.

Alternative: 1 large `jest.setup.js` file with all the mocks.

### 📁`/api/`:

The 2 base structures working with the PeerTube API are contained in `peertubeVideosApi.ts` and `queries.ts`.

`peertubeVideosApi.ts` contains the Axios instance and data fetching methods. There are predefined base query params and logic for response transformation.
However please note that the instance URL is obtained from request params to support choosing the peertube instance to fetch from.

`queries.ts` contains React hooks that wrap around the data fetching functions and handle things like loading state, refetching, cache invalidation through the use of `tanstack-query` (formerly `react-query`) library.

The tests covering these files can be found in the `/api/tests/` folder.

### 📁`/app/`:

This directory's structure is static and determined by the `expo-router` package guidelines.
More insight on why expo-router is used can be found further in the document, and more information on the file structure can be found here: https://docs.expo.dev/router/create-pages/

The route structure is as follows:

`(home)/<screen>` where `(home)` is the base path and the 2 available screens - `/settings` and `/video` are separate routes.
There is also a file for the `(home)/index` route which corresponds to the home page (`/`).

Each route has a `backend` parameter and the `/video` route additionally has `id` and `timestamp` params used for video playback.
All the routes come together in the `_layout.tsx` file which exports the app navigation.
The reasoning behind the inclusion of the `+html.tsx` file will be discussed further in the document.

### 📁`/assets/`:

Contains logos and test data jsons, only the files put in this folder will be included in the build.

### 📁`/components/`:

A base folder for React components used in the app, the `/shared/` folder contains base component like "button" or "spacer".
Some of the components that require a lot of supporting files (styles, tests etc.) are placed in a single folder,
while most consist of 1 file which contains the styles (if any) and the component code.

### 📁`/contexts/`:

This folder contains setup files for information that should be available across the whole app - one is a color context used
for theme switching and the other is the `AppConfigContext` which is used for technical information like settings or
device capability info.

### 📁`/hooks/`:

Each file in this folder contains a React hook and if available, a file with the same name with a `.test.ts` extension.

### 📁`/layouts/`:

Contains layout components, currently having only one - a `<Screen />` that wraps app screens.

### 📁`/patches/`:

Contains patches used by the `patch-package` package. Best to keep this folder temporary.

### 📁`/screens/`:

This folder contains screen components which are imported into the route files in the `/app/` folder. Mostly these screens
consist of components from the `/components/` folder.

### 📁`/theme/`:

Contains stylistic values and variables, such as colors or typography, however currently the app is mostly using the built-ins from `react-navigation` (a dependency of `expo-router`)

### 📁`/utils/`:

Here you can find various utilities used across the app, such as time formatting or working with async storage, test setup helpers etc.
