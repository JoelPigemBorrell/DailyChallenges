import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import {
  Text,
  Switch,
  List,
  Divider,
  Button,
  IconButton,
} from 'react-native-paper';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { auth, firestore } from '../../../firebase'; // Firestore agregado en la config firebase
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import Animated, { FadeIn, FadeOut, ZoomIn, ZoomOut } from 'react-native-reanimated';

const ConfigurationScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [preferredTime, setPreferredTime] = useState('8:00 AM - 9:00 AM');
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    // Al montar, carga configuración desde Firestore
    if (!userId) return;
    const loadSettings = async () => {
      try {
        const docRef = doc(firestore, 'userSettings', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.notificationsEnabled !== undefined) setNotificationsEnabled(data.notificationsEnabled);
          if (data.preferredTime) setPreferredTime(data.preferredTime);
        }
      } catch (error) {
        console.log('Error cargando configuración:', error);
      }
    };
    loadSettings();
  }, [userId]);

  // Guarda en Firestore al cambiar cualquier opción
  const saveSettings = async (newSettings) => {
    if (!userId) return;
    try {
      const docRef = doc(firestore, 'userSettings', userId);
      await setDoc(docRef, newSettings, { merge: true });
    } catch (error) {
      console.log('Error guardando configuración:', error);
    }
  };

  const toggleNotifications = () => {
    const newVal = !notificationsEnabled;
    setNotificationsEnabled(newVal);
    saveSettings({ notificationsEnabled: newVal, preferredTime });
  };

  const changePreferredTime = (time) => {
    setPreferredTime(time);
    saveSettings({ notificationsEnabled, preferredTime: time });
    setModalVisible(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }],
        })
      );
    } catch (error) {
      alert('Error al cerrar sesión: ' + error.message);
    }
  };

  const settings = [
    {
      key: 'notifications',
      title: 'Notificaciones',
      right: () => (
        <Switch
          color="#36a2c1"
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
        />
      ),
      icon: 'bell-ring-outline',
      onPress: null,
      description: '',
    },
    {
      key: 'preferredTime',
      title: 'Horario preferido',
      description: preferredTime,
      icon: 'clock-outline',
      onPress: () => setModalVisible(true),
    },
    {
      key: 'changeEmail',
      title: 'Cambiar email',
      icon: 'email-outline',
      onPress: () => navigation.navigate('ChangeEmail'),
    },
    {
      key: 'changePassword',
      title: 'Cambiar contraseña',
      icon: 'lock-reset',
      onPress: () => navigation.navigate('ChangePassword'),
    },
    {
      key: 'language',
      title: 'Idioma',
      description: 'Español',
      icon: 'translate',
      onPress: () => alert('Próximamente soportará más idiomas'),
    },
    {
      key: 'privacy',
      title: 'Política de privacidad',
      icon: 'file-document-outline',
      onPress: () => navigation.navigate('PrivacyPolicy'),
    },
    {
      key: 'help',
      title: 'Ayuda',
      icon: 'help-circle-outline',
      onPress: () => navigation.navigate('Help'),
    },
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient
          colors={['#36a2c1', '#44c4d2', '#fafafb']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <ScrollView contentContainerStyle={styles.inner}>
            <Text style={styles.header}>Configuración</Text>
            <Animated.View
              entering={ZoomIn.delay(200)}
              exiting={ZoomOut}
              style={styles.premiumCard}
            >
              <TouchableWithoutFeedback onPress={() => navigation.navigate('Purchase')}>
                <View style={styles.premiumInner}>
                  <LottieView
                    source={require('../../../assets/animations/Premium.json')}
                    autoPlay
                    loop
                    style={styles.premiumLottie}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.premiumTitle}>Hazte Premium</Text>
                    <Text style={styles.premiumSubtitle}>Desbloquea retos ilimitados y más</Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Animated.View>

            {settings.map(({ key, title, right, onPress, icon, description }) => (
              <Animated.View 
                key={key} 
                entering={FadeIn.delay(100)} 
                exiting={FadeOut}
                style={styles.card}
              >
                <List.Item
                  title={title}
                  description={description}
                  onPress={onPress ?? undefined}
                  right={right ?? (() => <IconButton icon={icon} size={24} color="#36a2c1" />)}
                  left={(props) => <List.Icon {...props} icon={icon} color="#36a2c1" />}
                  titleStyle={styles.listTitle}
                  descriptionStyle={styles.listDescription}
                  style={{ marginHorizontal: 0 }}
                />
              </Animated.View>
            ))}

            <Animated.View
              entering={ZoomIn.duration(700)}
              exiting={ZoomOut}
              style={{ marginTop: 36, marginHorizontal: 40 }}
            >
              <LinearGradient
                colors={['#c23c49', '#9f2330']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logoutButton}
              >
                <Button
                  mode="text"
                  onPress={handleLogout}
                  labelStyle={styles.logoutLabel}
                  uppercase={false}
                  contentStyle={{ height: 50 }}
                  style={{ backgroundColor: 'transparent' }}
                >
                  Cerrar sesión
                </Button>
              </LinearGradient>
            </Animated.View>

            {/* Modal para horario preferido */}
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                <View style={styles.modalBackground}>
                  <TouchableWithoutFeedback>
                    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.modalContent}>
                      <Text variant="titleMedium" style={styles.modalTitle}>
                        Selecciona tu horario preferido
                      </Text>
                      <Button
                        mode={preferredTime === '8:00 AM - 9:00 AM' ? 'contained' : 'outlined'}
                        onPress={() => changePreferredTime('8:00 AM - 9:00 AM')}
                        style={styles.modalButton}
                        contentStyle={{ paddingVertical: 6 }}
                      >
                        8:00 AM - 9:00 AM
                      </Button>
                      <Button
                        mode={preferredTime === '9:00 AM - 10:00 AM' ? 'contained' : 'outlined'}
                        onPress={() => changePreferredTime('9:00 AM - 10:00 AM')}
                        style={styles.modalButton}
                        contentStyle={{ paddingVertical: 6 }}
                      >
                        9:00 AM - 10:00 AM
                      </Button>
                      <Button
                        mode="text"
                        onPress={() => setModalVisible(false)}
                        style={styles.modalCancelButton}
                      >
                        Cancelar
                      </Button>
                    </Animated.View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </ScrollView>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ConfigurationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  inner: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    fontWeight: '900',
    fontSize: 28,
    marginBottom: 24,
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  premiumCard: {
    backgroundColor: '#fff5d7',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  premiumInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumLottie: {
    width: 60,
    height: 60,
    marginRight: 12,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#c2a902',
  },
  premiumSubtitle: {
    fontSize: 14,
    color: '#8a7000',
  },

  card: {
    backgroundColor: '#ffffffcc',
    marginBottom: 12,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 8,
  },
  listTitle: {
    fontWeight: '600',
    fontSize: 17,
    color: '#333',
  },
  listDescription: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    borderRadius: 30,
    paddingHorizontal: 12,
    shadowColor: '#6a0b0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
  },
  logoutLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },

  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffffee',
    borderRadius: 20,
    padding: 30,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 10,
    elevation: 20,
  },
  modalTitle: {
    marginBottom: 24,
    fontWeight: '700',
    fontSize: 20,
    color: '#36a2c1',
  },
  modalButton: {
    width: '100%',
    marginVertical: 6,
    borderRadius: 12,
  },
  modalCancelButton: {
    marginTop: 12,
  },
});
