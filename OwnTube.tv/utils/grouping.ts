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
): Array<{ title: string; data: ViewHistoryEntry[] }> => {
  return entries.reduce(
    (groups, entry) => {
      const date = new Date(entry.lastViewedAt);
      let title = "";

      if (isToday(date)) {
        title = "Today";
      } else if (isYesterday(date)) {
        title = "Yesterday";
      } else if (differenceInCalendarDays(new Date(), date) <= 7) {
        title = "Last Week";
      } else if (differenceInCalendarMonths(new Date(), date) <= 1) {
        title = "Last Month";
      } else if (differenceInCalendarYears(new Date(), date) <= 1) {
        title = "Last Year";
      } else {
        title = "Older than a year";
      }

      const group = groups.find((g) => g.title === title);
      if (group) {
        group.data.push(entry);
      } else {
        groups.push({ title, data: [entry] });
      }

      return groups;
    },
    [] as Array<{ title: string; data: ViewHistoryEntry[] }>,
  );
};
