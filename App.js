import React from 'react';
import { View, Text } from 'react-native';
import { Provider as PaperProvider, Button } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './Screens/SplashScreen';
import OnBoardingScreen from './Screens/OnBoardingScreen';
import LoginScreen from './Screens/LoginScreen';
import RegisterScreen from './Screens/RegisterScreen';
import PrivacyPolicyScreen from './Screens/Tabs/ConfigurationScreen/ConfigurationPrivacyPolicyScreen';
import ResetPasswordScreen from './Screens/ResetPasswordScreen';
import HomeScreen from './Screens/Tabs/HomeScreen';
import ChangeEmailScreen from './Screens/Tabs/ConfigurationScreen/ConfigurationChangeEmailScreen';
import ChangePasswordScreen from './Screens/Tabs/ConfigurationScreen/ConfigurationChangePasswordScreen';
import HelpScreen from './Screens/Tabs/ConfigurationScreen/ConfigurationHelpScreen';
import ChallengesDetailScreen from './Screens/Tabs/ChallengesScreen/ChallengesDetailScreen';
import ChallengesCompletedScreen from './Screens/Tabs/ChallengesScreen/ChallengesCompletedScreen';
import ProfileScreen from './Screens/ProfileScreen';
import PurchaseScreen from './Screens/PurchaseScreen';
import FriendProfileScreen from './Screens/Tabs/FriendsAndGroupsScreen/Friends/FriendProfileScreen';
import GroupRankingScreen from './Screens/Tabs/FriendsAndGroupsScreen/Groups/GroupRankingScreen';


import subirRetos from './Screens/subirRetos';





const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
           {/*<Stack.Screen
                name="subirRetos"
                component={subirRetos}
                options={{ headerShown: false }}
              /> */} 
              <Stack.Screen
                name="Splash"
                component={SplashScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
              name="OnBoarding"
              component={OnBoardingScreen}
              options={{ headerShown: false }}
            />
             <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
             <Stack.Screen
              name="RegisterScreen"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ResetPassword"
              component={ResetPasswordScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Purchase"
              component={PurchaseScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ChallengesCompleted"
              component={ChallengesCompletedScreen}
              options={{ title: 'Retos completados' }}
            />
            <Stack.Screen
              name="PrivacyPolicy" 
              component={PrivacyPolicyScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ChangeEmail"
              component={ChangeEmailScreen}
              options={{ headerShown: true, title: 'Cambiar Email' }}
            />
            <Stack.Screen
              name="ChangePassword"
              component={ChangePasswordScreen}
              options={{ headerShown: true, title: 'Cambiar Contraseña' }}
            />
            <Stack.Screen
              name="Help"
              component={HelpScreen}
              options={{ headerShown: true, title: 'Ayuda' }}
            />
            <Stack.Screen
              name="FriendProfile"
              component={FriendProfileScreen}
              options={{ headerShown: true, title: 'Ayuda' }}
            />
            <Stack.Screen
              name="GroupRanking"
              component={GroupRankingScreen}
              options={{ headerShown: true, title: 'Ayuda' }}
            />
           <Stack.Screen name="ChallengesDetail" component={ChallengesDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

{/*<Text style={{ textAlign: 'center', fontSize: 12 }}>
  Al continuar, aceptas nuestra{' '}
  <Text
    style={{ color: '#36a2c1' }}
    onPress={() => navigation.navigate('PrivacyPolicy')}
  >
    política de privacidad
  </Text>.
</Text>
 */}