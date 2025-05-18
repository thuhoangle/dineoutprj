import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
dayjs.extend(weekOfYear);
import { DateValue } from '@internationalized/date';

export const isCurrentDay = (day: dayjs.Dayjs) => {
  return day.isSame(dayjs(), 'day');
};

export const getMonth = (month = dayjs().month()) => {
  const year = dayjs().year();
  const firstDayofMonth = dayjs().set('month', month).startOf('month').day();

  let dayCounter = -firstDayofMonth;

  return Array.from({ length: 5 }, () => Array.from({ length: 7 }, () => dayjs(new Date(year, month, ++dayCounter))));
};

export const getWeekDays = (date: dayjs.Dayjs) => {
  const startOfWeek = date.startOf('week');

  const weekDates = [];

  // Loop through the 7 days of the week
  for (let i = 0; i < 7; i++) {
    const currentDate = startOfWeek.add(i, 'day');
    weekDates.push({
      currentDate,
      today: currentDate.toDate().toDateString() === dayjs().toDate().toDateString(),
      isCurrentDay,
    });
  }

  return weekDates;
};

export const getHours = (minTime = '08:00', maxTime = '23:30') => {
  const [minHour, minMinute] = minTime.split(':').map(Number);
  const [maxHour, maxMinute] = maxTime.split(':').map(Number);

  const minTimeInMinutes = minHour * 60 + minMinute;
  const maxTimeInMinutes = maxHour * 60 + maxMinute;

  return Array.from({ length: 48 }, (_, i) => {
    const time = dayjs()
      .startOf('day')
      .add(i * 30, 'minute');
    const timeInMinutes = time.hour() * 60 + time.minute();
    return timeInMinutes >= minTimeInMinutes && timeInMinutes <= maxTimeInMinutes ? time : null;
  }).filter(Boolean);
};

// Function to generate weeks of the month dynamically

export const getWeeks = (monthIndex: number) => {
  const year = dayjs().year();
  const firstDayOfMonth = dayjs(new Date(year, monthIndex, 1));
  const lastDayOfMonth = dayjs(new Date(year, monthIndex + 1, 0)); // Last day of the month

  const weeks: number[] = [];

  // Loop from the first day to the last day of the month
  let currentDay = firstDayOfMonth;
  while (currentDay.isBefore(lastDayOfMonth) || currentDay.isSame(lastDayOfMonth)) {
    const weekNumber = currentDay.week(); //This requires the WeekOfYear plugin to work as imported above
    if (!weeks.includes(weekNumber)) {
      weeks.push(weekNumber);
    }
    currentDay = currentDay.add(1, 'day'); // Move to the next day
  }

  return weeks;
};

export interface TimeRange {
  startTime: string;
  endTime: string;
}

export const getDisabledTimes = (timeRanges: TimeRange[], currentIndex: number): string[] => {
  const disabledTimes: string[] = [];

  timeRanges.forEach((range, index) => {
    // Skip the current time range
    if (index === currentIndex) return;

    // Convert times to minutes for comparison
    const startHour = parseInt(range.startTime.split(':')[0]);
    const startMinute = parseInt(range.startTime.split(':')[1]);
    const endHour = parseInt(range.endTime.split(':')[0]);
    const endMinute = parseInt(range.endTime.split(':')[1]);

    const startTimeInMinutes = startHour * 60 + startMinute;
    const endTimeInMinutes = endHour * 60 + endMinute;

    // Add all times in this range to disabled list
    for (let timeInMinutes = startTimeInMinutes; timeInMinutes <= endTimeInMinutes; timeInMinutes += 30) {
      const hour = Math.floor(timeInMinutes / 60);
      const minute = timeInMinutes % 60;
      const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      disabledTimes.push(timeSlot);
    }
  });

  return disabledTimes;
};

export const formatDateForAPI = (date: DateValue): string => {
  return date.toString().split('T')[0]; //  YYYY-MM-DD format
};
