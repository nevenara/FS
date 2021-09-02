import React, { useState, useEffect } from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';

import { COLOR } from '../../screens/constants';

const styles = StyleSheet.create({
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 20,
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingTop: 5,
    paddingRight: 5,
    paddingBottom: 5,
    paddingLeft: 0,
    backgroundColor: '#fff',
    color: '#424242',
    marginRight: 5,
  },
});

const SearchInput = (props) => {
  const {
    value,
    setValue,
    getList,
  } = props;

  const keyboardHide = () => {
    getList();
  };

  useEffect(() => {
    // Keyboard.addListener('keyboardDidShow', keyboardShow);
    Keyboard.addListener('keyboardDidHide', keyboardHide);

    // cleanup function
    return () => {
      // Keyboard.removeListener('keyboardDidShow', keyboardShow);
      Keyboard.removeListener('keyboardDidHide', keyboardHide);
    };
  }, []);

  return (
    <View style={styles.searchSection}>
        <Ionicons style={styles.searchIcon} name="search" size={20} color={COLOR.DARK_GRAY} />
        <TextInput
            style={styles.input}
            placeholder="Search.."
            onChangeText={setValue}
            value={value}
            underlineColorAndroid="transparent"
        />
    </View>
  );
};

SearchInput.propTypes = {
  getList: PropTypes.func,
  value: PropTypes.string,
  setValue: PropTypes.func,
};

export default SearchInput;
