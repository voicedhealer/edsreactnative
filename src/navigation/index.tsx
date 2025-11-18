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

// Composant wrapper pour utiliser la navigation à l'intérieur du NavigationContainer
const NavigationWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Configurer la navigation depuis les notifications
  // Ce hook doit être appelé à l'intérieur du NavigationContainer
  useNotificationNavigation();
  return <>{children}</>;
};

export const RootNavigator: React.FC = () => {
  const { isLoading, checkSession } = useAuthStore();

  useEffect(() => {
    // Vérifier la session au démarrage (sans bloquer l'accès)
    checkSession();
  }, [checkSession]);

  // Afficher un loader pendant la vérification de la session (seulement au premier chargement)
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary || '#ff751f'} />
      </View>
    );
  }

  // Toujours afficher AppNavigator - l'authentification n'est plus requise pour démarrer
  return (
    <NavigationContainer linking={linkingConfiguration}>
      <NavigationWrapper>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="App" component={AppNavigator} />
        </Stack.Navigator>
      </NavigationWrapper>
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
