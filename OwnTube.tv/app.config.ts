export default {
  slug: process.env.EXPO_PUBLIC_APP_SLUG || "OwnTube.tv",
  name: process.env.EXPO_PUBLIC_APP_NAME || "OwnTube.tv",
  icon: process.env.EXPO_PUBLIC_ICON || "./assets/icon.png",
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
    supportsTablet: true,
    bundleIdentifier: process.env.EXPO_PUBLIC_IOS_BUNDLE_IDENTIFIER || "com.owntubetv.owntube",
  },
  experiments: {
    baseUrl: process.env.EXPO_PUBLIC_BASE_URL || "/web-client",
  },
  android: {
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
  ],
};
