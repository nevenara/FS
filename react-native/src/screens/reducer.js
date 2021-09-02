import { fromJS } from 'immutable';
import { createAction } from 'redux-actions';

export const LOGIN = 'APP@@LOGIN';
export const SET_AUTH = 'APP@@SET_AUTH';
export const SIGN_OUT = 'APP@@SIGN_OUT';
export const SIGN_OUT_ACTION = 'APP@@SIGN_OUT_ACTION';
export const OPEN_CAMERA = 'APP@@OPEN_CAMERA';
export const CLOSE_CAMERA = 'APP@@CLOSE_CAMERA';
export const GET_EVENT_DETAILS = 'APP@@GET_EVENT_DETAILS';
export const GET_EVENT_IMAGE = 'APP@@GET_EVENT_IMAGE';
export const NO_FACEMATCH = 'APP@NO_FACEMATCH';
export const SEARCH_LIST = 'APP@SEARCH_LIST';
export const GET_NEXT_PAGE = 'APP@GET_NEXT_PAGE';
export const SET_LOADING = 'APP@SET_LOADING';
export const SET_PAGE_DEFAULT = 'APP@@SET_PAGE_DEFAULT';
export const SET_TEXT_SEARCH = 'APP@@SET_TEXT_SEARCH';
export const SET_LAST_TEXT_SEARCH = 'APP@@SET_LAST_TEXT_SEARCH';
export const RESET_SERACH = 'APP@@RESET_SEARCH';

export const SET_EVENT_DETAILS = 'APP@SET_EVENT_DETAILS';

export const QR_SCAN = 'APP@QR_SCAN';
export const SET_QR_INFO = 'APP@SET_QR_INFO';
export const QR_INVALID = 'APP@QR_INVALID';
export const SET_LIST = 'APP@SET_LIST';

export const ERROR_LOGIN = 'APP@@ERROR_LOGIN';
export const ERROR_QR_INVALID = 'APP@@ERROR_QR_INVALID';

const initialState = fromJS({
  data: {},
  user: {},
  isAuth: false,
  isCameraOpen: false,
  eventDetails: null,
  eventImage: null,
  qrInfo: null,
  list: {
    checkIns: [],
    totalPages: 0,
    totalRecords: 0,
  },
  listCurrentPage: 1,
  errors: {
    loginError: false,
    qrInvalid: false,
  },
  textSearch: '',
  lastSearch: '',
  loading: false,
});

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_AUTH:
      return state.set('isAuth', action.payload.isAuth);
    case SIGN_OUT:
      return state
        .set('isAuth', action.payload.isAuth)
        .setIn(['list', 'checkIns'], [])
        .setIn(['list', 'totalPages'], 0)
        .setIn(['list', 'totalRecords'], 0)
        .set('textSearch', '')
        .set('lastSearch', '')
        .set('listCurrentPage', 1)
        .set('eventDetails', null)
        .setIn(['errors', 'loginError'], false)
        .setIn(['errors', 'qrInvalid'], false)
        .set('qrInfo', null);
    case OPEN_CAMERA:
      return state.set('isCameraOpen', true);
    case CLOSE_CAMERA:
      return state.set('isCameraOpen', false);
    case SET_EVENT_DETAILS:
      return state
        .set('eventDetails', action.payload.eventDetails)
        .set('eventImage', action.payload.eventImage);
    case SET_QR_INFO:
      return state.set('qrInfo', action.payload.qrInfo);
    case SET_LIST: {
      const list = state.getIn(['list', 'checkIns']);
      if (action.payload.search) {
        return state
          .setIn(['list', 'checkIns'], action.payload.checkIns)
          .setIn(['list', 'totalPages'], action.payload.totalPages)
          .setIn(['list', 'totalRecords'], action.payload.totalRecords)
          .set('listCurrentPage', 1);
      }
      return state
        .setIn(['list', 'checkIns'], [...list, ...action.payload.checkIns])
        .setIn(['list', 'totalPages'], action.payload.totalPages)
        .setIn(['list', 'totalRecords'], action.payload.totalRecords);
    }
    case ERROR_LOGIN:
      return state.setIn(['errors', 'loginError'], action.payload.loginError);
    case ERROR_QR_INVALID:
      return state.setIn(['errors', 'qrInvalid'], action.payload.qrInvalid);
    case GET_NEXT_PAGE: {
      const currentPage = state.get('listCurrentPage');
      const totalPages = state.getIn(['list', 'totalPages']);

      if (currentPage < totalPages) {
        return state.set('listCurrentPage', currentPage + 1);
      }
      return state.set('listCurrentPage', currentPage);
    }
    case SET_PAGE_DEFAULT: {
      return state.set('listCurrentPage', 1);
    }
    case SET_LOADING:
      return state.set('loading', action.payload.isLoading);
    case SET_TEXT_SEARCH:
      return state.set('textSearch', action.payload.textSearch);
    case SET_LAST_TEXT_SEARCH:
      return state.set('lastSearch', action.payload.lastSearch);
    case RESET_SERACH:
      return state
        .setIn(['list', 'checkIns'], [])
        .setIn(['list', 'totalPages'], 0)
        .setIn(['list', 'totalRecords'], 0)
        .set('textSearch', '')
        .set('lastSearch', '')
        .set('listCurrentPage', 1);
    default:
      return state;
  }
};

export default appReducer;

export const login = createAction(LOGIN);
export const signOut = createAction(SIGN_OUT_ACTION);
export const openCamera = createAction(OPEN_CAMERA);
export const closeCamera = createAction(CLOSE_CAMERA);
export const getEventDetails = createAction(GET_EVENT_DETAILS);
export const qrScan = createAction(QR_SCAN);
export const setQrInfo = createAction(SET_QR_INFO);
export const postNoFacematch = createAction(NO_FACEMATCH);
export const searchList = createAction(SEARCH_LIST);
export const getNextPage = createAction(GET_NEXT_PAGE);
export const setLoading = createAction(SET_LOADING);
export const setSearchText = createAction(SET_TEXT_SEARCH);
export const setLastSearchText = createAction(SET_LAST_TEXT_SEARCH);
export const restartSearch = createAction(RESET_SERACH);

export const setLoginError = createAction(ERROR_LOGIN);
export const setQrInvalidError = createAction(ERROR_QR_INVALID);
