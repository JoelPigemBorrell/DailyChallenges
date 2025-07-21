import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert, ActivityIndicator } from 'react-native';
import { TextInput, Button, Card, Text } from 'react-native-paper';
import { getAuth, updateEmail } from 'firebase/auth';

export default function ChangeEmailScreen({ navigation }) {
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = getAuth();

  const handleUpdateEmail = async () => {
    if (!newEmail) {
      Alert.alert('Error', 'Por favor ingresa un correo válido.');
      return;
    }
    try {
      setLoading(true);
      await updateEmail(auth.currentUser, newEmail);
      Alert.alert('Éxito', 'Correo actualizado correctamente');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
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
            <Card mode="contained" style={styles.card}>
              <Card.Content>
                <Text style={styles.title}>Cambiar Email</Text>

                <TextInput
                  label="Nuevo correo electrónico"
                  value={newEmail}
                  onChangeText={setNewEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  mode="outlined"
                  style={styles.input}
                />

                <Button
                  mode="contained"
                  onPress={handleUpdateEmail}
                  buttonColor="#36a2c1"
                  style={styles.button}
                  disabled={loading}
                >
                  {loading ? <ActivityIndicator color="#fff" /> : 'Guardar'}
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

import { LinearGradient } from 'expo-linear-gradient';

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
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
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
  cancelButton: {
    marginTop: 15,
  },
});
