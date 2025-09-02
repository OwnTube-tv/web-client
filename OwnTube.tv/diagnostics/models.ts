import { CustomPostHogEvents } from "./constants";

export type CustomPostHogEventParams = {
  [CustomPostHogEvents.Scrubbing]: {
    videoId: string;
    currentTime: string;
    targetTime: string;
    targetPercentage: number;
  };
  [CustomPostHogEvents.Pause]: { currentTime: string };
  [CustomPostHogEvents.Play]: { currentTime: string };
  [CustomPostHogEvents.EnableCaptions]: { captionLanguage?: string };
  [CustomPostHogEvents.DisableCaptions]: undefined;
  [CustomPostHogEvents.AirPlayStarted]: undefined;
  [CustomPostHogEvents.AirPlayStopped]: undefined;
  [CustomPostHogEvents.ChromecastStarted]: undefined;
  [CustomPostHogEvents.ChromecastStopped]: undefined;
  [CustomPostHogEvents.ResolutionChanged]: { resolution: string };
  [CustomPostHogEvents.MuteAudio]: undefined;
  [CustomPostHogEvents.UnmuteAudio]: undefined;
  [CustomPostHogEvents.ReturnToPreviousScreen]: undefined;
  [CustomPostHogEvents.ShowVideoDescription]: undefined;
  [CustomPostHogEvents.HideVideoDescription]: undefined;
  [CustomPostHogEvents.Share]: { type: "video" | "channel" | "playlist" | "app" };
  [CustomPostHogEvents.CopyShareLink]: undefined;
  [CustomPostHogEvents.Login]: { backend: string };
  [CustomPostHogEvents.TwoFAScreen]: { backend: string };
  [CustomPostHogEvents.Reauthenticate]: { backend: string };
  [CustomPostHogEvents.Logout]: undefined;
  [CustomPostHogEvents.ChangeBackendServer]: { backend: string };
  [CustomPostHogEvents.PullToRefresh]: undefined;
  [CustomPostHogEvents.TabFocus]: { tabUrl: string };
  [CustomPostHogEvents.TabBlur]: { tabUrl: string };
  [CustomPostHogEvents.AppInBackground]: undefined;
  [CustomPostHogEvents.AppInForeground]: undefined;
  [CustomPostHogEvents.VideoCompleted]: undefined;
  [CustomPostHogEvents.BandwidthChanged]: { bandwidth?: number; width?: number; height?: number };
  [CustomPostHogEvents.PlaybackQualityDegradation]: {
    droppedFrames: number;
    totalFrames: number;
    droppedFramesPercent: number;
  };
  [CustomPostHogEvents.SessionExpired]: undefined;
  [CustomPostHogEvents.PlaybackSpeedChanged]: { playbackSpeed: number };
  [CustomPostHogEvents.InstanceSearchTextChanged]: { searchText: string };
  [CustomPostHogEvents.AppInBackground]: undefined;
  [CustomPostHogEvents.AppInForeground]: undefined;
  [CustomPostHogEvents.VideoCompleted]: undefined;
  [CustomPostHogEvents.BandwidthChanged]: { bandwidth?: number; width?: number; height?: number };
  [CustomPostHogEvents.PlaybackQualityDegradation]: {
    droppedFrames: number;
    totalFrames: number;
    droppedFramesPercent: number;
  };
  [CustomPostHogEvents.VideoPlayback]: {
    videoId: string;
    currentTime: string;
    isFullscreen: boolean;
    externalPlaybackState?: "airplay" | "chromecast";
    isMuted: boolean;
    captionsEnabled: boolean;
    captionsLanguage?: string;
    viewEvent: "watch" | "seek";
  };
};
