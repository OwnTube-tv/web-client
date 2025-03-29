/* eslint-env node */
const { withAndroidManifest, withPlugins } = require("@expo/config-plugins");

function withAndroidNotificationControls(config) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults.manifest;

    // Add permissions
    const permissions = androidManifest["uses-permission"] || [];
    const newPermissions = [
      {
        $: {
          "android:name": "android.permission.FOREGROUND_SERVICE",
        },
      },
      {
        $: {
          "android:name": "android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK",
        },
      },
    ];

    androidManifest["uses-permission"] = [...permissions, ...newPermissions];

    // Add service to application
    const application = androidManifest.application[0];

    if (!application.service) {
      application.service = [];
    }

    application.service.push({
      $: {
        "android:name": "com.brentvatne.exoplayer.VideoPlaybackService",
        "android:exported": "false",
        "android:foregroundServiceType": "mediaPlayback",
      },
      "intent-filter": [
        {
          action: [
            {
              $: {
                "android:name": "androidx.media3.session.MediaSessionService",
              },
            },
          ],
        },
      ],
    });

    return config;
  });
}

module.exports = (config) => withPlugins(config, [withAndroidNotificationControls]);
