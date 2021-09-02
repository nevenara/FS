export const COLOR = {
  DARK_GRAY: '#273237',
  LIGHT_GRAY: '#dddddd',
  BLUE: '#09a1ce',
  GREEN: '#009e0f',
  RED: '#cf2a27',
  WHITE: '#fff',
};

export const ROUTES = {
  HOME: {
    PATH: 'Home',
    NAME: 'Scanner',
  },
  LOGIN: {
    PATH: 'Login',
    NAME: '',
  },
  EVENTDETAILS: {
    PATH: 'EventDetails',
    NAME: 'Event Details',
  },
  LIST: {
    PATH: 'CheckInList',
    NAME: 'Check-In List',
  },
  LIST_FROM_SCANNER: {
    PATH: 'ListFromScanner',
    NAME: 'Check-In List',
  },
};

const API_URL = 'http://fansafe-loadbalancer-1226084727.us-east-2.elb.amazonaws.com/fansafe/scanner/';
export const API_LOGIN = `${API_URL}login`;
export const API_LOGOUT = `${API_URL}logout`;
export const API_EVENT_DETAILS = `${API_URL}geteventdetails`;
export const API_EVENT_IMAGE = `${API_URL}eventImage`;
export const API_SCAN_CODE = `${API_URL}scancode`;
export const API_QR_INVALID = `${API_URL}qrinvalid`;
export const API_SELFIE_IMAGE = `${API_URL}selfieimage`;
export const API_NO_FACEMATCH = `${API_URL}nofacematch`;
export const API_SEARCH = `${API_URL}search`;

export const NO_MATCH = 'No Match Ticket ID / Name';
export const NO_FACEMATCH = 'No Facematch - manual check';

export const PERSONALIZED = 1;
export const CHECKED_IN = 8;
