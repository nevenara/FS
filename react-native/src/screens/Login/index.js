/* eslint-disable global-require */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  Button,
  View,
  StyleSheet,
  TextInput,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Overlay } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import { CommonActions } from '@react-navigation/native';

import { login, setLoginError } from '../reducer';
import { getIsAuth, getErrors, getLoading } from '../selectors';
import { COLOR, ROUTES } from '../constants';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
    flex: 1,
    backgroundColor: COLOR.DARK_GRAY,
    color: COLOR.WHITE,
  },
  loadingIndicator: {
    backgroundColor: 'rgba(52, 52, 52, 0)',
    elevation: 0,
    shadowColor: 'rgba(52, 52, 52, 0)',
  },
  header: {
    color: COLOR.BLUE,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 20,
  },
  buttonView: {
    marginHorizontal: '25%',
    marginBottom: screenHeight / 10,
  },
  textInputView: {
    marginBottom: 20,
  },
  textInput: {
    height: 40,
    backgroundColor: COLOR.WHITE,
    marginHorizontal: '10%',
    marginBottom: 20,
    borderColor: COLOR.BLUE,
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  loginSection: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  logo: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  // 2740 / 601 logo image
  logoImage: {
    width: screenWidth,
    height: (601 * screenWidth) / 2740,
    resizeMode: 'cover',
    marginTop: -(screenHeight / 2) + StatusBar.currentHeight,
  },
  backgroundImage: {
    width: screenWidth,
    height: screenHeight / 2,
    resizeMode: 'cover',
  },
});

const LoginScreen = ({ navigation }) => {
  const [username, onUsernameChange] = useState('');
  const [event, onEventChange] = useState('');

  const dispatch = useDispatch();

  const resetNavigationStack = CommonActions.reset({
    index: 0,
    routes: [
      { name: ROUTES.HOME.PATH },
    ],
  });

  const Selector = {
    isAuth: useSelector((state) => getIsAuth(state)),
    errors: useSelector((state) => getErrors(state)),
    loading: useSelector((state) => getLoading(state)),
  };

  const Action = {
    login: (payload) => dispatch(login(payload)),
    setLoginError: (payload) => dispatch(setLoginError(payload)),
  };

  useEffect(() => {
    if (Selector.isAuth) {
      navigation.navigate(ROUTES.HOME.PATH);
      navigation.dispatch(resetNavigationStack);
    }
  }, [Selector.isAuth]);

  useEffect(() => {
    if (Selector.errors.loginError) {
      Alert.alert(
        'Error',
        'Wrong userID or eventID!',
        [
          {
            text: 'Try again',
            onPress: () => Action.setLoginError({ loginError: false }),
          },
        ],
      );
    }
  }, [Selector.errors.loginError]);

  const logo = require('../../../assets/logo-v1.png');
  const backgroundImage = require('../../../assets/background.jpg');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={-(screenHeight / 10)}
      style={styles.container}
    >
      <Overlay overlayStyle={styles.loadingIndicator} isVisible={Selector.loading}>
        <View>
          <ActivityIndicator size="large" color={COLOR.BLUE}/>
        </View>
      </Overlay>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.loginSection}>
        <View style={styles.logo}>
          <Image
            source={backgroundImage}
            style={styles.backgroundImage}
          />
          <Image
            source={logo}
            style={styles.logoImage}
          />
        </View>
        <Text style={styles.header}>Sign-in</Text>
        <TextInput
          style={styles.textInput}
          value={username}
          placeholder='Enter UserID'
          keyboardType='email-address'
          onChangeText={(text) => onUsernameChange(text)}
        />
        <TextInput
          style={styles.textInput}
          value={event}
          placeholder='Enter EventID'
          onChangeText={(text) => onEventChange(text)}
        />
        <View style={styles.buttonView}>
          <Button
            title="Sign in"
            onPress={() => { Action.login({ username, event }); }}
          />
        </View>
      </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

LoginScreen.propTypes = {
  navigation: PropTypes.object,
};

export default LoginScreen;
