# Customizations setup

OwnTube.tv 📺 allows you to customize your fork in terms of appearance or textual information. The customizations are
applied in the build pipeline and sourced from a git repository of your choice.

## Environment variables

First, go to your fork's GitHub page, navigate to _"Settings" > "Environments"_ and create a new environment with the
name "`owntube`". It is important to keep this environment name unless you create a custom GitHub Actions workflow and
specify a different name there.

In the `owntube` environment that you created, specify two environment variables:

- `CLIENT_CUSTOMIZATIONS_REPO` - the git repository clone URL that contains your customizations file (HTTPS)
- `CLIENT_CUSTOMIZATIONS_FILE` - the path to the customizations file in the repository

In the end, the environment variables should look something like this:

| Name                         | Value                                                     |
| ---------------------------- | --------------------------------------------------------- |
| `CLIENT_CUSTOMIZATIONS_REPO` | `https://github.com/OwnTube-tv/client-customizations.git` |
| `CLIENT_CUSTOMIZATIONS_FILE` | `config.mishatube.env`                                    |

## `CLIENT_CUSTOMIZATIONS_FILE` file contents

The customizations file is essentially an .env file that is loaded by Expo at build time, the values from which are then
used to populate the Expo config file (app.config.ts).

Each value must be prefixed by `EXPO_PUBLIC_`. See the list of available customizations below:
`EXPO_PUBLIC_PRIMARY_BACKEND`: the primary backend hostname for the app, for cases when you are building a client for a single PeerTube instance

`EXPO_PUBLIC_APP_NAME`: the app name that will be used both by Expo and in the text strings in the app

`EXPO_PUBLIC_APP_SLUG`: needed if using Expo managed app services

`EXPO_PUBLIC_FAVICON_URL`: custom favicon link

`EXPO_PUBLIC_ICON`: custom app icon link

`EXPO_PUBLIC_IOS_BUNDLE_IDENTIFIER`: app identifier for iOS

`EXPO_PUBLIC_ANDROID_PACKAGE`: app package name for Android

`EXPO_PUBLIC_SPLASH_BG_COLOR`: custom splash background color

`EXPO_PUBLIC_SPLASH_IMAGE`: custom splash screen image

`EXPO_PUBLIC_${ANDROID_TV | APPLE_TV}_*`: various images for Android TV and tvOS apps such as the banner for android TV
or background images for Apple TV.

`EXPO_PUBLIC_LANGUAGE_OVERRIDE`: override the default language of the app with a custom language code, e.g. "sv"

`EXPO_PUBLIC_HIDE_VIDEO_SITE_LINKS`: hide the links to original PeerTube site in video player and on playlist/category
views by setting it to "1" or "true" (omit for default behavior)

`EXPO_PUBLIC_HIDE_GIT_DETAILS`: hide the build info section about git commit and author by setting it to "1" or "true"
(omit for default behavior)

`EXPO_PUBLIC_FOOTER_LOGO`: custom footer logo instead of OwnTube.tv logo

`EXPO_PUBLIC_PROVIDER_LEGAL_ENTITY`: the legal company name used in the privacy policy section

`EXPO_PUBLIC_PROVIDER_LEGAL_EMAIL`: the official legal issues email used in the privacy policy section

`EXPO_PUBLIC_PROVIDER_CONTACT_EMAIL`: the contact email used in the privacy policy section

> [!WARNING]
> You need to supply images of expected sizes for tvOS, or the build fails automatically:
>
> EXPO_PUBLIC_APPLE_TV_ICON: 1280x768
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
