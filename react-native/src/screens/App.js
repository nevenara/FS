/* eslint-disable react/display-name */
/* eslint-disable linebreak-style */
import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// screens
import HomeScreen from './Home';
import LoginScreen from './Login';
import EventDetails from './EventDetails';
import CheckInList from './CheckInList';

import { navigationRef } from '../utils/RootNavigation';
import Header from '../components/Header';
import * as appSelectors from './selectors';
import { ROUTES } from './constants';

const Stack = createStackNavigator();

const horizontalAnimation = {
  cardStyleInterpolator: ({ current, layouts }) => ({
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.width, 0],
          }),
        },
      ],
    },
  }),
};

export default function App() {
  const Selector = {
    isAuth: useSelector((state) => appSelectors.getIsAuth(state)),
  };

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          header: () => <Header />,
        }}
        initialRouteName={Selector.isAuth ? ROUTES.HOME.PATH : ROUTES.LOGIN.PATH}>
        {Selector.isAuth ? (
          <>
            <Stack.Screen name={ROUTES.HOME.PATH} component={HomeScreen} options={horizontalAnimation}/>
            <Stack.Screen name={ROUTES.EVENTDETAILS.PATH} component={EventDetails} options={horizontalAnimation}/>
            <Stack.Screen name={ROUTES.LIST.PATH} component={CheckInList} options={horizontalAnimation}/>
            <Stack.Screen name={ROUTES.LIST_FROM_SCANNER.PATH} component={CheckInList} options={horizontalAnimation}/>
          </>
        ) : (
          <>
            <Stack.Screen options={{ headerShown: false }} name={ROUTES.LOGIN.PATH} component={LoginScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
