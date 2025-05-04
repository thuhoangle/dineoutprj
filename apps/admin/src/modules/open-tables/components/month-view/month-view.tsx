'use client';

import React, { Fragment } from 'react';
import { MonthViewBox } from './month-view-box';
import { useDateStore } from '../../hooks';

export const MonthView = () => {
  const { twoDMonthArray } = useDateStore();
  return (
    <section className="grid grid-cols-7 grid-rows-5">
      {twoDMonthArray.map((row, i) => (
        <Fragment key={i}>
          {row.map((day, index) => (
            <MonthViewBox key={index} day={day} rowIndex={i} />
          ))}
        </Fragment>
      ))}
    </section>
  );
};
