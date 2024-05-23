import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from './supabase'; // Archivo supabaseClient.js donde tienes tu configuración de Supabase

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      // Realiza un INSERT en la tabla de usuarios en Supabase
      const { error } = await supabase
        .from('users')
        .insert([{ email, name, password }]);

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Success', 'Registered successfully', [
          { text: 'OK', onPress: () => navigation.replace('Login') }
        ]);
      }
    } catch (error) {
      console.error('Error registering:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require('./assets/JMCTRADING.png')} // Ajusta la ruta a la ubicación de tu imagen
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={text => setEmail(text)}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Name"
        onChangeText={text => setName(text)}
        value={name}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={text => setPassword(text)}
        value={password}
        secureTextEntry
      />
      <Button title="Register" onPress={handleRegister} color="#9b3874" />
      <Text style={styles.loginText} onPress={() => navigation.navigate('Login')}>
        Already have an account? Log in
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25142d'
  },
  logo: {
    width: 200, // Ajusta el ancho según sea necesario
    height: 200, // Ajusta la altura según sea necesario
    marginBottom: 20,
  },
  input: {
    width: '80%',
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  loginText: {
    marginTop: 20,
    color: 'white',
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;
