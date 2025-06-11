export const getHumanReadableDuration = (ms: number = 0) => {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / 1000 / 60) % 60);
  const hours = Math.floor((ms / 1000 / 3600) % 24);

  return `${String(hours).padStart(1, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export const removeSecondsFromISODate = (isoDate: string) => {
  return `${isoDate.slice(0, isoDate.lastIndexOf(":"))}Z`;
};

export function parseISOToEpoch(iso?: string) {
  return iso ? Math.floor(new Date(iso).getTime() / 1000) : 0;
}
