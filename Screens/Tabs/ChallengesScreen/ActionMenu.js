import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Animated, Easing } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';

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

  // Animaciones: opacidad y translateY para que baje el menú
  const opacity = anim;
  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 0],
  });

  // Colores para modo oscuro o claro
  const bgColor = isDark ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.95)';
  const textColor = isDark ? '#ddd' : '#333';

  return (
    <View style={styles.menuContainer}>
      <IconButton
        icon={open ? "close" : "menu"}
        size={28}
        iconColor={textColor}
        onPress={toggleMenu}
        style={styles.mainButton}
        accessibilityLabel="Abrir menú de acciones"
      />

      {open && (
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
            activeOpacity={0.7}
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
            activeOpacity={0.7}
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
            activeOpacity={0.7}
          >
            <IconButton icon="information-outline" size={24} iconColor={textColor} />
            <Text style={[styles.actionText, { color: textColor }]}>Información</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    position: 'relative',
    alignItems: 'flex-end',
    // Puedes poner marginRight si quieres separarlo del borde
  },
  mainButton: {
    // fondo circular con sombra sutil
    backgroundColor: '#36a2c1',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  dropdown: {
    position: 'absolute',
    top: 50, // justo debajo del botón
    right: 0,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    elevation: 8,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    minWidth: 160,
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
