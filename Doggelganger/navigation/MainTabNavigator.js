import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // 6.2.2
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';


import HomeScreen from '../screens/HomeScreen';
import CameraScreen from '../screens/CameraScreen';
import FavoritesScreen from '../screens/FavoritesScreen';

const getTabBarIcon = (navigation, focused, tintColor) => {
  const { routeName } = navigation.state;
  let IconComponent = MaterialCommunityIcons;
  let iconName;
  if (routeName === 'Home') {
    iconName = `paw`;
  } else if (routeName === 'Camera') {
    iconName = `camera`;
  } else if (routeName === 'Favorites') {
    iconName = `star`;
  }
  return <IconComponent name={iconName} size={30} color={tintColor} />;
};

export default createAppContainer(
  createBottomTabNavigator(
    {
      Home: { screen: HomeScreen },
      Camera: { screen: CameraScreen },
      Favorites: { screen: FavoritesScreen }
    },
    {
      defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) =>
        getTabBarIcon(navigation, focused, tintColor)
      }),
      tabBarOptions: {
        activeTintColor: '#4C55FF',
        inactiveTintColor: '#B29623',
        style: {
          backgroundColor: '#FFDB4C',
          height: 60
        }
      },
    }
  )
);
