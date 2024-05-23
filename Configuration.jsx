import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Image } from 'react-native';
import NavBar from './MainContainer';

const Configuration = ({ navigation }) => {
  const openURL = () => {
    Linking.openURL('https://www.coindesk.com');
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuration</Text>
      <View style={styles.dividerPerfil} />
      <TouchableOpacity style={styles.button} onPress={openURL}>
        <Text style={styles.buttonText}>News</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AboutUsScreen')}>
        <Text style={styles.buttonText}>About Us</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonLogOut} onPress={() => navigation.replace('Login')}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
      <Image
        style={styles.logo}
        source={require('./assets/JMCTRADING.png')} // Ajusta la ruta a la ubicación de tu imagen
      />
      <NavBar></NavBar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#25142d',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 10
  },
  title: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  dividerPerfil: {
    backgroundColor: 'white',
    height: 5,
    marginHorizontal: 0,
    margin: 10,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    width: '90%'
  },
  buttonLogOut: {
    alignItems: 'center',
    backgroundColor: '#c42c4a',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: '90%'
  },
  buttonText: {
    fontSize: 18,
    color: '#000'
  },
  logo: {
    marginTop: 350,
    width: 100, // Ajusta el ancho según sea necesario
    height: 100, // Ajusta la altura según sea necesario
    marginBottom: 20,
  },
});

export default Configuration;
