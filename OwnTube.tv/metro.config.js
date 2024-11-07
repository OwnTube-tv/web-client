/* eslint-env node */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push("json", "json5", "ttf", "otf");

if (process.env.EXPO_TV) {
  config.resolver.sourceExts.unshift(...config.resolver.sourceExts.map((e) => `tv.${e}`));
}

module.exports = config;
