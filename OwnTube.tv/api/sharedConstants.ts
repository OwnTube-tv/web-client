import buildInfo from "../build-info.json";

export const APP_IDENTIFIER = `${buildInfo.GITHUB_REPOSITORY}@${buildInfo.GITHUB_SHA_SHORT} (https://github.com/${buildInfo.GITHUB_ACTOR})`;
