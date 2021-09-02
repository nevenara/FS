/* eslint-disable no-unused-expressions */
import * as React from 'react';
import { Ionicons, Entypo } from '@expo/vector-icons';

import { ROUTES, COLOR } from '../screens/constants';

export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export function getPageIcon(page, color) {
  switch (page) {
    case ROUTES.HOME.NAME:
      return <Ionicons name="qr-code-outline" size={20} color={color || COLOR.WHITE} />;
    case ROUTES.LIST.NAME:
      return <Ionicons name="list" size={20} color={color || COLOR.WHITE} />;
    case ROUTES.EVENTDETAILS.NAME:
      return <Entypo name="ticket" size={20} color={color || COLOR.WHITE} />;
    default:
      return null;
  }
}
