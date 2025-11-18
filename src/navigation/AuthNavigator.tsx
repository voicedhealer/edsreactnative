import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthStackParamList } from './types';
import { COLORS } from '@constants';
import { LoginScreen } from '@app/auth/LoginScreen';
import { RegisterScreen } from '@app/auth/RegisterScreen';
import { ForgotPasswordScreen } from '@app/auth/ForgotPasswordScreen';

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  const headerShownFalse: boolean = false;
  const headerShownTrue: boolean = true;

  return (
    <Stack.Navigator screenOptions={{ headerShown: headerShownFalse }}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: headerShownFalse }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerShown: headerShownTrue,
          title: 'Inscription',
        }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          headerShown: headerShownTrue,
          title: 'Mot de passe oublié',
        }}
      />
    </Stack.Navigator>
  );
};
