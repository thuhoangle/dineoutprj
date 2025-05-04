import { useWindowContext } from '@/contexts/window-context';

export const OverlayBlockMobileMode = () => {
  const { isMobileMode } = useWindowContext();

  if (!isMobileMode) return null;
  return (
    <div className="fixed top-0 z-50 flex h-full w-full flex-col items-center justify-center bg-black/20 backdrop-blur-md ipadMini:hidden">
      <div className="flex w-full max-w-sm flex-col items-center justify-center gap-2 rounded-xl bg-neutral-900 p-6 text-center">
        <div className="text-white text-2xl font-semibold">
          Mobile mode isn't available yet
        </div>
        <div className="text-white text-sm">
          We recommend using the desktop version for managing your business
          until the mobile mode is available. Thank you for your patience.
        </div>
      </div>
    </div>
  );
};
