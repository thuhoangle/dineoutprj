import { Button, PageWithHeader, TextField } from '../../../components';

export const OverviewSection = ({ description }: { description: string }) => {
  return (
    <div className="flex flex-col gap-2">
      <TextField preset="h5" weight="b" text="Overview" />
      <TextField preset="p1" text={description} />
    </div>
  );
};
