import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, Modal as RNModal, Alert, useColorScheme, TouchableWithoutFeedback } from 'react-native';
import { Text, Card, ProgressBar, IconButton, Portal, Modal } from 'react-native-paper';
import { auth, firestore } from '../../../firebase';
import { getDoc, updateDoc } from 'firebase/firestore';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import ActionMenu from './ActionMenu';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  collection,
  getDocs,
  setDoc,
  doc,
  query,
  where,
} from 'firebase/firestore';
import { format } from 'date-fns';

const { width } = Dimensions.get('window');

const ChallengesScreen = () => {
  const navigation = useNavigation();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [infoVisible, setInfoVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [previousLevel, setPreviousLevel] = useState(null);
  const [maxPoints, setMaxPoints] = useState(0);
  const [maxLevel, setMaxLevel] = useState(1);
  const [medals, setMedals] = useState([]);
  const [showConfettiModal, setShowConfettiModal] = useState(false);
  const confettiRef = useRef(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const userId = auth.currentUser?.uid;
  const today = format(new Date(), 'yyyy-MM-dd');

  const loadChallenges = useCallback(async () => {
  if (!userId) return;
  setLoading(true);
  try {
    const userChallengesRef = collection(firestore, `users/${userId}/dailyChallenges`);
    const todayQuery = query(userChallengesRef, where('date', '==', today));
    const todaySnap = await getDocs(todayQuery);
    let todayChallenges = todaySnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Filtrar los completados
    let incompleteChallenges = todayChallenges.filter(ch => !ch.completed);

    if (incompleteChallenges.length < 5) {
      const usedTodayChallengeIds = new Set(todayChallenges.map(d => d.id));
      const templatesSnap = await getDocs(collection(firestore, 'dailyChallengesTemplates'));
      let availableTemplates = templatesSnap.docs.filter(doc => !usedTodayChallengeIds.has(doc.id));

      if (availableTemplates.length < 5 - incompleteChallenges.length) {
        availableTemplates = templatesSnap.docs;
      }

      const needed = 5 - incompleteChallenges.length;
      const selectedTemplates = availableTemplates
        .sort(() => 0.5 - Math.random())
        .slice(0, needed);

      const newChallenges = selectedTemplates.map(docRef => ({
        id: docRef.id,
        title: docRef.data().title,
        challenge: docRef.data().challenge,
        image: docRef.data().image,
        completed: false,
        date: today,
      }));

      const batchPromises = newChallenges.map(challenge =>
        setDoc(doc(firestore, `users/${userId}/dailyChallenges`, challenge.id), challenge)
      );
      await Promise.all(batchPromises);

      todayChallenges = [...todayChallenges, ...newChallenges];
      incompleteChallenges = todayChallenges.filter(ch => !ch.completed);
    }

    const completedCount = todayChallenges.filter(ch => ch.completed).length;
    const newPoints = completedCount * 100;
    const newLevel = Math.floor(newPoints / 500) + 1;

    setChallenges(incompleteChallenges.slice(0, 5));
    setPoints(newPoints);
    setLevel(newLevel);

    // Guarda puntos y nivel actuales en "daily"
    const statsRef = doc(firestore, `users/${userId}/stats`, 'daily');
    const statsSnap = await getDoc(statsRef);

    if (isFirstLoadRef.current) {
      isFirstLoadRef.current = false;
    } else {
      if (newLevel > previousLevelRef.current) {
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 2500);
      }
    }
    previousLevelRef.current = newLevel;

    await setDoc(statsRef, { points: newPoints, level: newLevel }, { merge: true });

    // Ahora actualiza los máximos históricos y carga medallas
    await updateHistoricalStats(newPoints, newLevel);
  } catch (error) {
    console.error('Error cargando retos:', error);
  } finally {
    setLoading(false);
  }
  }, [userId, today]);


  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);

  useFocusEffect(
    useCallback(() => {
      loadChallenges();
    }, [loadChallenges])
  );
  
  const previousLevelRef = useRef(level);
  const isFirstLoadRef = useRef(true);
/*
  useEffect(() => {
    if (isFirstLoadRef.current) {
      isFirstLoadRef.current = false;
    } else {
      if (level > previousLevelRef.current) {
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 2500);
      }
    }
    previousLevelRef.current = level;
  }, [level]);*/

    const updateHistoricalStats = async (currentPoints, currentLevel) => {
      if (!userId) return;

      try {
        const statsDocRef = doc(firestore, `users/${userId}/stats`, 'historical');
        const statsDocSnap = await getDoc(statsDocRef);

        let historicalPoints = 0;
        let historicalLevel = 1;
        let historicalMedals = [];

        if (statsDocSnap.exists()) {
          const data = statsDocSnap.data();
          historicalPoints = data.maxPoints || 0;
          historicalLevel = data.maxLevel || 1;
          historicalMedals = data.medals || [];
        }

        // Actualizar máximos si el actual es mayor
        let updated = false;
        if (currentPoints > historicalPoints) {
          historicalPoints = currentPoints;
          updated = true;
        }
        if (currentLevel > historicalLevel) {
          historicalLevel = currentLevel;
          updated = true;
        }
        const addMedal = (newMedal) => {
          const exists = historicalMedals.find((m) => m.id === newMedal.id);
          if (!exists) {
            historicalMedals.push(newMedal);
            updated = true;
          }
        };

          // Ejemplo: medalla por nivel alcanzado
          if (currentLevel >= 5) {
            addMedal({
              id: 'level_5',
              title: 'Nivel 5',
              description: 'Has alcanzado el nivel 5.'
            });
          }
          if (currentLevel >= 10) {
            addMedal({
              id: 'level_10',
              title: 'Nivel 10',
              description: '¡Impresionante! Nivel 10 desbloqueado.'
            });
          }

          // Medalla por completar 5 retos en un día
          if (currentPoints >= 500) {
            addMedal({
              id: '5_challenges',
              title: '5 Retos Completados',
              description: 'Has completado 5 retos en un solo día.'
            });
          }

         const todayKey = format(new Date(), 'yyyy-MM-dd');

        // Obtener y actualizar puntos semanales
        let updatedWeeklyPoints = {};
        if (statsDocSnap.exists()) {
          const data = statsDocSnap.data();
          updatedWeeklyPoints = { ...data.weeklyPoints };
        }

        updatedWeeklyPoints[todayKey] = (updatedWeeklyPoints[todayKey] || 0) + currentPoints;


        // Limita solo a los últimos 7 días
        const allDates = Object.keys(updatedWeeklyPoints);
        const now = new Date();
        const filtered = allDates.filter((dateStr) => {
          const date = new Date(dateStr);
          const diff = (now - date) / (1000 * 60 * 60 * 24); // días
          return diff <= 7;
        });
        const limitedWeeklyPoints = {};
        filtered.forEach(date => {
          limitedWeeklyPoints[date] = updatedWeeklyPoints[date];
        });

        setMaxPoints(historicalPoints);
        setMaxLevel(historicalLevel);
        setMedals(historicalMedals);

        await setDoc(statsDocRef, {
          maxPoints: historicalPoints,
          maxLevel: historicalLevel,
          medals: historicalMedals,
          weeklyPoints: limitedWeeklyPoints,
        }, { merge: true });

      } catch (error) {
        console.error('Error actualizando históricos:', error);
      }
    };

  const toggleCompletion = async (challengeId) => {
    if (!userId || isUpdating) return;

    Alert.alert(
      'Confirmar',
      '¿Seguro que quieres completar este reto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Completar',
          onPress: async () => {
            setIsUpdating(true);
            try {
              const challengeDocRef = doc(firestore, `users/${userId}/dailyChallenges`, challengeId);
              const currentChallenge = challenges.find(ch => ch.id === challengeId);
              if (!currentChallenge) return;

              const updatedChallenge = { ...currentChallenge, completed: !currentChallenge.completed };
              await setDoc(challengeDocRef, updatedChallenge);

              await loadChallenges();

              if (updatedChallenge.completed) {
                setShowConfettiModal(true);
                confettiRef.current?.reset();
                confettiRef.current?.play();
              }

              if (updatedChallenge.completed && confettiRef.current) {
                confettiRef.current.reset();
                confettiRef.current.play();
              }

            } catch (error) {
              console.error('Error actualizando reto:', error);
            } finally {
              setIsUpdating(false);
            }
          }
        }
      ]
    );
  };

  const progress = Math.min((points % 500) / 500, 1);
  const pointsToNextLevel = 500 - (points % 500);

  const getMotivationIcon = () => {
    if (points >= 2000) return <Icon name="crown" size={28} color="#c2ce51" />;
    if (points >= 1500) return <Icon name="star-circle" size={28} color="#d4af37" />;
    if (points >= 1000) return <Icon name="trophy-award" size={28} color="#c2ce51" />;
    if (points >= 500) return <Icon name="lightning-bolt" size={28} color="#5da456" />;
    return <Icon name="star-circle" size={28} color="#36a2c1" />;
  };

  // Mostrar TODOS los retos de hoy si ya no hay activos (todos completados)
  const activeChallenges = challenges.filter(ch => !ch.completed);

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
       {/* Modal para subir de nivel */}
      <Portal>
        <Modal
          visible={showLevelUp}
          onDismiss={() => setShowLevelUp(false)}
          contentContainerStyle={[styles.modal, { alignItems: 'center', backgroundColor: 'transparent', elevation: 0 }]}
        >
          <View style={{ backgroundColor: isDark ? '#222' : 'white', padding: 20, borderRadius: 12, alignItems: 'center' }}>
            <LottieView
              source={require('../../../assets/animations/level-up.json')}
              autoPlay
              loop={false}
              style={{ width: 150, height: 150 }}
            />
            <Text style={{ fontSize: 20, fontWeight: '700', color: isDark ? 'white' : '#333', marginTop: 8 }}>
              ¡Has subido al nivel {level}!
            </Text>
          </View>
        </Modal>
      </Portal>

      <RNModal transparent visible={isUpdating}>
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#36a2c1" />
          <Text style={{ marginTop: 12, color: '#36a2c1', fontWeight: '600' }}>Completando...</Text>
        </View>
      </RNModal>

      <View style={styles.headerContainer}>
        {/* Sección de Puntos */}
        <View style={styles.headerItem}>
          <Text style={[styles.headerLabel, isDark && styles.textLight]}>Puntos</Text>
          <Text style={[styles.headerValue, isDark && styles.textLight]}>{points}</Text>
          <Text style={[styles.subText, isDark && styles.textLight]}>
            {pointsToNextLevel} para subir de nivel
          </Text>
        </View>

        {/* Sección de Nivel */}
        <View style={styles.headerItemLevel}>
          <Text style={[styles.headerLabel, isDark && styles.textLight]}>Nivel</Text>
          <View style={styles.levelRow}>
            <Text style={[styles.headerValue, isDark && styles.textLight]}>{level}</Text>
            <View style={{ marginLeft: 6 }}>{getMotivationIcon()}</View>
          </View>
          <LinearGradient
            colors={['#36a2c1', '#5da456']}
            style={styles.progressBarSmall}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View
              style={{
                width: `${progress * 100}%`,
                height: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                borderRadius: 4,
              }}
            />
          </LinearGradient>
        </View>

        {/* Iconos de acción */}
        <View style={styles.headerIcons}>
          <ActionMenu
            isDark={isDark}
            onReload={loadChallenges}
            onViewCompleted={() => navigation.navigate('ChallengesCompleted')}
            onInfo={() => setInfoVisible(true)}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate('Purchase')}
            style={styles.addChallengeButton}
          >
            <Icon name="plus" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>


      <Portal>
        <Modal
          visible={infoVisible}
          onDismiss={() => setInfoVisible(false)}
          contentContainerStyle={[
            styles.infoModalContainer,
            isDark,
          ]}
        >
          <Icon name="information" size={40} color={isDark ? '#36a2c1' : '#5da456'} style={{ marginBottom: 12 }} />
          <Text style={[styles.infoModalTitle, isDark && { color: '#fafafb' }]}>
            ¿Cómo funciona?
          </Text>
          <Text style={[styles.infoModalText, isDark && { color: '#ccc' }]}>
            Presiona “Completar” en cada reto para sumar 100 puntos. Al alcanzar 500 puntos, subes de nivel automáticamente.
            Siempre tendrás 5 retos activos al día. ¡Sigue completando para desbloquear nuevos niveles y medallas!
          </Text>
          <TouchableOpacity
            onPress={() => setInfoVisible(false)}
            style={styles.infoCloseButton}
          >
            <Text style={styles.infoCloseButtonText}>Entendido</Text>
          </TouchableOpacity>
        </Modal>
      </Portal>

      {showConfettiModal && (
        <View style={styles.fullscreenOverlay}>
          <LottieView
            ref={confettiRef}
            source={require('../../../assets/animations/confetti.json')}
            autoPlay
            loop={false}
            style={StyleSheet.absoluteFill}
            onAnimationFinish={() => {
              setTimeout(() => {
                setShowConfettiModal(false);
              }, 1000);
            }}
          />
        </View>
      )}





      <FlatList
        contentContainerStyle={styles.flatListContent}
        keyboardShouldPersistTaps="handled"
        data={activeChallenges.length > 0 ? activeChallenges : challenges}
        keyExtractor={(item) => `${item.id}-${item.date}`}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(index * 100)}
            style={[styles.animatedCard]}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('ChallengesDetail', { challenge: item })}
              disabled={isUpdating}
            >
              <Card style={[styles.card, isDark && styles.cardDark]} mode="elevated">
                <Card.Cover source={{ uri: item.image }} style={styles.cardImage} />
                <Card.Content>
                  <Text style={[styles.cardTitle, isDark && styles.cardTitleDark]}>{item.title}</Text>
                  <Text style={[styles.cardChallenge, isDark && styles.cardChallengeDark]}>{item.challenge}</Text>
                </Card.Content>
                <Card.Actions style={styles.cardActions}>
                  <TouchableOpacity
                    onPress={() => toggleCompletion(item.id)}
                    disabled={isUpdating}
                    style={[styles.completeButton, item.completed && styles.completedButton]}
                  >
                    <Text style={[styles.completeButtonText, item.completed && styles.completedButtonText]}>
                      {item.completed ? 'Completado' : 'Completar'}
                    </Text>
                  </TouchableOpacity>
                </Card.Actions>
              </Card>
            </TouchableOpacity>
          </Animated.View>
        )}
        ListEmptyComponent={() => (
          <View style={{ marginTop: 60, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, color: isDark ? '#ccc' : '#444' }}>
              🎉 ¡Has completado todos los retos de hoy!
            </Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,   // importante para que ocupe todo el espacio
    backgroundColor: '#fafafb',
    paddingHorizontal: 12,
    paddingTop: 90, // espacio para header fijo
    zIndex: 1,
  },
  flatListContent: {
    paddingBottom: 60,
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backdropFilter: 'blur(10px)', // solo web, ignóralo si da error
  },
  headerItem: {
    flex: 1.4,
    paddingRight: 8,
  },
  headerItemLevel: {
    flex: 0.7,
    alignItems: 'center',
  },
  headerLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  headerValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#36a2c1',
  },
  addChallengeButton: {
    backgroundColor: '#36a2c1',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#36a2c1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  subText: {
    fontSize: 11,
    color: '#999',
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  progressBarSmall: {
    height: 6,
    borderRadius: 4,
    width: 60,
    marginTop: 4,
    backgroundColor: '#d6eaf2',
    overflow: 'hidden',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 2,
    gap: 1,
    position: 'relative', 
    zIndex: 11,
  },
  premiumButton: {
    backgroundColor: '#fff9d6',
    borderRadius: 18,
    padding: 4,
    shadowColor: '#c2a902',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden', // para que la imagen respete el borde redondeado
    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    // Elevación para Android
    elevation: 6,
  },
  cardDark: {
    backgroundColor: '#222',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  cardImage: {
    height: 160,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 6,
    color: '#222',
  },
  cardChallenge: {
    fontSize: 15,
    color: '#444',
    marginBottom: 12,
  },
  cardTitleDark: {
    color: '#eee',
  },
  cardChallengeDark: {
    color: '#ccc',
  },
  cardActions: {
    justifyContent: 'flex-end',
    paddingRight: 16,
    paddingBottom: 12,
  },
  completeButton: {
    backgroundColor: '#36a2c1',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 22,
    shadowColor: '#36a2c1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  completedButton: {
    backgroundColor: '#5da456',
  },
  completeButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  completedButtonText: {
    color: '#d4ffd4',
  },
  textLight: {
    color: '#fafafb',
  },
  modal: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 8,
  },
  modalDark: {
    backgroundColor: '#333',
  },
  fullscreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    elevation: 9999, 
    pointerEvents: 'none',
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedCard: {
    marginBottom: 12,
  },
  infoModalContainer: {
    marginHorizontal: 24,
    backgroundColor: "white",
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  infoModalLight: {
    backgroundColor: '#ffffff',
  },
  infoModalDark: {
    backgroundColor: '#1e1e1e',
  },
  infoModalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#333',
    marginBottom: 12,
  },
  infoModalText: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  infoCloseButton: {
    backgroundColor: '#36a2c1',
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 28,
  },
  infoCloseButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },

});

export default ChallengesScreen;
