import { BigWidget } from '@/components/big-widget';
import { TextField } from '../../../components/text';
import { FaRegMoon } from 'react-icons/fa';
import { RestaurantData } from '@/interface';

export const HorizontalSection = ({
  title,
  dataList,
}: {
  title: string;
  dataList: RestaurantData[];
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-1 justify-between">
        <TextField preset="h3" className="flex gap-1 items-center" weight="b">
          <FaRegMoon className="w-10 h-auto text-red-500" />
          {title}
        </TextField>
      </div>
      <div className="flex gap-4 overflow-x-scroll">
        {dataList.map((data: RestaurantData) => (
          <BigWidget
            key={data.id}
            className="pb-5"
            data={data}
            onClick={() => {}}
          />
        ))}
      </div>
    </div>
  );
};
