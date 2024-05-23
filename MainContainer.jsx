// NavBar.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const NavBar = () => {
  const navigation = useNavigation();

  const handlePress = (screenName) => {
    navigation.replace(screenName);
  };

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => handlePress('Configuration')}>
        <Icon name="settings-outline" size={25} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => handlePress('Perfil')}>
        <Icon name="person-outline" size={25} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => handlePress('Api')}>
        <Icon name="cash-outline" size={25} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: -35,
    right: -35,
    backgroundColor: 'transparent',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
/*     borderTopLeftRadius: 20,
    borderTopRightRadius: 20, */
    overflow: 'hidden', // Para ocultar los elementos detrás de la barra
  },
  navItem: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  navText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default NavBar;
