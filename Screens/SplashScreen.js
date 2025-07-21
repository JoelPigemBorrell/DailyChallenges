import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../firebase';

const auth = getAuth(app);

export default function SplashScreen({ navigation }) {
  const animationRef = useRef(null);

  useEffect(() => {
    animationRef.current?.play();

    const checkAppState = async () => {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');

      if (!hasLaunched) {
        await AsyncStorage.setItem('hasLaunched', 'true');
        setTimeout(() => navigation.replace('OnBoarding'), 3000);
        return;
      }

      onAuthStateChanged(auth, (user) => {
        setTimeout(() => {
          if (user) {
            navigation.replace('Home');
          } else {
            navigation.replace('LoginScreen');
          }
        }, 3000);
      });
    };

    checkAppState();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>DailyChallenges</Text>
      <LottieView
        ref={animationRef}
        source={require('../assets/animations/loading-bar.json')}
        style={styles.loadingBar}
        autoPlay={false}
        loop={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    color: '#000000ff',
    fontWeight: 'bold',
    marginBottom: 40,
  },
  loadingBar: {
    width: '80%',
    height: 50,
  },
});
