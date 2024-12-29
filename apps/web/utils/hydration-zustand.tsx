'use client';
import React, { Fragment, useEffect, useState } from 'react';

interface HydrationZustandProps {
  children: React.ReactNode;
  className?: string;
}

export const HydrationZustand: React.FC<HydrationZustandProps> = ({
  children,
  className,
}) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated ? (
    className ? (
      <div className={className}>{children}</div>
    ) : (
      <Fragment>{children}</Fragment>
    )
  ) : null;
};
