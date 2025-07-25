import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FriendsListScreen from './Friends/FriendsListScreen';
/*import GroupsScreen from './Groups/GroupsScreen';*/
import { View, Text, StyleSheet } from 'react-native';

const Tab = createMaterialTopTabNavigator();

const FriendsAndRankingScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#fafafb' }}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#36a2c1',
          tabBarLabelStyle: { fontWeight: 'bold' },
          tabBarIndicatorStyle: { backgroundColor: '#36a2c1', height: 3 },
          tabBarStyle: { backgroundColor: '#fff' },
        }}
      >
        <Tab.Screen name="Friends" component={FriendsListScreen} />
     
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    color: '#36a2c1',
    paddingVertical: 16,
    backgroundColor: '#fafafb',
  },
});

export default FriendsAndRankingScreen;
