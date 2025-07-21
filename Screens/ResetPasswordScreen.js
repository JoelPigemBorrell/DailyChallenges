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
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase'; // Ajusta el path si hace falta

export default function ResetPassword({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Introduce tu email.');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        'Correo enviado',
        'Revisa tu email para restablecer tu contraseña.'
      );
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message || 'No se pudo enviar el correo.');
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
              <Text style={styles.title}>Recuperar contraseña</Text>
              <Text style={styles.subtitle}>
                Introduce tu email para recibir instrucciones.
              </Text>

              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                mode="outlined"
              />

              <Button
                mode="contained"
                onPress={handleResetPassword}
                buttonColor="#36a2c1"
                style={styles.button}
                labelStyle={{ fontSize: 16 }}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#fff" /> : 'Enviar correo'}
              </Button>

              <Button
                onPress={() => navigation.goBack()}
                textColor="#36a2c1"
                style={styles.backLink}
              >
                Volver al login
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
  container: { flex: 1, backgroundColor: '#fafafb' },
  inner: { flex: 1, justifyContent: 'center', padding: 20 },
  logo: { width: 100, height: 100, alignSelf: 'center', marginBottom: 30 },
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
  backLink: {
    marginTop: 15,
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
