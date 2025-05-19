import dayjs, { Dayjs } from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import minMax from 'dayjs/plugin/minMax';

import { ReservationInfo } from '@/services';

dayjs.extend(isSameOrBefore);
dayjs.extend(minMax);

export const groupAndMergeReservations = (reservations: ReservationInfo[], durationMinutes = 30) => {
  const grouped = reservations.reduce(
    (acc, res) => {
      const key = `${res.user_id}-${res.table_id}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(res);
      return acc;
    },
    {} as Record<string, typeof reservations>
  );

  const result: {
    start: string;
    end: string;
    reservations: typeof reservations;
  }[] = [];

  Object.values(grouped).forEach((userReservations) => {
    const sorted = [...userReservations].sort(
      (a, b) => dayjs(a.reservation_time).unix() - dayjs(b.reservation_time).unix()
    );

    let currentGroup: { start: Dayjs; end: Dayjs; reservations: typeof reservations }[] = [];

    for (const res of sorted) {
      const start = dayjs(res.reservation_time);
      const end = start.add(durationMinutes, 'minute');

      const last = currentGroup[currentGroup.length - 1];

      if (!last) {
        currentGroup.push({ start, end, reservations: [res] });
      } else {
        if (start.isSameOrBefore(last.end) && res.table_id === last.reservations[0].table_id) {
          last.end = dayjs.max(last.end, end);
          last.reservations.push(res);
        } else {
          result.push({
            start: last.start.format('HH:mm'),
            end: last.end.format('HH:mm'),
            reservations: last.reservations,
          });
          currentGroup = [{ start, end, reservations: [res] }];
        }
      }
    }

    if (currentGroup.length) {
      const last = currentGroup[currentGroup.length - 1];
      result.push({
        start: last.start.format('HH:mm'),
        end: last.end.format('HH:mm'),
        reservations: last.reservations,
      });
    }
  });

  return result;
};
