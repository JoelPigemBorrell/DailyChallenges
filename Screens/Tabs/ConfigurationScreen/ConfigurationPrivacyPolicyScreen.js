import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Button } from 'react-native-paper';

const PrivacyPolicyScreen = ({ navigation }) => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <Text variant="headlineMedium" style={styles.title}>
        Política de Privacidad
      </Text>

      <Text style={styles.sectionTitle}>1. Datos que recogemos</Text>
      <Text style={styles.paragraph}>
        Recogemos información personal como tu correo electrónico, nombre y datos de autenticación.
        También almacenamos tus preferencias, como el horario preferido para notificaciones, idioma y configuración de la app.
        Además, recopilamos datos sobre el uso de la aplicación para mejorarla.
      </Text>

      <Text style={styles.sectionTitle}>2. Uso de los datos</Text>
      <Text style={styles.paragraph}>
        Usamos tus datos para personalizar tu experiencia en la app, enviarte notificaciones y recordatorios, autenticar tu acceso y mejorar el servicio.
        Nunca usaremos tus datos para otros fines sin tu consentimiento explícito.
      </Text>

      <Text style={styles.sectionTitle}>3. Compartir datos con terceros</Text>
      <Text style={styles.paragraph}>
        Algunos datos son almacenados en Firebase, un servicio de Google que cumple con altos estándares de seguridad y privacidad.
        No compartimos tus datos con terceros externos sin tu consentimiento, excepto cuando sea necesario para cumplir la ley.
      </Text>

      <Text style={styles.sectionTitle}>4. Protección de tus datos</Text>
      <Text style={styles.paragraph}>
        Implementamos medidas técnicas y organizativas para proteger tus datos contra accesos no autorizados o pérdidas.
        El acceso a tus datos está restringido y protegido mediante autenticación segura.
      </Text>

      <Text style={styles.sectionTitle}>5. Tus derechos</Text>
      <Text style={styles.paragraph}>
        Puedes acceder, modificar o eliminar tus datos personales en cualquier momento desde la configuración de la app o contactándonos.
        También puedes revocar el consentimiento para recibir notificaciones cuando desees.
      </Text>

      <Text style={styles.sectionTitle}>6. Uso de cookies y tecnologías similares</Text>
      <Text style={styles.paragraph}>
        No usamos cookies tradicionales, pero la app puede utilizar tecnologías para mejorar el rendimiento y experiencia del usuario.
      </Text>

      <Text style={styles.sectionTitle}>7. Consentimiento para notificaciones</Text>
      <Text style={styles.paragraph}>
        Al activar las notificaciones en la app, aceptas recibir alertas, recordatorios y comunicaciones relacionadas con el uso del servicio. Puedes desactivar estas notificaciones en cualquier momento desde la configuración. 
        Además, al usar la app, das tu consentimiento para que almacenemos y procesemos tus datos personales necesarios para ofrecerte esta funcionalidad y mejorar tu experiencia.
      </Text>

      <Text style={styles.sectionTitle}>8. Cambios en la política</Text>
      <Text style={styles.paragraph}>
        Nos reservamos el derecho de actualizar esta política en cualquier momento. Te informaremos de cambios significativos mediante la app.
      </Text>

      <Button
        mode="contained"
        onPress={() => navigation.goBack()}
        buttonColor="#36a2c1"
        style={styles.button}
        labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
      >
        Volver
      </Button>
    </ScrollView>
  );
};

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fafafb',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  title: {
    marginBottom: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#36a2c1',
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 8,
    fontWeight: 'bold',
    fontSize: 18,
    color: '#36a2c1',
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: '#444',
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
