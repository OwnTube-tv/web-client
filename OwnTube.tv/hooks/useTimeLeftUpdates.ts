import { formatDistanceToNow } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { LANGUAGE_OPTIONS } from "../i18n";
import { useTranslation } from "react-i18next";

export const useTimeLeftUpdates = (scheduledLiveDate: string | Date | null | undefined) => {
  const { i18n } = useTranslation();
  const formatDate = useCallback(
    (date?: string | Date | null) => {
      if (!date) {
        return "";
      }

      return formatDistanceToNow(date, {
        addSuffix: true,
        locale: LANGUAGE_OPTIONS.find(({ value }) => value === i18n.language)?.dateLocale,
      });
    },
    [i18n],
  );

  const [formattedTimeLeft, setFormattedTimeLeft] = useState<string | null>(null);

  useEffect(() => {
    setFormattedTimeLeft(formatDate(scheduledLiveDate));

    const interval = setInterval(() => {
      setFormattedTimeLeft(formatDate(scheduledLiveDate));
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [scheduledLiveDate, formatDate, i18n.language]);

  return formattedTimeLeft;
};
