import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const PurchaseScreen = ({ navigation }) => {
  const { colors } = useTheme();

  return (
    <LinearGradient colors={['#36a2c1', '#44c4d2']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.animationContainer}>
          <LottieView
            source={require('../assets/animations/Premium.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>¡Hazte Premium!</Text>
          <Text style={styles.subtitle}>Desbloquea todo tu potencial</Text>

          <View style={styles.featureList}>
            <Feature icon="star" text="Retos ilimitados cada día" />
            <Feature icon="medal" text="Medallas exclusivas" />
            <Feature icon="chart-bar" text="Estadísticas avanzadas" />
            <Feature icon="palette" text="Temas visuales premium" />
            <Feature icon="headset" text="Soporte prioritario" />
          </View>

          <Button
            mode="contained"
            onPress={() => alert('Función de compra próximamente')}
            style={styles.buyButton}
            labelStyle={styles.buyLabel}
            contentStyle={{ paddingVertical: 8 }}
          >
            Comprar por 4,99€
          </Button>

          <Button onPress={() => navigation.goBack()} style={styles.backButton} labelStyle={{ color: '#fff' }}>
            Volver
          </Button>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const Feature = ({ icon, text }) => (
  <View style={styles.featureItem}>
    <Icon name={icon} size={22} color="#c2ce51" style={{ marginRight: 10 }} />
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    padding: 20,
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  animationContainer: {
    width: width * 0.8,
    height: width * 0.8,
    marginBottom: 20,
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 20,
    borderRadius: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    backdropFilter: 'blur(10px)',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#f0f0f0',
    textAlign: 'center',
    marginBottom: 20,
  },
  featureList: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#fff',
  },
  buyButton: {
    backgroundColor: '#c2ce51',
    borderRadius: 12,
  },
  buyLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  backButton: {
    marginTop: 16,
  },
});

export default PurchaseScreen;
