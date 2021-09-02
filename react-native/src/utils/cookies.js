import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';

export const clearSessionCookie = () => {
    AsyncStorage.removeItem('fansafe-session');
};

export const setSessionCookie = (sessionId) => {
    try {
        AsyncStorage.setItem('fansafe-session', sessionId);
    } catch (error) {
        console.warn(error);
    }
};

export const getSessionCookie = () => {
    return AsyncStorage.getItem('fansafe-session').then((value) => value);
};
