import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';


import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Completa todos los campos.');
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace('Home'); // Cambia 'Home' por la pantalla que corresponda
    } catch (error) {
      console.error(error);
      Alert.alert('Error de inicio de sesión', 'Correo o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient
            colors={['#36a2c1', '#44c4d2', '#fafafb']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            >
            <View style={styles.inner}>

          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Card mode="contained" style={styles.card}>
            <Card.Content>
              <Text style={styles.title}>Bienvenido</Text>
              <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                mode="outlined"
              />
              <TextInput
                label="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                mode="outlined"
              />

              <Button
                mode="contained"
                onPress={handleLogin}
                buttonColor="#36a2c1"
                style={styles.button}
                labelStyle={{ fontSize: 16 }}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#fff" /> : 'Entrar'}
              </Button>

              <Button
                onPress={() => navigation.navigate('RegisterScreen')}
                textColor="#36a2c1"
                style={styles.registerLink}
              >
                ¿No tienes cuenta? Regístrate
              </Button>

              <Button
                onPress={() => navigation.navigate('ResetPassword')}
                textColor="#36a2c1"
                style={{ marginTop: 10 }}
              >
                ¿Has olvidado tu contraseña?
              </Button>
            </Card.Content>
          </Card>
          </View>
       </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafb',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 10,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#36a2c1',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    borderRadius: 12,
    marginTop: 10,
  },
  registerLink: {
    marginTop: 15,
  },
  textBox: {
  backgroundColor: 'rgba(255,255,255,0.85)',
  marginTop: 30,
  padding: 24,
  borderRadius: 20,
  width: '100%',
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 4 },
  elevation: 5,
},
title: {
  fontSize: 24,
  color: '#333',
  fontWeight: 'bold',
  textAlign: 'center',
},
description: {
  fontSize: 16,
  color: '#555',
  textAlign: 'center',
},
button: {
    borderRadius: 12,
    marginTop: 15,
    paddingVertical: 10,
    elevation: 4,
    shadowColor: '#36a2c1',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

});
