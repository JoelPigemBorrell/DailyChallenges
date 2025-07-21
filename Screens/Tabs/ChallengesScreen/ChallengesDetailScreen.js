import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Image, Animated } from 'react-native';
import { Text, Button, Checkbox, Card, Divider } from 'react-native-paper';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '../../../firebase';

const { width } = Dimensions.get('window');

const ChallengeDetailScreen = ({ route }) => {
  const { challenge } = route.params;
  const [completed, setCompleted] = React.useState(challenge.completed);

  // Animated values para la animación de entrada
  const fadeAnim = useRef(new Animated.Value(0)).current; // opacidad
  const translateYAnim = useRef(new Animated.Value(20)).current; // posición vertical

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, translateYAnim]);

  const toggleCompletion = async () => {
    const userId = auth.currentUser?.uid;
    const ref = doc(firestore, `users/${userId}/dailyChallenges`, challenge.id);
    const newStatus = !completed;
    setCompleted(newStatus);

    await setDoc(ref, {
      ...challenge,
      completed: newStatus,
    });
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: translateYAnim }],
          flex: 1,
        }}
      >
        <Card style={styles.card} elevation={8}>
          {challenge.image ? (
            <Image
              source={{ uri: challenge.image }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : null}

          <Card.Content style={styles.content}>
            <Text style={styles.title}>{challenge.title}</Text>
            <Text style={styles.description}>{challenge.challenge}</Text>

            <Divider style={styles.divider} />

            <View style={styles.extraInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Categoría:</Text>
                <Text style={styles.infoValue}>{challenge.category || 'General'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Duración:</Text>
                <Text style={styles.infoValue}>{challenge.duration || '5 min'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Dificultad:</Text>
                <Text style={styles.infoValue}>{challenge.difficulty || 'Fácil'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Fecha asignada:</Text>
                <Text style={styles.infoValue}>{challenge.date || 'Hoy'}</Text>
              </View>
            </View>

            <Divider style={[styles.divider, { marginVertical: 20 }]} />

            <View style={styles.checkboxContainer}>
              <Checkbox
                status={completed ? 'checked' : 'unchecked'}
                onPress={toggleCompletion}
                color="#44c4d2"
                uncheckedColor="#bbb"
              />
              <Text style={styles.checkboxText}>
                {completed ? '¡Completado!' : '¿Ya lo hiciste?'}
              </Text>
            </View>

            <Button
              mode={completed ? 'outlined' : 'contained'}
              onPress={toggleCompletion}
              style={[styles.button, completed && styles.buttonCompleted]}
              textColor={completed ? '#36a2c1' : 'white'}
              contentStyle={{ paddingVertical: 10 }}
              labelStyle={{ fontSize: 16, fontWeight: '600' }}
              icon={completed ? "undo" : "check"}
            >
              {completed ? 'Marcar como pendiente' : 'Marcar como completado'}
            </Button>
          </Card.Content>
        </Card>
      </Animated.View>
    </View>
  );
};

export default ChallengeDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafb',
    padding: 20,
  },
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#36a2c1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
  },
  image: {
    width: '100%',
    height: width * 0.65,
  },
  content: {
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#222',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    color: '#444',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 20,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  extraInfo: {
    width: '100%',
    marginTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  infoLabel: {
    fontWeight: '600',
    color: '#36a2c1',
    fontSize: 16,
  },
  infoValue: {
    fontWeight: '400',
    color: '#666',
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  checkboxText: {
    fontSize: 16,
    color: '#555',
  },
  button: {
    borderRadius: 30,
    paddingHorizontal: 40,
    backgroundColor: '#36a2c1',
    elevation: 3,
  },
  buttonCompleted: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#36a2c1',
  },
});
