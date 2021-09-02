import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Overlay } from 'react-native-elements';

import { COLOR } from '../constants';
import { eventDetails, getLoading, getEventImage } from '../selectors';
import EventText from '../../components/EventText';
import { getEventDetails } from '../reducer';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.DARK_GRAY,
    width: '100%',
    height: '100%',
  },
  loadingIndicator: {
    backgroundColor: 'rgba(52, 52, 52, 0)',
    elevation: 0,
    shadowColor: 'rgba(52, 52, 52, 0)',
  },
  containerContent: {
    width: '90%',
    height: '100%',
    left: '5%',
  },
  imageContainer: {
    height: '40%',
    width: '100%',
    marginTop: '3%',
  },
  image: {
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    paddingTop: 10,
  },
  infoTab: {
    padding: 5,
    paddingLeft: 0,
    width: '80%',
  },
});

const EventDetails = () => {
  const [event, setEvent] = useState(null);
  const imagePath = require('../../../assets/metalica.jpg');
  const dispatch = useDispatch();

  const Selector = {
    eventDetails: useSelector((state) => eventDetails(state)),
    loading: useSelector((state) => getLoading(state)),
    eventImage: useSelector((state) => getEventImage(state)),
  };

  const Action = {
    getEventDetails: () => dispatch(getEventDetails()),
  };

  useEffect(() => {
    if (!Selector.eventDetails) {
      Action.getEventDetails();
    }

    setEvent({
      ...Selector.eventDetails,
      date: new Date(Selector.eventDetails.date),
      beginTime: new Date(Selector.eventDetails.beginTime),
    });
  }, []);

  const addZeroToTime = (date) => {
    if (date < 10) {
      return `0${date}`;
    }
    return date;
  };
  // eslint-disable-next-line prefer-template
  const formatDate = (date) => `${addZeroToTime(date.getDate())}/${addZeroToTime(date.getMonth() + 1)}/${date.getFullYear()} ${addZeroToTime(date.getHours() + 1)}:${addZeroToTime(date.getMinutes())}`;

  return (
    <View style={styles.container}>
      <View style={styles.containerContent}>
        <Overlay overlayStyle={styles.loadingIndicator} isVisible={Selector.loading}>
          <View>
            <ActivityIndicator size="large" color={COLOR.BLUE} />
          </View>
        </Overlay>
        <View style={styles.imageContainer}>
          <Image
            source={Selector.eventImage ?? imagePath}
            style={styles.image}
            resizeMethod="resize"
          />
        </View>
        <Text style={{ color: 'white', fontSize: 10 }}>Event ID:{event && event.eventId}</Text>
        <ScrollView style={styles.infoContainer}>
          <View style={styles.infoTab}>
            <Text style={{ color: 'white', fontSize: 20 }}>{event && event.eventName}</Text>
          </View>
          <View style={styles.infoTab}>
            <EventText>Date: {event && formatDate(event.date).split(' ')[0]}</EventText>
            <EventText>Begin: {event && formatDate(event.beginTime).split(' ')[1]}</EventText>
            <EventText>Doors open: {event && event.doorsOpen}</EventText>
          </View>
          <View style={styles.infoTab}>
            <EventText>Event Location: {event && event.locationName}</EventText>
            <EventText>{event && event.locationAddress}</EventText>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default EventDetails;
