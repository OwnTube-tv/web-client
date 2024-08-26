/* eslint-disable react-native/no-raw-text */
import type { PropsWithChildren } from "react";

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="height=device-height, width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />
        {/* Link the PWA manifest file. */}
        <link rel="manifest" href="manifest.json" />
        <style id="expo-reset">{"html, body { height: 100%; } #root { display: flex; height: 100%; flex: 1; }"}</style>
        <script src="https://vjs.zencdn.net/8.10.0/video.min.js"></script>
      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        {children}
      </body>
    </html>
  );
}
