import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert, ActivityIndicator } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

import { LinearGradient } from 'expo-linear-gradient';

export default function ChangePasswordScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const auth = getAuth();

  const handleSendResetEmail = () => {
    const user = auth.currentUser;
    if (!user?.email) {
      Alert.alert('Error', 'No se pudo obtener tu correo electrónico');
      return;
    }

    setLoading(true);
    sendPasswordResetEmail(auth, user.email)
      .then(() => {
        Alert.alert('Correo enviado', 'Revisa tu bandeja para restablecer la contraseña');
        navigation.goBack();
      })
      .catch(err => Alert.alert('Error', err.message))
      .finally(() => setLoading(false));
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
            <Card mode="contained" style={styles.card}>
              <Card.Content>
                <Text style={styles.title}>Cambiar Contraseña</Text>
                <Text style={styles.description}>
                  Se enviará un correo para restablecer tu contraseña al email registrado.
                </Text>

                <Button
                  mode="contained"
                  onPress={handleSendResetEmail}
                  buttonColor="#36a2c1"
                  style={styles.button}
                  disabled={loading}
                >
                  {loading ? <ActivityIndicator color="#fff" /> : 'Enviar correo'}
                </Button>

                <Button
                  onPress={() => navigation.goBack()}
                  textColor="#36a2c1"
                  style={styles.cancelButton}
                >
                  Cancelar
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
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  cancelButton: {
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
