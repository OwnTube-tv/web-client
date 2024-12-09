# React Native project folder structure

For convenience, we will consider all folder names prefixed by `./OwnTube.tv/` unless another root path is indicated.

## 📁 `./OwnTube.tv/__mocks__/`

This is a utility folder where you can put mocks for modules that you are sure will be used in all tests across the app.

File structure: `./OwnTube.tv/__mocks__/<moduleName>/<fileToMockName>.js`

This is quite handy for react-native projects as some native modules will never render in a test renderer (e.g. _Camera_).
Some libraries have instructions for creating such mock files.

Alternative: 1 large `jest.setup.js` file with all the mocks.

## 📁 `./OwnTube.tv/api/`

`queries` folder contains React hooks that wrap around the data fetching functions and handle things like loading state, re-fetching, cache invalidation through the use of `tanstack-query` (formerly `react-query`) library.
Each file contains queries for a specific view, e.g. `categories.ts` contains queries for categories list and category videos + collections.

`axiosInstance.ts` contains an abstract `AxiosInstanceBasedApi` class that has all the prerequisites for creating an api service with `axios` which is then used
in all other apis in the folder.

`errorHandler.ts` contains a universal error handler that shows a toast message on error, though this behavior may change depending on error code and params.

All apis throw an `OwnTubeError` from `models.ts` which contains the error message, status code and text which can be used in the toast message.

`helpers.ts` includes two helper functions:

1. `getLocalData`: A function that retrieves local test data based on a query key. This is used for development or testing purposes when actual API calls are not desired or available.

2. `retry`: A function used in queries that determines whether to retry a failed API request based on the failure count and error type.

## 📁 `./OwnTube.tv/app/`

This directory's structure is static and determined by the `expo-router` package guidelines.
More insight on why expo-router is used can be found further in the document, and more information on the file structure can be found here: https://docs.expo.dev/router/create-pages/

The route structure is as follows:

`(home)/<screen>` where `(home)` is the base path and the available screens are separate routes.
There is also a file for the `(home)/index` route which corresponds to the home page (`/`).

Each route has a `backend` parameter and the others - depending on the route.
All the routes come together in the `_layout.tsx` file which exports the app navigation.
The reasoning behind the inclusion of the `+html.tsx` file will be discussed further in the document.

## 📁 `./OwnTube.tv/assets/`

Contains logos, fonts and test data jsons, only the files put in this and `./OwnTube.tv/public` folder will be included in the build.

## 📁 `./OwnTube.tv/components/`

A base folder for React components used in the app, the `/shared/` folder contains base component like "button" or "spacer".
Some of the components that require a lot of supporting files (styles, tests etc.) are placed in a single folder,
while most consist of 1 file which contains the styles (if any) and the component code.

## 📁 `./OwnTube.tv/contexts/`

This folder contains React context providers and their associated setup files. The contexts in this folder include:

1. `ColorSchemeContext`: Used for managing and switching themes across the app. It provides color-related information and functions to components that need to adapt to theme changes.

2. `AppConfigContext`: Stores and provides access to technical information and settings that are relevant across the entire application. This may include device capability information, user preferences, or other app-wide configuration details.

3. `FullScreenModalContext`: Provides a mechanism for managing modal dialogs throughout the application. It offers a centralized way to control the visibility, content, and behavior of modals. This context allows any component in the app to easily trigger, dismiss, or update modal content without the need for prop drilling or complex state management.

## 📁 `./OwnTube.tv/hooks/`

Each file in this folder contains a React hook and if available, a file with the same name with a `.test.ts` extension.

## 📁 `./OwnTube.tv/layouts/`

Contains layout components, currently having only one - a `<Screen />` that wraps app screens.

## 📁 `./OwnTube.tv/locales/`

Contains locale files for each language in the `[language code].json` format. These files are then
supplied to the `react-18next` library as translation resources. To translate the app in your own language
you will need to translate the json file with a tool of you choice and make a pull request.

## 📁 `./OwnTube.tv/screens/`

This folder contains screen components which are imported into the route files in the `/app/` folder. Mostly these screens
consist of components from the `/components/` folder.

## 📁 `./OwnTube.tv/theme/`

Contains stylistic values and variables, such as colors or typography, however currently the app is mostly using the built-ins from `react-navigation` (a dependency of `expo-router`)

## 📁 `./OwnTube.tv/utils/`

Here you can find various utilities used across the app, such as time formatting or working with async storage, test setup helpers etc.

## 📁 `./OwnTube.tv/`

The project root contains configuration and setup files, notable ones include:

1. `build-info.json`: This file stores build-related information, including:

   - GitHub actor (user or system that triggered the build)
   - Short SHA of the commit
   - URL to the commit on GitHub
   - Timestamp of the build
   - Web URL of the application
     This information is useful for debugging, tracking deployments, and providing version information to users.

2. `i18n.ts`: This file sets up internationalization (i18n) for the application using the i18next library. It includes:

   - Initialization of i18next with React
   - Configuration of language fallbacks and separators
   - Import and registration of language resources
   - Definition of available language options with their respective date-fns locales
     This setup enables multi-language support throughout the application.

3. `instanceConfigs.ts`: This file defines the schema for instance configurations using Zod. It includes:
   - Schemas for color schemes and customizations
   - The main instance configuration schema, which includes properties like name, description, hostname, logo URL, and various customization options
   - Type definition for the instance configuration
     This allows for type-safe configuration of different instances of the application, enabling customization of appearance and behavior.
