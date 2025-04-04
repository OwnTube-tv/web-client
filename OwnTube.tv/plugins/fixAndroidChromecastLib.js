/* eslint-env node */
const { withAndroidManifest, withPlugins, withGradleProperties } = require("@expo/config-plugins");

function withAndroidManifestFix(config) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults.manifest;

    const application = androidManifest.application[0];

    application.$["tools:replace"] = "android:appComponentFactory";
    application.$["android:appComponentFactory"] = "androidx.core.app.CoreComponentFactory";

    return config;
  });
}

function withCustomGradleProperties(config) {
  return withGradleProperties(config, (config) => {
    const enableJetifier = config.modResults.find((prop) => prop.key === "android.enableJetifier");

    if (enableJetifier) {
      enableJetifier.value = "true";
    } else {
      config.modResults.push({ type: "property", key: "android.enableJetifier", value: "true" });
    }

    const jvmArgs = config.modResults.find((prop) => prop.key === "org.gradle.jvmargs");

    if (jvmArgs) {
      jvmArgs.value = jvmArgs.value.replace(/-Xmx\d+[gm]/, "-Xmx4g");
    } else {
      config.modResults.push({ type: "property", key: "org.gradle.jvmargs", value: "-Xmx4g" });
    }

    return config;
  });
}

module.exports = (config) => withPlugins(config, [withAndroidManifestFix, withCustomGradleProperties]);
