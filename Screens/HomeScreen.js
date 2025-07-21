import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import ChallengesScreen from './Tabs/ChallengesScreen/ChallengesScreen';
import RankingScreen from './Tabs/RankingScreen';
import ConfigurationScreen from './Tabs/ConfigurationScreen/ConfigurationScreen';

const Tab = createBottomTabNavigator();
const logo = require('../assets/logo.png');

export default function HomeScreen() {
   const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      {/* Header fijo */}
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>DailyChallenges</Text>
       <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Avatar.Icon size={36} icon="account" color="#36a2c1" style={styles.avatar} />
        </TouchableOpacity>
      </View>

      {/* Bottom tabs */}
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#36a2c1',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { backgroundColor: '#fafafb', borderTopWidth: 1, borderTopColor: '#eee' },
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Challenges') iconName = 'flag-checkered';
            else if (route.name === 'Ranking') iconName = 'trophy';
            else if (route.name === 'Configuration') iconName = 'cog';

            return <Icon name={iconName} color={color} size={size} />;
          },
        })}
      >
        <Tab.Screen name="Challenges" component={ChallengesScreen} />
        <Tab.Screen name="Ranking" component={RankingScreen} />
        <Tab.Screen name="Configuration" component={ConfigurationScreen} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafb' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 4,
  },
  logo: { width: 60, height: 60, resizeMode: 'contain' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#36a2c1' },
  avatar: { backgroundColor: '#e0f7fa' },
});
