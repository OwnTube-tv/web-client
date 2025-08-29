# Diagnostics

OwnTube.tv 📺 allows you to collect product diagnostics through the PostHog service, which you can self-host, use your own cloud account, or trust us with the diagnostics.

## Opt-out behavior

By default, diagnostics are enabled (opt-out). This means that anonymized diagnostics are collected unless the user explicitly disables it. Users can opt out of diagnostics collection at any time by selecting the **Opt-out of diagnostics** checkbox in the Settings menu. If this option is enabled, no diagnostics data will be sent.

## Disabling diagnostics

By default, diagnostics are collected to the OwnTube.tv PostHog service. You can change this behavior by specifying your own PostHog project API key in your environment configuration files. To do this, set the `EXPO_PUBLIC_POSTHOG_API_KEY` variable to your PostHog project's key.

If you do not wish to collect any diagnostics, set the `EXPO_PUBLIC_POSTHOG_API_KEY` to `null` in your environment files. This will disable diagnostics collection entirely for all users, regardless of their opt-out setting.

**Example:**

```env
# Use your own PostHog project
EXPO_PUBLIC_POSTHOG_API_KEY=phc_xxxxxxxxxxxxxxxxxxxxxxxx

# Or disable diagnostics for everyone
EXPO_PUBLIC_POSTHOG_API_KEY=null
```

## Specifying the diagnostics host

You can also configure the diagnostics host by setting the `EXPO_PUBLIC_POSTHOG_HOST` variable in your environment files. This allows you to choose between the default US or EU PostHog hosts, or provide the URL of your own self-hosted PostHog instance.

**Example:**

```env
# Use the US PostHog host
EXPO_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Use the EU PostHog host
EXPO_PUBLIC_POSTHOG_HOST=https://eu.posthog.com

# Use your own self-hosted PostHog instance
EXPO_PUBLIC_POSTHOG_HOST=https://diagnostics.yourdomain.com
```
