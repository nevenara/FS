import React from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';

import { COLOR } from '../../screens/constants';

const EventText = (props) => (
        <Text
            style={{
              color: props.color == null ? COLOR.WHITE : props.color,
              fontSize: props.fontSize ? props.fontSize : 15,
              padding: props.padding ? props.padding : 0,
            }}
         >
            {props.children}
         </Text>
);

EventText.propTypes = {
  fontSize: PropTypes.number,
  padding: PropTypes.number,
  color: PropTypes.string,
  children: PropTypes.node,
};

export default EventText;
