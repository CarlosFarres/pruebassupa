// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Home';
import Auth from './Auth';
import DetailsScreen from './DetailsScreen';
import Api from './Api';
import Perfil from './Perfil';
import Register from './Register';
import Configuration from './Configuration';
import Login from './Login';
import { UserProvider } from './UserContext';
import AboutUsScreen from './AboutUsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="Auth" component={Auth} options={{ headerShown: false }} />
          <Stack.Screen name="DetailsScreen" component={DetailsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Api" component={Api} options={{ headerShown: false }} />
          <Stack.Screen name="Perfil" component={Perfil} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
          <Stack.Screen name="Configuration" component={Configuration} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="AboutUsScreen" component={AboutUsScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
      
  );
}
