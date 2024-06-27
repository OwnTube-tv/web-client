# `web-client`

OwnTube.tv 📺, a portable video client for PeerTube in React Native.

Technologies that we depend upon:

- [Expo](https://docs.expo.dev/)
- [React](https://react.dev/learn)
- [React Native](https://reactnative.dev/docs/getting-started)
- [TypeScript](https://www.typescriptlang.org/docs/handbook/intro.html)

## Contributing

Review existing issues to see if there's an open item to contribute to, or add a new one. If you identify bugs, please report them in a reproducible manner with all details upfront. We use the [Forking workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/forking-workflow) to collaborate.

## Development

Open your fork in GitHub Codespaces for developing and testing the code.

```bash
cd OwnTube.tv/
npm install
npm run web
```

To get _Continuous Delivery_ from main branch working with GitHub Pages, open your fork _"Settings" > "Pages" > "Build and deployment"_ and select _"Source: GitHub Actions"_, then go to your fork _"Actions"_ tab and select _"I understand my workflows, go ahead and enable them"_.

When a improvement is ready to be contributed in a pull request, please review the following checklist:

1. Squash your changes into a single clear and thoroughly descriptive commit, split changes into multiple commits only when it contributes to readability
2. Reference the GitHub issue that you are contributing on in your commit title or body
3. Sign your commits, as this is required by the automated GitHub PR checks
4. Ensure that the changes adhere to the project code style and formatting rules by running `npx eslint .` and `npx prettier --check ../` from the `./OwnTube.tv/` directory (without errors/warnings)
5. Include links and illustrations in your pull request to make it easy to review
6. Request a review by @ar9708, @OGTor, @tryklick and @mblomdahl

## Documentation

Refer to [documentation](docs/index.md) for additional info.
