import clsx from 'clsx';

export const SimpleLoading = ({
  size = 30,
  loadingColor = '#eee',
  backgroundColor = '#555',
  spinTime = 1,
  thickness = 3,
  className,
}: {
  size?: number;
  loadingColor?: string;
  backgroundColor?: string;
  thickness?: number;
  spinTime?: number;
  className?: string;
}) => {
  return (
    <div className={clsx('flex items-center justify-center', className)}>
      <style>{`
        @keyframes spin {
             0% { transform: rotate(0deg); }
             100% { transform: rotate(360deg); }
        }
    `}</style>
      <div
        style={{
          position: 'relative',
          animation: `spin ${spinTime}s linear infinite`,
        }}
      >
        <div
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            border: `${thickness}px solid`,
            borderColor: `${loadingColor} ${backgroundColor} ${backgroundColor} ${backgroundColor}`,
          }}
        />
      </div>
    </div>
  );
};
