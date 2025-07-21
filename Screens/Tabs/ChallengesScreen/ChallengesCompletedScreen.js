import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { auth, firestore } from '../../../firebase';
import { format } from 'date-fns';
import { doc, collection, getDocs, setDoc, query, where } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const CompletedChallengesScreen = () => {
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = auth.currentUser?.uid;
  const today = format(new Date(), 'yyyy-MM-dd');

 const loadCompletedChallenges = async () => {
  if (!userId) return;

  try {
    const userChallengesRef = collection(firestore, `users/${userId}/dailyChallenges`);
    const todayQuery = query(userChallengesRef, where('date', '==', today));
    const todaySnap = await getDocs(todayQuery);

    const completed = todaySnap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(ch => ch.completed);

    console.log('Challenge IDs:', completed.map(c => c.id));  // ← AÑADIDO

    setCompletedChallenges(completed);
  } catch (error) {
    console.error('Error cargando retos completados:', error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadCompletedChallenges();
  }, []);

  const uncompleteChallenge = async (challengeId) => {
    try {
      const updated = completedChallenges.filter(c => c.id !== challengeId);
      setCompletedChallenges(updated);

      await setDoc(doc(firestore, `users/${userId}/dailyChallenges`, challengeId), {
        completed: false,
      }, { merge: true });

    } catch (error) {
      console.error('Error desmarcando reto:', error);
    }
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <View style={styles.cardHeader}>
        <TouchableOpacity
          style={[styles.checkbox, styles.checkboxChecked]}
          onPress={() => uncompleteChallenge(item.id)}
        >
          <Icon name="close" color="white" size={20} />
        </TouchableOpacity>
        <Text style={styles.cardTitle}>{item.title}</Text>
      </View>
      {item.image && (
        <Card.Cover source={{ uri: item.image }} style={styles.cardImage} />
      )}
      <Card.Content>
        <Text style={styles.challengeText}>{item.challenge}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Retos completados hoy</Text>
     <FlatList
        data={completedChallenges}
        keyExtractor={(item) => `${item.id}-${item.date}`} 
        renderItem={renderItem}
        refreshing={loading}
        onRefresh={loadCompletedChallenges}
        contentContainerStyle={{ padding: 16 }}
        />
    </View>
  );
};

export default CompletedChallengesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafb' },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#36a2c1',
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#e74c3c',
  },
  cardTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  cardImage: {
    marginTop: 12,
    borderRadius: 12,
  },
  challengeText: {
    marginTop: 8,
    fontSize: 16,
    color: '#444',
  },
});
