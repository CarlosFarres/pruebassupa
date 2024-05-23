import * as React from 'react';
import { Button, View, Text, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';

function Home({ navigation }) {
  return (
    <ImageBackground 
      source={require('./assets/market.jpg')} 
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
    >
      <Text style={styles.title}>
        WELCOME TO JMC TRADING MARKET
      </Text>
      <TouchableOpacity 
      style={styles.button}
      onPress={() => navigation.navigate('Login')}>
      <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff', 
  },
  title: {
    fontSize: 32,
    paddingBottom: 20,
    textAlign: 'center',
    color: 'white', 
    fontWeight: 'bold', 
    textShadowColor: 'rgba(0, 0, 0, 1)', 
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  button: {
    backgroundColor: '#f4511e', 
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25, 
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Home;
