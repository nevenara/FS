/* eslint-disable import/prefer-default-export */
export const getIsAuth = (state) => state.get('isAuth');
export const getIsCameraOpen = (state) => state.get('isCameraOpen');
export const eventDetails = (state) => state.get('eventDetails');
export const qrInfo = (state) => state.get('qrInfo');
export const getListInfo = (state) => state.get('list').toJS();
export const getErrors = (state) => state.get('errors').toJS();
export const getListCurrentPage = (state) => state.get('listCurrentPage');
export const getLoading = (state) => state.get('loading');
export const getTextSearch = (state) => state.get('textSearch');
export const getLastTextSearch = (state) => state.get('lastSearch');
export const getEventImage = (state) => state.get('eventImage');
