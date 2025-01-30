/* eslint-env node */
const { withAppBuildGradle } = require("expo/config-plugins");

const signingConfigsRegex =
  /signingConfigs\s*{\s*debug\s*{\s*storeFile\s*file\('debug.keystore'\)\s*storePassword\s*'android'\s*keyAlias\s*'androiddebugkey'\s*keyPassword\s*'android'\s*}\s*}/s;
const buildTypesRegex =
  /signingConfig\s+signingConfigs\.debug\s*shrinkResources\s*\(\s*findProperty\(\s*'android\.enableShrinkResourcesInReleaseBuilds'\)\?\.\s*toBoolean\(\)\s*\?\s*:\s*false\s*\)/;

const withReleaseSigningConfig = (config, props) => {
  config = withAppBuildGradle(config, (config) => {
    let modifiedContents = config.modResults.contents;

    // add release signingConfig
    modifiedContents = modifiedContents.replace(
      signingConfigsRegex,
      `signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
        release {
           storeFile file('${props.storeFile}')
           storePassword '${props.storePassword}'
           keyAlias '${props.keyAlias}'
           keyPassword '${props.keyPassword}' 
        }
    }`,
    );

    // change release signingConfig to actual release config that we just added
    modifiedContents = modifiedContents.replace(
      buildTypesRegex,
      `signingConfig signingConfigs.release
            shrinkResources (findProperty('android.enableShrinkResourcesInReleaseBuilds')?.toBoolean() ?: false)`,
    );

    config.modResults.contents = modifiedContents;

    return config;
  });

  return config;
};

module.exports = withReleaseSigningConfig;
