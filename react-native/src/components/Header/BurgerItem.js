import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import { COLOR } from '../../screens/constants';
import { getPageIcon } from '../../utils/RootNavigation';

const styles = StyleSheet.create({
  itemStyle: {
    padding: 5,
    borderColor: 'black',
    borderWidth: 1,
    margin: 2,
    width: 150,
    height: 33,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: 60,
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  defaultItem: {
    backgroundColor: COLOR.WHITE,
  },
  defaultText: {
    color: COLOR.BLUE,
  },
  activeItem: {
    backgroundColor: COLOR.BLUE,
  },
  activeText: {
    color: COLOR.WHITE,
  },
});
const BurgerItem = (props) => {
  const { name, route, isCurrent } = props;

  const getBackgroundStyle = () => {
    if (isCurrent) {
      return styles.activeItem;
    }
    return styles.defaultItem;
  };

  const getTextStyle = () => {
    if (isCurrent) {
      return styles.activeText;
    }
    return styles.defaultText;
  };

  return (
    <TouchableOpacity onPress={() => props.changePage(route)}>
        <View style={[styles.itemStyle, getBackgroundStyle()]}>
          <View style={ styles.itemContainer}>
            {getPageIcon(name, !isCurrent && COLOR.BLUE)}
            <Text style={getTextStyle()}>{name}</Text>
          </View>
        </View>
    </TouchableOpacity>
  );
};

BurgerItem.propTypes = {
  name: PropTypes.string,
  route: PropTypes.string,
  changePage: PropTypes.func,
  isCurrent: PropTypes.bool,
};

export default BurgerItem;
