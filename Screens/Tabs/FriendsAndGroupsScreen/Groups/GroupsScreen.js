import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { Button } from 'react-native-paper';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { firestore, auth } from '../../../../firebase';
import { useNavigation } from '@react-navigation/native';

const GroupsScreen = () => {
  const navigation = useNavigation();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const userId = auth.currentUser.uid;

  const [addFriendsModalVisible, setAddFriendsModalVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const [friends, setFriends] = useState([]);
  const [selectedFriendsToAdd, setSelectedFriendsToAdd] = useState([]);

  useEffect(() => {
    const q = query(
      collection(firestore, 'groups'),
      where('members', 'array-contains', userId)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const groupsList = [];
      querySnapshot.forEach((doc) => {
        groupsList.push({ id: doc.id, ...doc.data() });
      });
      setGroups(groupsList);
      setLoading(false);
    }
,
    (error) => {
      console.error('Error en listener grupos:', error);
      setLoading(false);
      // Opcional: mostrar mensaje de error en UI con un state
    });
    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    const q = query(
      collection(firestore, 'friends'),
      where('userId', '==', userId)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const friendsList = [];
      querySnapshot.forEach((doc) => {
        friendsList.push({ id: doc.data().friendId, name: doc.data().friendName });
      });
      setFriends(friendsList);
    },
    (error) => {
      console.error('Error en listener grupos:', error);
      setLoading(false);
      // Opcional: mostrar mensaje de error en UI con un state
    });
    return () => unsubscribe();
  }, [userId]);

  const createGroup = async () => {
    if (!newGroupName.trim()) return;

    try {
      await addDoc(collection(firestore, 'groups'), {
        name: newGroupName.trim(),
        description: newGroupDesc.trim() || '',
        members: [userId],
        createdAt: new Date(),
      });
      setNewGroupName('');
      setNewGroupDesc('');
      setModalVisible(false);
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const openAddFriendsModal = (group) => {
    setSelectedGroup(group);
    setSelectedFriendsToAdd([]);
    setAddFriendsModalVisible(true);
  };

  const toggleFriendSelection = (friendId) => {
    setSelectedFriendsToAdd((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  const addSelectedFriendsToGroup = async () => {
    if (!selectedGroup || selectedFriendsToAdd.length === 0) return;

    try {
      const groupRef = doc(firestore, 'groups', selectedGroup.id);
      const newMembers = Array.from(
        new Set([...selectedGroup.members, ...selectedFriendsToAdd])
      );
      await updateDoc(groupRef, { members: newMembers });
      setAddFriendsModalVisible(false);
      setSelectedGroup(null);
      setSelectedFriendsToAdd([]);
    } catch (error) {
      console.error('Error adding friends to group:', error);
    }
  };

  const renderGroup = ({ item }) => (
    <View style={styles.groupItem}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigation.navigate('GroupRanking', { groupId: item.id })}
        style={{ flex: 1 }}
      >
        <Text style={styles.groupName}>{item.name}</Text>
        <Text style={styles.groupDesc}>{item.description || 'Sin descripción'}</Text>
        <Text style={styles.groupMembers}>Miembros: {item.members.length}</Text>
      </TouchableOpacity>

      <Button
        mode="outlined"
        onPress={() => openAddFriendsModal(item)}
        style={styles.addFriendsButton}
        contentStyle={{ paddingVertical: 6 }}
        labelStyle={{ fontWeight: '600', color: '#36a2c1' }}
      >
        Añadir amigos
      </Button>
    </View>
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
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={renderGroup}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No estás en ningún grupo. ¡Crea uno!</Text>
        }
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <Button
        mode="contained"
        icon="plus"
        onPress={() => setModalVisible(true)}
        style={styles.createButton}
        contentStyle={{ height: 50 }}
        labelStyle={{ fontSize: 18, fontWeight: '700' }}
      >
        Crear nuevo grupo
      </Button>

      {/* Modal para crear grupo */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Crear grupo</Text>
            <TextInput
              placeholder="Nombre del grupo"
              value={newGroupName}
              onChangeText={setNewGroupName}
              style={styles.input}
              placeholderTextColor="#999"
            />
            <TextInput
              placeholder="Descripción (opcional)"
              value={newGroupDesc}
              onChangeText={setNewGroupDesc}
              style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
              multiline
              placeholderTextColor="#999"
            />
            <View style={styles.modalButtons}>
              <Button
                mode="outlined"
                onPress={() => setModalVisible(false)}
                style={{ borderColor: '#ccc' }}
                labelStyle={{ color: '#555' }}
              >
                Cancelar
              </Button>
              <Button mode="contained"  buttonColor='#36a2c1' onPress={createGroup}>
                Crear
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para añadir amigos al grupo */}
      <Modal
        visible={addFriendsModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setAddFriendsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '85%' }]}>
            <Text style={styles.modalTitle}>
              Añadir amigos a: {selectedGroup?.name}
            </Text>

            {friends.length === 0 ? (
              <Text style={{ color: '#888', textAlign: 'center', marginVertical: 20 }}>
                No tienes amigos para añadir.
              </Text>
            ) : (
              <FlatList
                data={friends}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  const isSelected = selectedFriendsToAdd.includes(item.id);
                  return (
                    <TouchableOpacity
                      style={[
                        styles.friendItem,
                        isSelected && styles.friendItemSelected,
                      ]}
                      onPress={() => toggleFriendSelection(item.id)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.friendName, isSelected && { color: 'white' }]}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            )}

            <View style={styles.modalButtons}>
              <Button
                mode="outlined"
                onPress={() => setAddFriendsModalVisible(false)}
                style={{ borderColor: '#ccc' }}
                labelStyle={{ color: '#555' }}
              >
                Cancelar
              </Button>
              <Button mode="contained" buttonColor="#36a2c1" onPress={addSelectedFriendsToGroup}>
                Añadir seleccionados
            </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafb',
    padding: 16,
  },
  groupItem: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 14,
    borderRadius: 16,
    shadowColor: '#36a2c1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  groupName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1b1b1b',
  },
  groupDesc: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  groupMembers: {
    fontSize: 13,
    color: '#999',
    marginTop: 6,
  },
  addFriendsButton: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#36a2c1',
    borderRadius: 10,
  },
  createButton: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    borderRadius: 30,
    backgroundColor: '#36a2c1',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,15,15,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    elevation: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#36a2c1',
    textAlign: 'center',
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#222',
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  friendItem: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#36a2c1',
    marginBottom: 10,
  },
  friendItemSelected: {
    backgroundColor: '#36a2c1',
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#36a2c1',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 60,
  },
});

export default GroupsScreen;
