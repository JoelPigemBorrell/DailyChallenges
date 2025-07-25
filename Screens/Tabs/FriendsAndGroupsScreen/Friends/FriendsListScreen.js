import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { Avatar, ActivityIndicator } from 'react-native-paper';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../../../firebase';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const FriendsListScreen = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchFriends = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) return;

    const friendData = [];

    try {
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        const friendIds = userDoc.data()?.friends || [];

        for (const id of friendIds) {
        try {
            const friendDoc = await getDoc(doc(firestore, 'users', id));
            if (friendDoc.exists()) {
            friendData.push({ id, ...friendDoc.data() });
            } else {
            console.warn(`❗ El documento del amigo con ID ${id} no existe.`);
            }
        } catch (error) {
            console.error(`❌ Error al obtener datos del amigo con ID ${id}:`, error.code, error.message);
        }
        }

        setFriends(friendData);
    } catch (error) {
        console.error('❌ Error al obtener el documento del usuario actual:', error.code, error.message);
    } finally {
        setLoading(false);
    }
    };


        fetchFriends();
    }, []);

    const handleShare = async () => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            const link = `https://dailychallenges.app/invite?uid=${user.uid}`;

            await Share.share({
            message: `¡Agrega a tu amigo en DailyChallenges! 📲 Usa este enlace para añadirme: ${link}`,
            });
        } catch (error) {
            console.log('Error sharing link:', error);
        }
    };


  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('FriendProfile', { userId: item.id })}
    >
      <Avatar.Icon icon="account" size={48} style={{ backgroundColor: '#36a2c1' }} />
      <View style={{ marginLeft: 16 }}>
        <Text style={styles.name}>{item.name || 'Usuario'}</Text>
        <Text style={styles.points}>{item.stats?.points || 0} puntos</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#36a2c1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No tienes amigos añadidos.</Text>}
      />

      <TouchableOpacity style={styles.button} onPress={handleShare}>
        <Icon name="whatsapp" size={24} color="#fff" />
        <Text style={styles.buttonText}>Invitar a amigos por WhatsApp</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafb',
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  points: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 30,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#36a2c1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 16,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 10,
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FriendsListScreen;
