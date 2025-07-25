import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { IconButton } from 'react-native-paper';

const screenHeight = Dimensions.get('window').height;

const ActionMenu = ({ isDark, onReload, onViewCompleted, onInfo }) => {
  const [open, setOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    if (open) {
      Animated.timing(anim, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => setOpen(false));
    } else {
      setOpen(true);
      Animated.timing(anim, {
        toValue: 1,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  };

  const closeMenu = () => {
    if (open) toggleMenu();
  };

  const opacity = anim;
  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 0],
  });

  const bgColor = isDark ? 'rgba(30,30,30,0.95)' : 'rgba(255,255,255,0.95)';
  const textColor = isDark ? '#ddd' : '#333';

  return (
    <View style={styles.menuContainer}>
      <IconButton
        icon={open ? 'close' : 'menu'}
        size={28}
        iconColor="#fff"
        onPress={toggleMenu}
        style={styles.mainButton}
      />

      {open && (
        <>
          {/* Capa transparente para detectar toques fuera */}
          <TouchableWithoutFeedback onPress={closeMenu}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>

          <Animated.View
            style={[
              styles.dropdown,
              {
                backgroundColor: bgColor,
                opacity,
                transform: [{ translateY }],
                shadowColor: isDark ? '#000' : '#aaa',
              },
            ]}
          >
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => {
                toggleMenu();
                onReload();
              }}
            >
              <IconButton icon="refresh" size={24} iconColor={textColor} />
              <Text style={[styles.actionText, { color: textColor }]}>Recargar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => {
                toggleMenu();
                onViewCompleted();
              }}
            >
              <IconButton icon="check-circle-outline" size={24} iconColor={textColor} />
              <Text style={[styles.actionText, { color: textColor }]}>Completados</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => {
                toggleMenu();
                onInfo();
              }}
            >
              <IconButton icon="information-outline" size={24} iconColor={textColor} />
              <Text style={[styles.actionText, { color: textColor }]}>Información</Text>
            </TouchableOpacity>
          </Animated.View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    position: 'relative',
    alignItems: 'flex-end',
    zIndex: 9999,
  },
  mainButton: {
    backgroundColor: '#36a2c1',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  backdrop: {
    position: 'absolute',
    top: -1000,
    left: -1000,
    right: 1000,
    bottom: -1000,
    width: Dimensions.get('window').width * 3,
    height: Dimensions.get('window').height * 3,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    right: 0,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    elevation: 8,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    minWidth: 160,
    zIndex: 2,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 6,
  },
  actionText: {
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },
});

export default ActionMenu;
