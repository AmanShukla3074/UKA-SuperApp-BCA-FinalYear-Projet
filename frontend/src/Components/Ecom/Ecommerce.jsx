import React from 'react';
import {SubNavEC} from '../index';
import { Outlet} from 'react-router-dom';
const Ecommerce = () => {
  return (
    <div>
      <SubNavEC />
      <Outlet />
    </div>
  );
};

export default Ecommerce;
