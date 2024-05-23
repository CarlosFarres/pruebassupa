import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from './supabase'; // Archivo supabaseClient.js donde tienes tu configuración de Supabase
import { useUser } from './UserContext';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { setUserId } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (error) {
        Alert.alert('Error', 'Invalid Credentials');
      } else if (data) {
        setUserId(data.id); // Guarda el ID del usuario en el contexto
        navigation.replace('Perfil');
        // Aquí puedes navegar a la siguiente pantalla o hacer lo que necesites después de iniciar sesión
      } else {
        Alert.alert('Error', 'Invalid email or password');
      }
    } catch (error) {
      console.error('Error signing in:', error);
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
        placeholder="Password"
        onChangeText={text => setPassword(text)}
        value={password}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} color="#9b3874" />
      <Text style={styles.loginText} onPress={() => navigation.navigate('Register')}>
        Don't have an account? Sign Up
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
    borderColor: '#25142d',
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  loginText: {
    marginTop: 20,
    color: 'white',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
