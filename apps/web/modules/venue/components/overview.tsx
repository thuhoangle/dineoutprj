import { TextField } from '../../../components';

export const OverviewSection = ({ description }: { description: string }) => {
  return (
    <div className="flex flex-col gap-2 mb-5">
      <TextField preset="h5" weight="b" text="Overview" />
      <TextField preset="p2" text={description} />
    </div>
  );
};
