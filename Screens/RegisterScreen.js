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
import { TextInput, Button, Card, Checkbox } from 'react-native-paper';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../firebase'; // Ajusta el path si hace falta
import { doc, setDoc } from 'firebase/firestore';
import { Linking } from 'react-native';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [acceptNotifications, setAcceptNotifications] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !passwordConfirm) {
      Alert.alert('Error', 'Completa todos los campos.');
      return;
    }
    if (password !== passwordConfirm) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (!acceptPrivacy) {
      Alert.alert('Error', 'Debes aceptar la política de privacidad para registrarte.');
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guarda la preferencia de notificaciones en Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        email,
        notificationsEnabled: acceptNotifications,
        createdAt: new Date(),
      });

      Alert.alert('Registro exitoso', 'Ahora puedes iniciar sesión.');
      navigation.replace('LoginScreen');
    } catch (error) {
      console.error(error);
      Alert.alert('Error de registro', error.message || 'Algo salió mal.');
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
                <Text style={styles.title}>Crear cuenta</Text>
                <Text style={styles.subtitle}>Regístrate para comenzar</Text>

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
                <TextInput
                  label="Confirmar contraseña"
                  value={passwordConfirm}
                  onChangeText={setPasswordConfirm}
                  secureTextEntry
                  style={styles.input}
                  mode="outlined"
                />

                {/* Checkbox Política de Privacidad */}
                <TouchableWithoutFeedback onPress={() => setAcceptPrivacy(!acceptPrivacy)}>
                  <View style={styles.checkboxRow}>
                    <View style={styles.checkboxBox}>
                      {acceptPrivacy && <View style={styles.checkboxInner} />}
                    </View>
                    <Text style={styles.checkboxLabel}>
                      Acepto la{' '}
                      <Text
                        style={styles.linkText}
                        onPress={() => navigation.navigate('PrivacyPolicy')}
                      >
                        política de privacidad
                      </Text>
                    </Text>
                  </View>
                </TouchableWithoutFeedback>

                {/* Checkbox Notificaciones */}
                <TouchableWithoutFeedback onPress={() => setAcceptNotifications(!acceptNotifications)}>
                  <View style={styles.checkboxRow}>
                    <View style={styles.checkboxBox}>
                      {acceptNotifications && <View style={styles.checkboxInner} />}
                    </View>
                    <Text style={styles.checkboxLabel}>
                      Quiero recibir notificaciones (opcional)
                    </Text>
                  </View>
                </TouchableWithoutFeedback>

                <Button
                  mode="contained"
                  onPress={handleRegister}
                  buttonColor="#36a2c1"
                  style={styles.button}
                  labelStyle={{ fontSize: 16 }}
                  disabled={loading}
                >
                  {loading ? <ActivityIndicator color="#fff" /> : 'Registrarse'}
                </Button>

                <Button
                  onPress={() => navigation.navigate('LoginScreen')}
                  textColor="#36a2c1"
                  style={styles.loginLink}
                >
                  ¿Ya tienes cuenta? Inicia sesión
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
    backgroundColor: '#fff',
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
  loginLink: {
    marginTop: 15,
  },
  privacyContainer: {
    marginBottom: 15,
  },
  checkboxRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 10,
  backgroundColor: '#f0f4f6',
  padding: 10,
  borderRadius: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
    flexShrink: 1,
  },
  linkText: {
    color: '#36a2c1',
    textDecorationLine: 'underline',
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 4,
    borderColor: '#36a2c1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: '#36a2c1',
    borderRadius: 2,
  },

  privacyButton: {
    marginTop: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 0,
    textTransform: 'none',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
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
