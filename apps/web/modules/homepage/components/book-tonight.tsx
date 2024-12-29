import { TextField } from '../../../components/text';
import { FaRegMoon } from 'react-icons/fa';
export const BookTonight = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-1 justify-between">
        <TextField preset="h3" className="flex gap-1 items-end" weight="b">
          <FaRegMoon className="w-10 h-auto text-red-500" />
          Book Tonight
        </TextField>
      </div>
    </div>
  );
};
