import type { FC } from 'react';

import CircleLg from './svg/circle-lg.svg';
import CircleMd from './svg/circle-md.svg';
import CircleSm from './svg/circle-sm.svg';

import GridDotLg from './svg/grid-dot-lg.svg';
import GridDotMd from './svg/grid-dot-md.svg';
import GridDotSm from './svg/grid-dot-sm.svg';

import GridLg from './svg/grid-lg.svg';
import GridMd from './svg/grid-md.svg';
import GridSm from './svg/grid-sm.svg';

import GridSmallDotLg from './svg/grid-small-dot-lg.svg';
import GridSmallDotMd from './svg/grid-small-dot-md.svg';
import GridSmallDotSm from './svg/grid-small-dot-sm.svg';

// import { ReactComponent as PatternGridDotMdM } from './svg/grid-dot-md-m.svg';
// import { ReactComponent as PatternGridDotSmM } from './svg/grid-dot-sm-m.svg';
// import { ReactComponent as PatternGridDotMdD } from './svg/grid-dot-md-d.svg';
// import { ReactComponent as PatternGridDotSmD } from './svg/grid-dot-sm-d.svg';

export interface BgPatternProps {
  name: 'circle' | 'gridDot' | 'grid' | 'gridSmallDot';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
export const BgPattern: FC<BgPatternProps> = ({ name, size, ...rest }) => {
  const sizeStyle = {
    width: size === 'sm' ? 336 : size === 'md' ? '448' : 768,
    height: size === 'sm' ? 336 : size === 'md' ? '448' : 768,
  };
  switch (name) {
    case 'circle':
      if (size === 'lg') return <CircleLg style={sizeStyle} {...rest} />;
      if (size === 'md') return <CircleMd style={sizeStyle} {...rest} />;
      return <CircleSm style={sizeStyle} {...rest} />;

    case 'gridDot':
      if (size === 'lg') return <GridDotLg style={sizeStyle} {...rest} />;
      if (size === 'md') return <GridDotMd style={sizeStyle} {...rest} />;
      return <GridDotSm style={sizeStyle} {...rest} />;

    case 'grid':
      if (size === 'lg') return <GridLg style={sizeStyle} {...rest} />;
      if (size === 'md') return <GridMd style={sizeStyle} {...rest} />;
      return <GridSm style={sizeStyle} {...rest} />;

    case 'gridSmallDot':
      if (size === 'lg') return <GridSmallDotLg style={sizeStyle} {...rest} />;
      if (size === 'md') return <GridSmallDotMd style={sizeStyle} {...rest} />;
      return <GridSmallDotSm style={sizeStyle} {...rest} />;

    // case 'patternGridDot':
    //   if (mode === 'm') {
    //     if (size === 'md') return <PatternGridDotMdM {...rest} />;
    //     return <PatternGridDotSmM {...rest} />;
    //   }
    //   if (size === 'sm') return <PatternGridDotMdD {...rest} />;
    //   return <PatternGridDotSmD {...rest} />;

    default:
      return null;
  }
};
