import React from 'react';
import {SubNavMB} from '../index';
import { Outlet} from 'react-router-dom';
const MovieBooking = () => {
  return (
    <div>
      <SubNavMB />
      <Outlet />
       {/* <Outlet>
        <SubNavMB />
      </Outlet>
      <Outlet /> */}
    </div>
  );
};

export default MovieBooking;
