import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { firestore } from '../../../../firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

const getMedalByPoints = (points) => {
  if (points >= 2000) return { emoji: '🏆', label: 'Platino', color: '#e5e4e2' };
  if (points >= 1000) return { emoji: '🥇', label: 'Oro', color: '#FFD700' };
  if (points >= 500) return { emoji: '🥈', label: 'Plata', color: '#C0C0C0' };
  if (points > 0) return { emoji: '🥉', label: 'Bronce', color: '#cd7f32' };
  return null;
};

const GroupRankingScreen = ({ route }) => {
  const { groupId } = route.params;
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    const groupRef = doc(firestore, 'groups', groupId);
    const unsubscribeGroup = onSnapshot(groupRef, (docSnap) => {
      if (docSnap.exists()) {
        setGroupName(docSnap.data().name);
        const memberIds = docSnap.data().members || [];
        if (memberIds.length === 0) {
          setMembers([]);
          setLoading(false);
          return;
        }

        Promise.all(
          memberIds.map(async (uid) => {
            const userDoc = await getDoc(doc(firestore, 'users', uid));
            if (userDoc.exists()) {
              const data = userDoc.data();
              return {
                id: uid,
                name: data.displayName || 'Usuario',
                points: data.points || 0,
              };
            }
            return { id: uid, name: 'Usuario', points: 0 };
          })
        ).then((usersData) => {
          const sorted = usersData.sort((a, b) => b.points - a.points);
          setMembers(sorted);
          setLoading(false);
        });
      } else {
        setMembers([]);
        setLoading(false);
      }
    });

    return () => unsubscribeGroup();
  }, [groupId]);

  const renderMember = ({ item, index }) => {
    const medal = getMedalByPoints(item.points);
    return (
      <View style={[styles.memberItem, index % 2 === 0 && styles.memberItemAlt]}>
        <Text style={styles.rank}>{index + 1}</Text>
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{item.name}</Text>
          <Text style={styles.memberPoints}>{item.points} pts</Text>
        </View>
        {medal && (
          <View style={[styles.medalContainer, { borderColor: medal.color }]}>
            <Text style={[styles.medalEmoji, { color: medal.color }]}>
              {medal.emoji}
            </Text>
            <Text style={[styles.medalLabel, { color: medal.color }]}>
              {medal.label}
            </Text>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#36a2c1" />
      </View>
    );
  }

  if (members.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No hay miembros en este grupo.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.groupTitle}>{groupName}</Text>
      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        renderItem={renderMember}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafb',
    padding: 20,
  },
  groupTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#36a2c1',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 1.2,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 12,
    shadowColor: '#36a2c1',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  memberItemAlt: {
    backgroundColor: '#e8f1f7',
  },
  rank: {
    width: 32,
    fontSize: 18,
    fontWeight: '700',
    color: '#1b1b1b',
    textAlign: 'center',
  },
  memberInfo: {
    flex: 1,
    marginLeft: 10,
  },
  memberName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  memberPoints: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  medalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.6,
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  medalEmoji: {
    fontSize: 20,
    marginRight: 6,
  },
  medalLabel: {
    fontWeight: '700',
    fontSize: 14,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    fontStyle: 'italic',
  },
});

export default GroupRankingScreen;
