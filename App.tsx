import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { RootNavigator } from '@navigation';
import { useTokenRefresh } from '@hooks/useTokenRefresh';

export default function App() {
  // Activer le refresh automatique des tokens
  useTokenRefresh();

  return (
    <>
      <RootNavigator />
      <StatusBar style="auto" />
    </>
  );
}
