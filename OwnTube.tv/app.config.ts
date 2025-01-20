const getBuildNumber = () => {
  const now = new Date();
  return `${now.getUTCFullYear() % 100}${String(now.getUTCMonth() + 1).padStart(2, "0")}${String(now.getUTCDate()).padStart(2, "0")}${String(now.getUTCHours()).padStart(2, "0")}${String(now.getUTCMinutes()).padStart(2, "0")}`;
};

export default {
  slug: process.env.EXPO_PUBLIC_APP_SLUG || "OwnTube.tv",
  name: process.env.EXPO_PUBLIC_APP_NAME || "OwnTube.tv",
  icon:
    process.env.EXPO_PUBLIC_ICON || (process.env.EXPO_TV ? "./assets/appleTV/icon_1280x768.png" : "./assets/icon.png"),
  scheme: "owntube",
  version: process.env.EXPO_PUBLIC_APP_VERSION || "1.0.0",
  assetBundlePatterns: ["**/*"],
  userInterfaceStyle: process.env.EXPO_PUBLIC_USER_INTERFACE_STYLE || "light",
  splash: {
    image: process.env.EXPO_PUBLIC_SPLASH_IMAGE || "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: process.env.EXPO_PUBLIC_SPLASH_BG_COLOR || "#F95F1E",
  },
  ios: {
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
    buildNumber: getBuildNumber(),
    supportsTablet: true,
    bundleIdentifier: process.env.EXPO_PUBLIC_IOS_BUNDLE_IDENTIFIER || "com.owntubetv.owntube",
  },
  experiments: {
    baseUrl: process.env.EXPO_PUBLIC_BASE_URL || "/web-client",
  },
  android: {
    versionCode: Math.floor(new Date().getTime() / 1000),
    adaptiveIcon: {
      foregroundImage:
        process.env.EXPO_PUBLIC_ANDROID_ADAPTIVE_ICON_FOREGROUND || "./assets/adaptive-icon-foreground.png",
      monochromeImage:
        process.env.EXPO_PUBLIC_ANDROID_ADAPTIVE_ICON_MONOCHROME || "./assets/adaptive-icon-foreground.png",
      backgroundColor: process.env.EXPO_PUBLIC_ANDROID_ADAPTIVE_ICON_BG_COLOR || "#F95F1E",
    },
    package: process.env.EXPO_PUBLIC_ANDROID_PACKAGE || "com.owntubetv.owntube",
  },
  web: {
    output: "static",
    bundler: "metro",
    favicon: process.env.EXPO_PUBLIC_FAVICON_URL || "./assets/favicon.png",
  },
  plugins: [
    [
      "@react-native-tvos/config-tv",
      {
        androidTVBanner: process.env.EXPO_PUBLIC_ANDROID_TV_BANNER || "./assets/android-tv-banner.png",
        androidTVIcon: process.env.EXPO_PUBLIC_ICON || "./assets/icon.png",
        appleTVImages: {
          icon: process.env.EXPO_PUBLIC_APPLE_TV_ICON || "./assets/appleTV/icon_1280x768.png",
          iconSmall: process.env.EXPO_PUBLIC_APPLE_TV_ICON_SMALL || "./assets/appleTV/iconSmall_400x240.png",
          iconSmall2x: process.env.EXPO_PUBLIC_APPLE_TV_ICON_SMALL_2X || "./assets/appleTV/iconSmall2x_800x480.png",
          topShelf: process.env.EXPO_PUBLIC_APPLE_TV_TOP_SHELF || "./assets/appleTV/topShelf_1920x720.png",
          topShelf2x: process.env.EXPO_PUBLIC_APPLE_TV_TOP_SHELF_2X || "./assets/appleTV/topShelf2x_3840x1440.png",
          topShelfWide: process.env.EXPO_PUBLIC_APPLE_TV_TOP_SHELF_WIDE || "./assets/appleTV/topShelfWide_2320x720.png",
          topShelfWide2x:
            process.env.EXPO_PUBLIC_APPLE_TV_TOP_SHELF_WIDE_2X || "./assets/appleTV/topShelfWide2x_4640x1440.png",
        },
      },
    ],
    "expo-router",
    [
      "expo-font",
      {
        fonts: ["assets/fonts/icomoon.ttf"],
      },
    ],
    "expo-localization",
    [
      "expo-screen-orientation",
      {
        initialOrientation: "DEFAULT",
      },
    ],
    "expo-asset",
    [
      "./plugins/withReleaseSigningConfig.js",
      {
        storeFile: "release-key.jks",
        storePassword: process.env.EXPO_PUBLIC_ANDROID_RELEASE_SIGNING_STORE_FILE_PASSWORD,
        keyAlias: process.env.EXPO_PUBLIC_ANDROID_RELEASE_SIGNING_KEY_ALIAS,
        keyPassword: process.env.EXPO_PUBLIC_ANDROID_RELEASE_SIGNING_KEY_PASSWORD,
      },
    ],
  ],
};
