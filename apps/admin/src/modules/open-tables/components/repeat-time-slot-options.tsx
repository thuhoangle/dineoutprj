import { DatePicker, Radio, RadioGroup } from '@heroui/react';
import { DateValue, getLocalTimeZone, today } from '@internationalized/date';

import { getWeekdayName } from '@/utils';

export const RepeatTimeSlotOptions = ({
  selectedDate,
  repeatOption,
  setRepeatOption,
  repeatUntil,
  setRepeatUntil,
}: {
  selectedDate: DateValue | null;
  repeatOption: RepeatOption;
  setRepeatOption: (option: RepeatOption) => void;
  repeatUntil: DateValue | null;
  setRepeatUntil: (until: DateValue | null) => void;
}) => {
  return (
    <div className="border p-3 rounded-md">
      <div className="font-medium mb-2 text-[14px]">Repeat</div>
      <RadioGroup size="sm" value={repeatOption} onValueChange={(value) => setRepeatOption(value as RepeatOption)}>
        <Radio value="none">Don't repeat</Radio>
        <Radio value="daily">Every day</Radio>
        <Radio value="weekly">
          Weekly on {selectedDate ? getWeekdayName(new Date(selectedDate.toString()).getDay()) : 'selected day'}
        </Radio>
      </RadioGroup>

      {repeatOption !== 'none' && (
        <div className="mt-3" onClick={(e) => e.stopPropagation()}>
          <DatePicker
            minValue={selectedDate ? selectedDate.add({ days: 1 }) : (today(getLocalTimeZone()) as any)}
            className="max-w-[284px]"
            label="Repeat Until"
            labelPlacement="outside"
            selectorButtonPlacement="start"
            value={repeatUntil as any}
            onChange={(value) => setRepeatUntil(value as unknown as DateValue)}
          />
        </div>
      )}
    </div>
  );
};
export type RepeatOption = 'none' | 'daily' | 'weekly';
