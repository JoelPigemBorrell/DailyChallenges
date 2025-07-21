import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native';
import { ActivityIndicator, Avatar } from 'react-native-paper';
import { onSnapshot, doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const [userId, setUserId] = useState(null);
  const [level, setLevel] = useState(0);
  const [points, setPoints] = useState(0);
  const [maxLevel, setMaxLevel] = useState(0);
  const [maxPoints, setMaxPoints] = useState(0);
  const [medals, setMedals] = useState([]);
  const [weeklyPoints, setWeeklyPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    const statsDocRef = doc(firestore, 'users', userId, 'stats', 'daily');
    const historyDocRef = doc(firestore, 'users', userId, 'stats', 'historical');

    const unsubscribeStats = onSnapshot(statsDocRef, (docSnap) => {
      const data = docSnap.data();
      if (docSnap.exists() && data) {
        setLevel(data.level ?? 0);
        setPoints(data.points ?? 0);
      }
    });

    const fetchHistorical = async () => {
      const docSnap = await getDoc(historyDocRef);
      const data = docSnap.data();

      if (docSnap.exists() && data) {
        setMaxLevel(data.maxLevel ?? 0);
        setMaxPoints(data.maxPoints ?? 0);
        setMedals(Array.isArray(data.medals) ? data.medals : []);

        if (data.weeklyPoints) {
          const now = new Date();
          let total = 0;
          for (let i = 0; i < 7; i++) {
            const date = new Date(now);
            date.setDate(now.getDate() - i);
            const key = date.toISOString().slice(0, 10);
            total += data.weeklyPoints[key] ?? 0;
          }
          setWeeklyPoints(total);
        } else {
          setWeeklyPoints(0);
        }
      }

      setLoading(false);
    };

    fetchHistorical();

    return () => unsubscribeStats();
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#36a2c1" />
      </View>
    );
  }

  if (!userId) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.noUserText}>No has iniciado sesión.</Text>
      </View>
    );
  }

  return (
 <SafeAreaView style={{ flex: 1, backgroundColor: '#fafafb' }}>
  <ScrollView contentContainerStyle={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color="#36a2c1" />
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Tu Perfil</Text>
    </View>

    {/* Avatar */}
    <View style={[styles.card, styles.centered]}>
      <Avatar.Icon size={90} icon="account-circle" style={styles.avatar} color="#fff" />
    </View>

    {/* Datos actuales */}
    <View style={styles.rowCards}>
      <View style={styles.statCard}>
        <Icon name="star" size={28} color="#f2b01e" />
        <Text style={styles.statLabel}>Puntos actuales</Text>
        <Text style={styles.statValue}>{points}</Text>
      </View>
      <View style={styles.statCard}>
        <Icon name="shield-star" size={28} color="#5da456" />
        <Text style={styles.statLabel}>Nivel actual</Text>
        <Text style={styles.statValue}>{level}</Text>
      </View>
    </View>

    {/* Históricos */}
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Historial Máximo</Text>
      <View style={styles.rowCards}>
        <View style={styles.statCard}>
          <Icon name="trophy" size={28} color="#c2ce51" />
          <Text style={styles.statLabel}>Máx. nivel</Text>
          <Text style={styles.statValue}>{maxLevel}</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="chart-line" size={28} color="#44c4d2" />
          <Text style={styles.statLabel}>Máx. puntos</Text>
          <Text style={styles.statValue}>{maxPoints}</Text>
        </View>
      </View>
    </View>

    {/* Medallas */}
    <View style={[styles.card, { paddingBottom: 20 }]}>
      <Text style={styles.sectionTitle}>🎖 Medallas</Text>
      {medals.length === 0 ? (
        <Text style={styles.noMedalsText}>Aún no tienes medallas</Text>
      ) : (
        <FlatList
          data={medals}
          horizontal
          keyExtractor={(item, i) => i.toString()}
          renderItem={({ item }) => (
            <View style={styles.medalItem}>
              <Icon name="medal" size={26} color="#fff" />
              <Text style={styles.medalText}>{item}</Text>
            </View>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }}
        />
      )}
    </View>

    {/* Puntos semanales */}
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Puntos esta semana</Text>
      <Text style={[styles.value, { fontSize: 38 }]}>{weeklyPoints}</Text>
    </View>
  </ScrollView>
  </SafeAreaView>
  );

};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
    backgroundColor: '#fafafb',
  },
  header: {
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  backButtonText: {
    marginLeft: 6,
    color: '#36a2c1',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#36a2c1',
    textAlign: 'center',
    marginTop: 10,
  },
    statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  statLabel: {
    fontSize: 14,
    color: '#444',
    marginTop: 6,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#5da456',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#36a2c1',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
  },
  smallCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 6,
    alignItems: 'center',
    elevation: 4,
  },
  rowCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  avatar: {
    backgroundColor: '#36a2c1',
    alignSelf: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginTop: 6,
  },
  value: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#5da456',
    textAlign: 'center',
  },
  valueSmall: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5da456',
    marginTop: 4,
    textAlign: 'center',
  },
  iconCenter: {
    alignSelf: 'center',
    marginBottom: 8,
  },
  medalItem: {
    backgroundColor: '#36a2c1',
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginHorizontal: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  medalText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  noMedalsText: {
    textAlign: 'center',
    fontSize: 15,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noUserText: {
    fontSize: 18,
    color: '#666',
  },
  centered: {
    alignItems: 'center',
  },
});

export default ProfileScreen;
