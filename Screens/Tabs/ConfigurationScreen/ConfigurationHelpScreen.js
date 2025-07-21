import React from 'react';
import { View, StyleSheet, Linking, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';

import { LinearGradient } from 'expo-linear-gradient';

export default function HelpScreen() {
  const handleSendEmail = () => {
    Linking.openURL('mailto:soporte@dailychallenges.com?subject=Ayuda');
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
                <Text style={styles.title}>Ayuda</Text>
                <Text style={styles.description}>
                  Para soporte o consultas, puedes enviarnos un correo electrónico.
                </Text>

                <Button
                  mode="contained"
                  onPress={handleSendEmail}
                  buttonColor="#36a2c1"
                  style={styles.button}
                >
                  Enviar correo a soporte
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
