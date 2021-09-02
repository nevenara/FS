import React, { useState, useEffect, useCallback } from 'react';
import {
  Text,
  View,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import { Camera } from 'expo-camera';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import {
  openCamera, closeCamera, qrScan, setQrInvalidError,
} from '../reducer';
import { getIsCameraOpen, qrInfo, getErrors } from '../selectors';
import { COLOR } from '../constants';
import ScanResultScreen from './ScanResultScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.DARK_GRAY,
    justifyContent: 'center',
  },
  button: {
    marginHorizontal: '25%',
  },
  backButton: {
    marginHorizontal: '25%',
    marginTop: 50,
  },
  cameraView: {
    flex: 1,
    margin: '10%',
  },
});

const HomeScreen = () => {
  const dispatch = useDispatch();

  const [hasPermission, setHasPermission] = useState(null);
  const [num, setNum] = useState(0);
  const [showResultScreen, setShowResultScreen] = useState(false);
  let cameraRef;

  const Selector = {
    isCameraOpen: useSelector((state) => getIsCameraOpen(state)),
    qrInfo: useSelector((state) => qrInfo(state)),
    errors: useSelector((state) => getErrors(state)),
  };

  const Action = {
    openCamera: (payload) => dispatch(openCamera(payload)),
    closeCamera: (payload) => dispatch(closeCamera(payload)),
    qrScan: (payload) => dispatch(qrScan(payload)),
    setQrInvalidError: (payload) => dispatch(setQrInvalidError(payload)),
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, [Selector.isCameraOpen]);

  useEffect(() => {
    if (Selector.qrInfo !== null) {
      setShowResultScreen(true);
    }
  }, [Selector.qrInfo]);

  useEffect(() => {
    if (Selector.errors.qrInvalid) {
      Alert.alert(
        'Unidentified QR',
        'QR doesn\'t belong to this event.',
        [
          {
            text: 'OK',
            onPress: () => Action.setQrInvalidError({ qrInvalid: false }),
          },
        ],
      );
    }
  }, [Selector.errors.qrInvalid]);

  useFocusEffect(
    useCallback(() => () => Action.closeCamera(), []),
  );

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <View style={styles.container}><Text>No access to camera</Text></View>;
  }

  const qrCodeRecognized = ({ type, data }) => {
    Action.qrScan({ qrUuid: data });
    Action.closeCamera();
    setNum(num + 1);
  };

  const closeResultScreen = () => {
    setShowResultScreen(false);
    Action.openCamera();
  };

  return (
    <View
        style={styles.container}
    >
      {!Selector.isCameraOpen && <View
        style={styles.button}
      >
        <Button
          title="Start scan"
          onPress={() => Action.openCamera()}
        />
      </View>}
      {Selector.isCameraOpen && hasPermission && <View style={styles.cameraView}>
      <Camera
          ref={(ref) => {
            cameraRef = ref;
          }}
          style={{
            flex: 1,
            width: '100%',
          }}
          onBarCodeScanned={qrCodeRecognized}
        />
        <View style={styles.backButton}>
          <Button
            title="Back"
            onPress={() => Action.closeCamera()}
          />
        </View>
      </View>}
      <ScanResultScreen show={showResultScreen} closeResultScreen={() => closeResultScreen()}/>
    </View>
  );
};

export default HomeScreen;
