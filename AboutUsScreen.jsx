import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import NavBar from './MainContainer';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const AboutUsScreen = () => {
    const navigation = useNavigation();
  return (
    <View style={styles.container}>
              {/* FLECHA PARA VOLVER ATRAS */}
        <TouchableOpacity
        style={{ position: 'absolute', left: 20, top: 40 }}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={30} color="#ffffff" />
      </TouchableOpacity>
      <Text style={styles.title}>About Us</Text>
      <Text style={styles.subtitle}>Our Team</Text>
      <Text style={styles.text}>Jules William Custodio</Text>
      <Text style={styles.text}>Carlos Farres Lozano</Text>
      <Text style={styles.text}>Marc Vega Gironell</Text>
      <Text style={styles.subtitle}>Our Purpose</Text>
      <Text style={styles.text}>Our application is designed to empower users to engage in cryptocurrency trading. We strive to provide a platform that is user-friendly, secure, and efficient, enabling our users to maximize their trading potential and profitability.</Text>
    <NavBar></NavBar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#25142d'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffffff',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#666',
    textAlign: 'center'
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    color: '#999',
    textAlign: 'center'
  }
});

export default AboutUsScreen;
