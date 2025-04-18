import { formatDistance, format, isAfter, subDays } from "date-fns";

/**
 * @description Format relative date string within 7 days
 * @param date
 * @returns formatted string
 */
export const formatRelativeDate = (date: Date): string => {
  const oneWeekAgo = subDays(new Date(), 7);

  if (isAfter(date, oneWeekAgo)) {
    return formatDistance(date, new Date(), { addSuffix: true });
  } else {
    return format(date, "MMM d, yyyy");
  }
};
