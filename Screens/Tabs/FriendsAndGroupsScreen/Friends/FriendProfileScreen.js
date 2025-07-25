import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { ActivityIndicator, Avatar } from 'react-native-paper';
import { firestore } from '../../../../firebase';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const FriendProfileScreen = () => {
  const [level, setLevel] = useState(0);
  const [points, setPoints] = useState(0);
  const [maxLevel, setMaxLevel] = useState(0);
  const [maxPoints, setMaxPoints] = useState(0);
  const [medals, setMedals] = useState([]);
  const [weeklyPoints, setWeeklyPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  const route = useRoute();
  const navigation = useNavigation();
  const { friendId } = route.params;

  useEffect(() => {
    const statsDocRef = doc(firestore, 'users', friendId, 'stats', 'daily');
    const historyDocRef = doc(firestore, 'users', friendId, 'stats', 'historical');

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
  }, [friendId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#36a2c1" />
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
            <Text style={styles.title}>Perfil Amigo</Text>
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
          <FlatList
            data={medals}
            horizontal
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.medalItem}>
                <Icon name="medal" size={26} color="#fff" />
                <View style={{ marginLeft: 8 }}>
                  <Text style={styles.medalText}>{item.title}</Text>
                  <Text style={styles.medalDesc}>{item.description}</Text>
                </View>
              </View>
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 10 }}
          />
      
      
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
  container: { flex: 1, padding: 20, backgroundColor: '#fafafb' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    marginLeft: 10,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#36a2c1',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FriendProfileScreen;
