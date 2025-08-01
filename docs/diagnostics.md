# Diagnostics

OwnTube.tv 📺 allows you to collect product diagnostics through the PostHog service, which you can self-host, use your own cloud account, or trust us with the diagnostics.

## Opt-in behavior

By default, diagnostics are set to opt-in. This means that no tracking occurs unless the user explicitly enables it. Users can allow diagnostics collection by selecting the **Debug Logging** checkbox in the Settings menu. Until this option is enabled, no diagnostics data will be sent.

## Enabling diagnostics

By default, diagnostics are collected to the OwnTube.tv PostHog service. You can change this behavior by specifying your own PostHog project API key in your environment configuration files. To do this, set the `EXPO_PUBLIC_POSTHOG_API_KEY` variable to your PostHog project's key.

If you do not wish to collect any diagnostics, set the `EXPO_PUBLIC_POSTHOG_API_KEY` to `null` in your environment files. This will disable diagnostics collection entirely.

**Example:**

```env
# Use your own PostHog project
EXPO_PUBLIC_POSTHOG_API_KEY=phc_xxxxxxxxxxxxxxxxxxxxxxxx

# Or disable diagnostics
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
