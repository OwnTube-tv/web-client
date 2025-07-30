import { CustomPostHogEvents } from "./constants";

export type CustomPostHogEventParams = {
  [CustomPostHogEvents.Scrubbing]: { currentTime: string; targetTime: string };
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
};
