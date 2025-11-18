import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import { COLORS } from '@constants';

// Importez vos écrans d'authentification ici
// import { LoginScreen } from '@app/LoginScreen';
// import { RegisterScreen } from '@app/RegisterScreen';
// import { ForgotPasswordScreen } from '@app/ForgotPasswordScreen';

// Écrans temporaires pour la structure
import { StyleSheet, Text, View } from 'react-native';

const LoginScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Login Screen</Text>
  </View>
);

const RegisterScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Register Screen</Text>
  </View>
);

const ForgotPasswordScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Forgot Password Screen</Text>
  </View>
);

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.textLight,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: COLORS.background,
        },
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: 'Connexion',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: 'Inscription',
        }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          title: 'Mot de passe oublié',
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
