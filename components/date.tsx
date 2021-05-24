import { parseISO, format } from "date-fns";

export const Date: React.FC<{ date: string }> = ({ date }) => (
  <time dateTime={date}>{format(parseISO(date), "LLLL d, yyyy")}</time>
);
