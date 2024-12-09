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
   - \[Optional] If selected when starting the pipeline, build and upload iOS and tvOS apps to TestFlight

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
