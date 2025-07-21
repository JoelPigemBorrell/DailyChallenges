import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  FlatList,
} from 'react-native';
import { Button } from 'react-native-paper';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    key: '1',
    title: 'Retos diarios',
    description: 'Convierte tareas en retos divertidos y gana puntos y medallas.',
    animation: require('../assets/animations/challenges.json'),
  },
  {
    key: '2',
    title: 'Notificaciones',
    description: 'Recibe recordatorios para no olvidar tus retos diarios.',
    animation: require('../assets/animations/notifications.json'),
  },
  {
    key: '3',
    title: 'Compite con tus amigos',
    description: 'Reta a tus amigos y lidera la clasificación.',
    animation: require('../assets/animations/friends.json'),
  },
  {
    key: '4',
    title: '¿Preparado?',
    description: 'Empieza ahora, mejora cada día y supera tus límites.',
    animation: require('../assets/animations/start.json'),
  },
];

export default function OnboardingScreen({ navigation }) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View style={styles.container}>
      {/* Logo flotante */}
      <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />

      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <LottieView source={item.animation} autoPlay loop style={styles.lottie} />
            <View style={styles.textBox}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        )}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [1, 1.6, 1],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={i}
                style={[styles.dot, { transform: [{ scale }] }, i === currentIndex && styles.activeDot]}
              />
            );
          })}
        </View>

        {currentIndex === slides.length - 1 ? (
          <View style={styles.lastButtons}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('LoginScreen')}
              style={styles.button}
              buttonColor="#36a2c1"
            >
              Iniciar sesión
            </Button>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('RegisterScreen')}
              style={[styles.button, { borderColor: '#36a2c1' }]}
              textColor="#36a2c1"
            >
              Registrarse
            </Button>
          </View>
        ) : (
          <Button
            mode="contained"
            buttonColor="#36a2c1"
            style={styles.nextButton}
            onPress={handleNext}
            labelStyle={{ fontSize: 16 }}
          >
            Siguiente
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafb',
  },
  logo: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 70,
    height: 70,
    zIndex: 10,
  },
  slide: {
    width,
    alignItems: 'center',
    paddingTop: 120,
    paddingHorizontal: 20,
  },
  lottie: {
    width: width * 0.8,
    height: height * 0.4,
  },
  textBox: {
    backgroundColor: '#36a2c1',
    marginTop: 30,
    padding: 24,
    borderRadius: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  title: {
    fontSize: 24,
    color: '#fafafb',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#f1f1f1',
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  pagination: {
    flexDirection: 'row',
    marginVertical: 20,
    alignSelf: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: '#36a2c1',
    borderRadius: 5,
    marginHorizontal: 5,
    opacity: 0.3,
  },
  activeDot: {
    opacity: 1,
  },
  nextButton: {
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 30,
  },
  lastButtons: {
    width: '100%',
    gap: 12,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 6,
  },
});
