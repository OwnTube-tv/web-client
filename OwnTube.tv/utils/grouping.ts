import { ViewHistoryEntry } from "../hooks";

import {
  isToday,
  isYesterday,
  differenceInCalendarDays,
  differenceInCalendarMonths,
  differenceInCalendarYears,
} from "date-fns";

export const groupHistoryEntriesByTime = (
  entries: ViewHistoryEntry[],
): Array<{ titleKey: string; data: ViewHistoryEntry[] }> => {
  return entries.reduce(
    (groups, entry) => {
      const date = new Date(entry.lastViewedAt);
      let titleKey = "";

      if (isToday(date)) {
        titleKey = "today";
      } else if (isYesterday(date)) {
        titleKey = "yesterday";
      } else if (differenceInCalendarDays(new Date(), date) <= 7) {
        titleKey = "lastWeek";
      } else if (differenceInCalendarMonths(new Date(), date) <= 1) {
        titleKey = "lastMonth";
      } else if (differenceInCalendarYears(new Date(), date) <= 1) {
        titleKey = "last12Months";
      } else {
        titleKey = "olderThanAYear";
      }

      const group = groups.find((g) => g.titleKey === titleKey);
      if (group) {
        group.data.push(entry);
      } else {
        groups.push({ titleKey, data: [entry] });
      }

      return groups;
    },
    [] as Array<{ titleKey: string; data: ViewHistoryEntry[] }>,
  );
};
