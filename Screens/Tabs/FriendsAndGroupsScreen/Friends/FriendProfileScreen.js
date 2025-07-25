import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Avatar, Button } from 'react-native-paper';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../../../firebase';
import { useNavigation, useRoute } from '@react-navigation/native';

const FriendProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;

  const [friendData, setFriendData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriendData = async () => {
      try {
        const docRef = doc(firestore, 'users', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFriendData(docSnap.data());
        } else {
          console.log('No such user!');
        }
      } catch (error) {
        console.error('Error loading friend profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriendData();
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#36a2c1" />
      </View>
    );
  }

  if (!friendData) {
    return (
      <View style={styles.centered}>
        <Text>No se encontró el perfil.</Text>
        <Button mode="contained" onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
          Volver
        </Button>
      </View>
    );
  }

  const {
    name = 'Usuario',
    stats = {},
    medals = [],
  } = friendData;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Avatar.Icon size={96} icon="account" style={{ backgroundColor: '#36a2c1' }} />
        <Text style={styles.name}>{name}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Nivel máximo histórico</Text>
        <Text style={styles.value}>{stats.maxLevel || 0}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Puntos totales</Text>
        <Text style={styles.value}>{stats.points || 0}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Medallas obtenidas</Text>
        {medals.length === 0 ? (
          <Text style={styles.noMedalsText}>No ha obtenido medallas todavía.</Text>
        ) : (
          medals.map((medal, i) => (
            <View key={i} style={styles.medalContainer}>
              <Avatar.Icon
                icon={medal.icon || 'star'}
                size={48}
                style={{ backgroundColor: '#c2ce51', marginRight: 16 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.medalName}>{medal.name}</Text>
                <Text style={styles.medalDesc}>{medal.description}</Text>
              </View>
            </View>
          ))
        )}
      </View>

      <Button mode="outlined" onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
        Volver
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fafafb',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 12,
    color: '#333',
  },
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#36a2c1',
    marginBottom: 8,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    color: '#444',
  },
  noMedalsText: {
    fontStyle: 'italic',
    color: '#999',
  },
  medalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(194, 206, 81, 0.15)',
    borderRadius: 12,
    padding: 12,
  },
  medalName: {
    fontWeight: '600',
    fontSize: 16,
    color: '#555',
  },
  medalDesc: {
    fontSize: 14,
    color: '#666',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FriendProfileScreen;
