import React from 'react';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';

import { COLOR } from '../../screens/constants';

const Burger = (props) => (
    <View>
        <TouchableOpacity onPress={props.openMenu}>
          <Ionicons name="menu-outline" size={40} color={COLOR.BLUE} />
        </TouchableOpacity>
    </View>
);

Burger.propTypes = {
  openMenu: PropTypes.func,
};

export default Burger;
