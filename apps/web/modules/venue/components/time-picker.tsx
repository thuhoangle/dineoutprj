import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';

import { TextField } from '../../../components';

dayjs.extend(weekday);

// Utility function to get the short day name
const getShortDayName = (dateString: string) => {
  const date = dayjs(dateString, 'MM/DD/YYYY');
  const dayOfWeek = date.day();
  const shortDayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  return shortDayNames[dayOfWeek];
};

const getDayOfMonth = (dateString: string) => {
  const date = dayjs(dateString, 'MM/DD/YYYY');
  return date.date(); // Returns the day of the month
};

export const DatePicker = ({
  date,
  onClick,
}: {
  date: string;
  onClick: () => void;
}) => {
  const shortDayName = getShortDayName(date);
  const dayOfMonth = getDayOfMonth(date);

  return (
    <div className="flex flex-col gap-1">
      <TextField preset="p5" color="gray" text={shortDayName} />
      <button
        onClick={onClick}
        className="rounded-full aspect-square h-10 border border-primary-200 disabled:border-none disabled:line-through flex items-center justify-center"
      >
        <TextField preset="p5" text={String(dayOfMonth)} />
      </button>
    </div>
  );
};
