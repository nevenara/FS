import {
  takeEvery,
  put,
  call,
  select,
} from 'redux-saga/effects';

import {
  API_LOGIN,
  API_LOGOUT,
  API_EVENT_DETAILS,
  API_SCAN_CODE,
  API_QR_INVALID,
  API_NO_FACEMATCH,
  API_SEARCH,
  API_EVENT_IMAGE,
} from './constants';
import request from '../utils/fetch';
import { setSessionCookie, getSessionCookie, clearSessionCookie } from '../utils/cookies';
import {
  LOGIN,
  SET_AUTH,
  SIGN_OUT,
  SIGN_OUT_ACTION,
  GET_EVENT_DETAILS,
  SET_EVENT_DETAILS,
  QR_SCAN,
  SET_QR_INFO,
  QR_INVALID,
  NO_FACEMATCH,
  SEARCH_LIST,
  SET_LIST,
  ERROR_LOGIN,
  ERROR_QR_INVALID,
  SET_LOADING,
  SET_LAST_TEXT_SEARCH,
} from './reducer';
import {
  getTextSearch,
  getListCurrentPage,
  getLastTextSearch,
} from './selectors';

function* login(action) {
  yield put({ type: SET_LOADING, payload: { isLoading: true } });
  try {
    clearSessionCookie();
    const { username, event } = action.payload;

    const body = {
      email: username,
      eventId: event,
    };

    const options = {
      method: 'POST',
      body: JSON.stringify(body),
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = yield call(request, API_LOGIN, options);

    if (response) {
      yield put({ type: SET_LOADING, payload: { isLoading: false } });
      setSessionCookie(response.sessionId);

      yield put({
        type: SET_AUTH,
        payload: {
          isAuth: true,
        },
      });

      yield put({ type: GET_EVENT_DETAILS });
    }
  } catch (error) {
    console.log(error);
    yield put({ type: ERROR_LOGIN, payload: { loginError: true } });
    yield put({ type: SET_LOADING, payload: { isLoading: false } });
  }
}

function* signOut(action) {
  try {
    const cookie = yield getSessionCookie();
    const options = {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        Cookie: `fansafe-session=${cookie}`,
      },
    };

    yield put({
      type: SIGN_OUT,
      payload: {
        isAuth: false,
      },
    });

    yield call(fetch, API_LOGOUT, options);
  } catch (error) {
    console.warn(error);
  }
}

function* getEventDetails() {
  yield put({ type: SET_LOADING, payload: { isLoading: true } });
  try {
    const cookie = yield getSessionCookie();

    const options = {
      headers: {
        Cookie: `fansafe-session=${cookie}`,
      },
    };

    const eventImage = {
      uri: API_EVENT_IMAGE,
      method: 'GET',
      headers: {
        Cookie: `fansafe-session=${cookie}`,
      },
    };

    const response = yield call(request, API_EVENT_DETAILS, options);

    yield put({
      type: SET_EVENT_DETAILS,
      payload: {
        eventDetails: response,
        eventImage,
      },
    });
    yield put({ type: SET_LOADING, payload: { isLoading: false } });
  } catch (error) {
    console.warn(error);
    yield put({ type: SET_LOADING, payload: { isLoading: false } });
  }
}

function* qrScan(action) {
  try {
    const { qrUuid } = action.payload;
    const body = {
      qrUuid,
    };

    const cookie = yield getSessionCookie();

    const options = {
      method: 'POST',
      body: JSON.stringify(body),
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `fansafe-session=${cookie}`,
      },
    };

    const response = yield call(request, API_SCAN_CODE, options);
    if (response) {
      yield put({
        type: SET_QR_INFO,
        payload: {
          qrInfo: response,
        },
      });
      // if (response.verificationStatus === 'invalid') {
      //   yield put({ type: ERROR_QR_INVALID, payload: { qrInvalid: true } });
      // }
    }
  } catch (error) {
    yield put({ type: QR_INVALID });
    yield put({ type: ERROR_QR_INVALID, payload: { qrInvalid: true } });
    console.log(error);
  }
}

function* qrInvalid() {
  try {
    const cookie = yield getSessionCookie();

    const options = {
      headers: {
        Cookie: `fansafe-session=${cookie}`,
      },
    };

    yield call(request, API_QR_INVALID, options);
  } catch (error) {
    console.log(error);
  }
}

function* noFacematch(action) {
  try {
    const { checkInId } = action.payload;
    const body = {
      checkInId,
    };

    const cookie = yield getSessionCookie();

    const options = {
      method: 'POST',
      body: JSON.stringify(body),
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `fansafe-session=${cookie}`,
      },
    };

    yield call(request, API_NO_FACEMATCH, options);
  } catch (error) {
    console.log(error);
  }
}

function* searchList(action) {
  try {
    const search = action?.payload?.search;
    const textSearch = yield select(getTextSearch);
    const lastSearch = yield select(getLastTextSearch);

    if (search && textSearch === lastSearch) {
      return;
    }

    const page = yield select(getListCurrentPage);
    yield put({ type: SET_LOADING, payload: { isLoading: true } });

    const body = {
      textSearch,
      page: search ? 1 : page,
      limit: 15,
    };

    const options = {
      method: 'POST',
      body: JSON.stringify(body),
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = yield call(request, API_SEARCH, options);

    if (response) {
      const { checkIns, totalPages, totalRecords } = response;

      yield put({
        type: SET_LIST,
        payload: {
          checkIns,
          totalPages,
          totalRecords,
          search,
        },
      });

      yield put({
        type: SET_LAST_TEXT_SEARCH,
        payload: {
          lastSearch: textSearch,
        },
      });
    }
    yield put({ type: SET_LOADING, payload: { isLoading: false } });
  } catch (error) {
    console.log(error);
    yield put({ type: SET_LOADING, payload: { isLoading: false } });
  }
}

export default function* appSaga() {
  yield takeEvery(LOGIN, login);
  yield takeEvery(SIGN_OUT_ACTION, signOut);
  yield takeEvery(GET_EVENT_DETAILS, getEventDetails);
  yield takeEvery(QR_SCAN, qrScan);
  yield takeEvery(QR_INVALID, qrInvalid);
  yield takeEvery(NO_FACEMATCH, noFacematch);
  yield takeEvery(SEARCH_LIST, searchList);
}
