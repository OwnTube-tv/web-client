# Main pipeline 👷

The main workflow in `deploy-static-main.yml` builds the application for all supported platforms in the following jobs:

1. The runner label is determined for the macOS runner - a custom one from the environment variable "`PREFERRED_MACOS_RUNNER`", or if it is missing - the default, "`macos-latest`", is used (see `choose_macos_runner` job)
2. The build info is created and prepared for injection into app bundles (see `build_info` job)
3. A check is performed to determine if a customizations repo link and file name is provided from the environment variables "`CLIENT_CUSTOMIZATIONS_REPO`" and "`CLIENT_CUSTOMIZATIONS_FILE`", if yes - the customizations file content is stored for future injection (see `customizations_setup` job)
4. Checks for code quality and unit tests are run (see `code_quality` job)
5. The following build processes start:
   - Build and deploy app as static export to GitHub Pages
   - Build the app for iOS and tvOS simulators
   - Build the Android and Android TV `.apk`'s
   - \[Optional] If selected when starting the pipeline, build and upload iOS and/or tvOS apps to TestFlight
   - \[Optional] If selected when starting the pipeline, build and upload Android and/or Android TV apps to Google Play

## GitHub Pages deployment 🌍

You can set up a custom domain for your web client deployments, for this configure the repository on GitHub and add a `CUSTOM_DEPLOYMENT_URL` variable to the
`github-pages` environment in repository environments settings. From then on, OwnTube should automatically switch to your
custom website address. Please note that some of the changes needed to configure this may take considerable time, such as DNS cache propagation.

Setting up a custom domain also opens the road to having deep links set up. Fortunately, the build pipeline can handle this
process automatically, all you need to do is add the following values to `github-pages` environment variables:

- `ANDROID_FINGERPRINT`: the SHA256 fingerprint of your app signing key certificate (obtained from Google Play console after first manual release);
- `ANDROID_PACKAGE`: the Android package name for the app;
- `APPLE_BUNDLE_ID`: bundle ID for the Apple version of the app;
- `APPLE_DEVELOPMENT_TEAM`: Apple Development Team ID from App Store Connect;
- `CUSTOM_DEPLOYMENT_URL`: should be added for custom domains to work in the first step;

## TestFlight upload ⏫

Before uploading to TestFlight, create an "`owntube`" environment in repository settings if you haven't already, then add the following secrets to the environment:

- `APPLE_API_KEY`: the ID for the Apple App Store API Key that you generated in App Store Connect;
- `APPLE_API_KEY_ISSUER`: the issuer ID for the key;
- `APPLE_API_PRIVATE_KEY`: base64-encoded contents of the .p8 key file associated with the key, to correctly add the secret:
  - download the file and store in a safe place - you can download it only once;
  - run `openssl base64 -in <key_file>.p8 | pbcopy` in the terminal, then paste in the secret value;
- `APPLE_DEVELOPMENT_TEAM`: the Apple Team Identifier from App Store Connect;
- `[IOS/TVOS]_BUILD_CERTIFICATE_BASE64`: base64-encoded contents of the code signing certificate, to correctly add the secret:
  - download the distribution certificate from App Store Connect;
  - install the certificate to your keychain, then view it in KeyChain Access app, and press "export" on the certificate key;
  - convert the .p12 key to .pem by running `openssl pkcs12 -legacy -in <certificate_key_file>.p12 -out <certificate_key_file>.pem -nocerts -nodes` in terminal;
  - run `openssl pkcs12 -export -legacy -out <legacy_certificate_file>.p12 -in <certificate_file>.cer -inkey <certificate_key_file>.pem` in terminal;
  - copy key contents in base64 to clipboard by running `openssl base64 -in <legacy_certificate_file>.p12 | pbcopy` in terminal;
  - paste the key contents in secret value;
- `[IOS/TVOS]_BUILD_PROVISION_PROFILE_BASE64`: base64-encoded contents of the provisioning profile, to correctly add the secret:
  - download the provisioning profile related to the correct certificate from App Store Connect;
  - run `openssl base64 -in <provisioning_profile_file>.mobileprovision | pbcopy` in terminal to copy the file contents;
  - paste the provisioning profile file contents in secret value;
- `[IOS/TVOS]_P12_PASSWORD`: the password to the certificate that you set when exporting;
- `[IOS/TVOS]_PROVISIONING_PROFILE_SPECIFIER`: the name of the provisioning profile used;

## Google Play upload ⏫

Like with TestFlight, before uploading create an "`owntube`" environment in repository settings if you haven't already, then add the following secrets to the environment:

- `ANDROID_RELEASE_KEYSTORE_CONTENT_BASE64`: base64-encoded contents of the .jks keystore that you use to sign the app for release. You need to create the keystore locally,
  to do this you need to:
  - run `keytool -genkeypair -v -keystore release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias release-key` in the terminal and follow the prompts;
  - run `base64 -i release-key.jks | pbcopy` in the same location, then paste in the secret value;
- `ANDROID_KEYSTORE_PASSWORD`: the password you specified when generating the keystore;
- `ANDROID_SIGNING_KEY_ALIAS`: the key alias you specified when generating the keystore;
- `ANDROID_SIGNING_KEY_PASSWORD`: the signing key password you specified when generating the keystore;
- `ANDROID_SERVICE_ACCOUNT_JSON`: the json signing key of the service account that you added to Google Play Console for app bundle uploads through API in plain text;

According to Google Play rules, your first upload of an app has to be done through the Google Play interface, manually.
To generate a bundle for the first upload you can use the `google_play_initial_bundle` action. The resulting .aab artifact will be available for upload to Google Play.
