import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Share,
  Alert,
  Linking
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
} from 'firebase/firestore';
import { firestore } from '../../../../firebase';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const FriendsListScreen = () => {
  const [friendIds, setFriendIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const userId = getAuth().currentUser?.uid;

  // 🔗 Manejar invitaciones por link
  useEffect(() => {
  const handleDeepLink = async (event) => {
    const url = event.url;

      const parsed = Linking.parse(url);
      const invitedBy = parsed.queryParams?.uid;

      if (invitedBy && userId && invitedBy !== userId) {
        await addFriend(invitedBy);
        Alert.alert('Amigo añadido', 'Has añadido a un nuevo amigo automáticamente.');
      }
    };

    Linking.addEventListener('url', handleDeepLink);
    return () => Linking.removeAllListeners('url');
  }, [userId]);

  // 📩 Invitar amigos por link
  const shareInviteLink = async () => {
    if (!userId) return;

    const link = `https://dailychallenges.app/invite?uid=${userId}`;
    try {
      await Share.share({
        message: `¡Únete a DailyChallenges y agrégame como amigo! 👇\n${link}`,
      });
    } catch (error) {
      console.error('Error al compartir el enlace', error);
    }
  };

  // ➕ Agregar amigo por ID
  const addFriend = async (friendId) => {
    if (!userId || friendId === userId) return;

    const myFriendRef = doc(firestore, 'users', userId, 'friends', friendId);
    const theirFriendRef = doc(firestore, 'users', friendId, 'friends', userId);

    await setDoc(myFriendRef, { addedAt: Date.now() });
    await setDoc(theirFriendRef, { addedAt: Date.now() }); // amistad mutua (opcional)
  };

  // 📋 Cargar lista de amigos
  useEffect(() => {
    if (!userId || !isFocused) return;

    const friendsRef = collection(firestore, 'users', userId, 'friends');
    const unsubscribe = onSnapshot(friendsRef, (snapshot) => {
      const ids = snapshot.docs.map((doc) => doc.id);
      setFriendIds(ids);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId, isFocused]);

  const goToFriendProfile = (friendId) => {
    navigation.navigate('FriendProfile', { friendId });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Cargando amigos...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={styles.inviteButton} onPress={shareInviteLink}>
        <Icon name="account-plus" size={22} color="#fff" />
        <Text style={styles.inviteText}>Invitar amigo por WhatsApp</Text>
      </TouchableOpacity>

      {friendIds.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.noFriendsText}>Aún no has agregado amigos.</Text>
        </View>
      ) : (
        <FlatList
          data={friendIds}
          keyExtractor={(item) => item}
          contentContainerStyle={{ padding: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.friendItem}
              onPress={() => goToFriendProfile(item)}
            >
              <Icon name="account-circle" size={32} color="#36a2c1" />
              <Text style={styles.friendName}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#36a2c1',
    padding: 12,
    borderRadius: 20,
    margin: 16,
    justifyContent: 'center',
  },
  inviteText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 16,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  friendName: {
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '600',
    color: '#333',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#36a2c1',
    fontSize: 16,
  },
  noFriendsText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default FriendsListScreen;
