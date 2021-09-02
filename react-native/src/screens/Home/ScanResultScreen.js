import React, { useEffect, useState } from 'react';
import {
  Modal, View, StyleSheet, Image, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import { useDispatch, useSelector } from 'react-redux';
import EventText from '../../components/EventText';
import {
  API_SELFIE_IMAGE, COLOR, NO_FACEMATCH, NO_MATCH,
} from '../constants';
import { qrInfo } from '../selectors';
import { getSessionCookie } from '../../utils/cookies';
import { postNoFacematch, setQrInfo } from '../reducer';

const styles = StyleSheet.create({
  modalContainer: {
    width: '90%',
    left: '5%',
    height: '75%',
    top: '20%',
    backgroundColor: COLOR.DARK_GRAY,
    borderColor: COLOR.BLUE,
    borderWidth: 1,
  },
  headerContainer: {
    width: '90%',
    height: '35%',
    left: '5%',
  },
  rowContainer: {
    flexDirection: 'row',
    paddingTop: 3,
  },
  rowInfo: {
    width: '50%',
  },
  imageContainer: {
    width: '80%',
    height: '50%',
    left: '10%',
  },
  image: {
    width: '100%',
    height: '100%',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 15,
  },
  buttonStyle: {
    width: '35%',
    alignItems: 'center',
    margin: 10,
    padding: 3,
  },
  commandsContainer: {
    flexDirection: 'row',
    height: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const ScanResultScreen = (props) => {
  const imagePath = require('../../../assets/noImage.png');
  const dispatch = useDispatch();
  const [qrInfoState, setQrInfoState] = useState(null);
  const [selfieImageSrc, setSelfieImageSrc] = useState(null);

  const Selector = {
    qrInfo: useSelector((state) => qrInfo(state)),
  };

  const Action = {
    noFacematch: (payload) => dispatch(postNoFacematch(payload)),
    setQrInfo: (payload) => dispatch(setQrInfo(payload)),
  };

  useEffect(() => {
    if (Selector.qrInfo) {
      setQrInfoState(Selector.qrInfo);
      getSessionCookie().then((cookie) => {
        const uri = `${API_SELFIE_IMAGE}?ticketId=${Selector.qrInfo.id}`;
        setSelfieImageSrc({
          uri,
          method: 'GET',
          header: {
            Cookie: `fansafe-session=${cookie}`,
          },
        });
      });
    }
    return function cleanup() {
      if (Selector.qrInfo !== null) {
        Action.setQrInfo({ qrInfo: null });
      }
    };
  }, [Selector.qrInfo]);

  const headerElement = (data, color) => (
    <View style={styles.rowInfo}>
      <EventText color={color}>{data}</EventText>
    </View>
  );

  const noFacematch = () => {
    Action.noFacematch({ checkInId: qrInfoState.checkInId });
    setQrInfoState({
      ...qrInfoState,
      verificationStatus: 'invalid',
      reason: NO_FACEMATCH,
    });
  };

  const renderName = () => (
    [
      <View key={0} style={styles.rowContainer}>
        {headerElement('First name', COLOR.BLUE)}
        {headerElement(qrInfoState.firstName, COLOR.WHITE)}
      </View>,
      <View key={1} style={styles.rowContainer}>
        {headerElement('Last name', COLOR.BLUE)}
        {headerElement(qrInfoState.lastName, COLOR.WHITE)}
      </View>,
    ]
  );

  const renderBody = () => (
    <View style={styles.modalContainer}>
      <View style={styles.headerContainer}>
        {qrInfoState && qrInfoState.reason !== NO_MATCH
          ? <View style={styles.rowContainer}>
            {headerElement('Ticket ID: ', COLOR.BLUE)}
            {headerElement(qrInfoState && qrInfoState.ticketId, COLOR.WHITE)}
          </View> : null}
        <View style={styles.rowContainer}>
          {headerElement('Verification Status: ', COLOR.BLUE)}
          {headerElement(qrInfoState && qrInfoState.verificationStatus, qrInfoState && qrInfoState.verificationStatus === 'valid' ? COLOR.GREEN : COLOR.RED)}
        </View>
        {qrInfoState && qrInfoState.verificationStatus !== 'valid'
          ? <View style={styles.rowContainer}>
            {headerElement('Reason: ', COLOR.BLUE)}
            {headerElement(qrInfoState && qrInfoState.reason, COLOR.RED)}
          </View>
          : null}
        {qrInfoState && qrInfoState.reason !== NO_MATCH
          ? renderName() : null}
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={selfieImageSrc ?? imagePath}
          style={styles.image}
          resizeMethod="resize"
        />
      </View>
      {qrInfoState && qrInfoState.verificationStatus === 'valid'
        ? <View style={styles.commandsContainer}>
          <TouchableOpacity
            onPress={props.closeResultScreen}
            style={[styles.buttonStyle, { backgroundColor: COLOR.GREEN }]}>
            <EventText>Ok</EventText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={noFacematch}
            style={[styles.buttonStyle, { backgroundColor: COLOR.RED }]}>
            <EventText>No facematch</EventText>
          </TouchableOpacity>
        </View>
        : <View style={styles.commandsContainer}>
          <TouchableOpacity
            onPress={props.closeResultScreen}
            style={[styles.buttonStyle, { backgroundColor: COLOR.GREEN }]}>
            <EventText>Continue</EventText>
          </TouchableOpacity>
        </View>
      }
    </View>
  );

  return (
    <Modal visible={props.show} transparent={true} onRequestClose={props.closeResultScreen}>
      {qrInfoState ? renderBody() : null}
    </Modal>
  );
};

ScanResultScreen.propTypes = {
  ticketData: PropTypes.object,
  show: PropTypes.bool,
  closeResultScreen: PropTypes.func,
};

export default ScanResultScreen;
