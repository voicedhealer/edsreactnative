import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { RootStackParamList } from './types';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';
import { linkingConfiguration } from './linking';
import { useAuthStore } from '@store';
import { useNotificationNavigation } from '@hooks/useNotificationNavigation';
import { COLORS } from '@constants';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { user, isLoading, checkSession } = useAuthStore();
  const isAuthenticated = !!user;

  // Configurer la navigation depuis les notifications
  useNotificationNavigation();

  useEffect(() => {
    // Vérifier la session au démarrage
    checkSession();
  }, [checkSession]);

  // Afficher un loader pendant la vérification de la session
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary || '#ff751f'} />
      </View>
    );
  }

  return (
    <NavigationContainer linking={linkingConfiguration}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="App" component={AppNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});
