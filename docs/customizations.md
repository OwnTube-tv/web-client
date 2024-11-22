### Introduction

OwnTube.tv allows you to customize your fork in terms of appearance or textual information. The customizations are
applied in the build pipeline and sourced from a git repository of your choice.

### Customizations setup

#### Environment variables

First, go to your fork's GitHub page, navigate to **Settings** => **Environments** and create a new environment with the
name `owntube`. It is important to keep this environment name unless you create a custom GitHub Actions workflow and
specify a different name there.

In the `owntube` environment that you created, specify two environment variables:

**CLIENT_CUSTOMIZATIONS_REPO** - the link to a git repository that contains your customizations file;

**CLIENT_CUSTOMIZATIONS_FILE** - the path to the customizations file in the repository;

In the end, the environment variables should look something like this:

| Name                       | Value                                                   |
| -------------------------- | ------------------------------------------------------- |
| CLIENT_CUSTOMIZATIONS_REPO | https://github.com/your-owntube-fork-customizations.git |
| CLIENT_CUSTOMIZATIONS_FILE | customizations.env                                      |

#### Customizations file contents

The customizations file is essentially an .env file that is loaded by Expo at build time, the values from which are then
used to populate the Expo config file (app.config.ts).

Each value must be prefixed by `EXPO_PUBLIC_`. See list of available customizations below:

`EXPO_PUBLIC_APP_NAME`: the app name that will be used both by Expo and in the text strings in the app.

`EXPO_PUBLIC_APP_SLUG`: needed if using Expo managed app services

`EXPO_PUBLIC_FAVICON_URL`: custom favicon link

`EXPO_PUBLIC_ICON`: custom app icon link

`EXPO_PUBLIC_IOS_BUNDLE_IDENTIFIER`: app identifier for iOS

`EXPO_PUBLIC_ANDROID_PACKAGE`: app package name for Android

`EXPO_PUBLIC_SPLASH_BG_COLOR`: custom splash background color

`EXPO_PUBLIC_SPLASH_IMAGE`: custom splash screen image

`EXPO_PUBLIC_${ANDROID_TV | APPLE_TV}_*`: various images for Android TV and tvOS apps such as the banner for android TV
or background images for Apple TV.

> [!WARNING]
> You need to supply images of expected sizes for tvOS or the build fails automatically:
> 
> EXPO_PUBLIC_APPLE_TV_ICON: 1280x760
> 
> EXPO_PUBLIC_APPLE_TV_ICON_SMALL: 400x240
> 
> EXPO_PUBLIC_APPLE_TV_ICON_SMALL_2X: 800x480
> 
> EXPO_PUBLIC_APPLE_TV_TOP_SHELF: 1920x720
> 
> EXPO_PUBLIC_APPLE_TV_TOP_SHELF_2X: 3840x1440
> 
> EXPO_PUBLIC_APPLE_TV_TOP_SHELF_WIDE: 2320x720
> 
> EXPO_PUBLIC_APPLE_TV_TOP_SHELF_WIDE_2X: 4640x1440
> 
> More info at https://www.npmjs.com/package/@react-native-tvos/config-tv

#### Build process

The main workflow in `deploy-static-main.yml` builds the application for iOS, Android and Web in the following steps:

1. The build info is created and prepared for injection into app bundles in the `build_info` step. (`build_info`)
2. A check is performed to determine if a customizations repo link and file name is provided, if yes - the customizations file content is stored for future injection (`customizations_setup`)
3. `[iOS & tvOS - specific]`: the runner label is determined for the iOS build - a custom one from the environemnt variable "PREFERRED_MACOS_RUNNER", or if it is missing - the default, `macos-latest`. (`choose_macos_runner`)
4. Checks for code quality and unit tests are run (`code_quality`)
5. Parallel builds start for Android (`build_android_apk`) and iOS (`build_ios_app`) artifacts, also the web version is bundled into an artifact and deployed to GitHub Pages (`deploy_web`)
