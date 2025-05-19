import { TextField } from '@/components/text';
import { ReservationInfo } from '@/services';
import { Button, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, Textarea } from '@heroui/react';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { FaStar } from 'react-icons/fa6';
import { upperFirst } from 'lodash';
import { useState } from 'react';
import { useFeedback } from '@/hooks';

interface DrawerFeedbackProps {
  data: ReservationInfo;
  isOpen: boolean;
  onOpenChange: () => void;
  onClose?: () => void;
}
export const DrawerFeedback = ({ data, isOpen, onOpenChange, onClose }: DrawerFeedbackProps) => {
  const { sendFeedback, fetching, comment, setRating, setComment } = useFeedback();

  const _handleSendFeedback = async () => {
    await sendFeedback(data.restaurant_id);
    onClose?.();
  };
  return (
    <Drawer
      size="md"
      placement="right"
      backdrop="opaque"
      className="bg-white"
      classNames={{
        base: 'data-[placement=right]:sm:m-2 data-[placement=left]:sm:m-2 rounded-medium',
      }}
      onClose={onClose}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <DrawerContent>
        <DrawerHeader className="text-xl flex items-center justify-between gap-2">
          Feedback {data.restaurants?.name}
        </DrawerHeader>
        <DrawerBody className="flex border-t border-border-default-700 flex-col gap-5 !p-0">
          <div className="flex pt-3 flex-col gap-3">
            <div className="text-lg px-5 font-medium">Reservation Details</div>
            <div className="flex border-t px-5 pt-3 border-border-default-700 flex-col gap-2">
              <InfoRow label="Date" value={dayjs(data.reservation_time).format('DD/MM/YYYY')} />
              <InfoRow label="Time" value={dayjs(data.reservation_time).format('HH:mm')} />
              <InfoRow label="Party Size" value={data.party_size.toString()} />
              {data.seat_type && <InfoRow label="Seating Type" value={upperFirst(data.seat_type)} />}
              <InfoRow label="Occasion" value={upperFirst(data.occasion) || 'None'} />
              {data.additional_info && <InfoRow label="Additional Info" value={data.additional_info} />}
            </div>
            <div className="flex border-t px-5 pt-3 border-border-default-700 flex-col gap-4">
              <div className="text-lg font-medium">How was your experience?</div>
              <StarRater onRate={setRating} />
              <Textarea
                placeholder="Write your feedback here"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>
        </DrawerBody>
        <DrawerFooter className="flex justify-between items-center gap-2">
          <Button className="w-full" color="primary" isLoading={fetching} size="md" onPress={_handleSendFeedback}>
            Send Feedback
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

const InfoRow = ({
  label,
  value,
  valueClassName,
  className,
}: {
  label: string;
  value?: string;
  valueClassName?: string;
  className?: string;
}) => {
  return (
    <>
      <div className={clsx('flex justify-between items-center gap-16', className)}>
        <TextField preset="p3" weight="m" text={label} />
        <TextField className={clsx('text-gray-500', valueClassName)} preset="p3" text={value} />
      </div>
    </>
  );
};

const StarRater = ({ onRate }: { onRate: (rating: number) => void }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number>(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = hovered !== null ? star <= hovered : star <= selected;
        return (
          <FaStar
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => {
              setSelected(star);
              onRate(star);
            }}
            className={clsx('w-10 h-10 cursor-pointer', isActive ? 'text-red-500' : 'text-gray-900')}
            key={star}
          />
        );
      })}
    </div>
  );
};
