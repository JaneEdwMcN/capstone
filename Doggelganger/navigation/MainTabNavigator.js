import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // 6.2.2
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';


import HomeScreen from '../screens/HomeScreen';
import CameraScreen from '../screens/CameraScreen';

import PropTypes from 'prop-types';

class IconWithBadge extends React.Component {
  render() {
    const { name, color, size } = this.props;
    return (
      <View style={{ width: 24, height: 24, margin: 5 }}>
      <Ionicons name={name} size={size} color={color} />
      </View>
    );
  }
}

const HomeIconWithBadge = props => {
  return <IconWithBadge {...props} />;
};

const getTabBarIcon = (navigation, focused, tintColor) => {
  const { routeName } = navigation.state;
  let IconComponent = Ionicons;
  let iconName;
  if (routeName === 'Home') {
    iconName = `ios-information-circle${focused ? '' : '-outline'}`;
    // We want to add badges to home tab icon
    IconComponent = HomeIconWithBadge;
  } else if (routeName === 'Camera') {
    iconName = `ios-camera`;
  } else if (routeName === 'Links') {
    iconName = `ios-star`;
  }

  // You can return any component that you like here!
  return <IconComponent name={iconName} size={25} color={tintColor} />;
};



export default createAppContainer(
  createBottomTabNavigator(
    {
      Home: { screen: HomeScreen },
      Camera: { screen: CameraScreen }
    },
    {
      defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) =>
        getTabBarIcon(navigation, focused, tintColor)
      }),
      tabBarOptions: {
        activeTintColor: 'purple',
        inactiveTintColor: 'gray',
      },
    }
  )
);

IconWithBadge.propTypes = {
  name: PropTypes.any,
  color: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired
};
