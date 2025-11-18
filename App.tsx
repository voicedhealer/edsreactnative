import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { RootNavigator } from '@navigation';
import { useTokenRefresh } from '@hooks/useTokenRefresh';
import { useNotifications } from '@hooks/useNotifications';
import { QueryProvider } from '@providers/QueryProvider';

export default function App() {
  // Activer le refresh automatique des tokens
  useTokenRefresh();

  // Initialiser les notifications push
  useNotifications();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <QueryProvider>
          <RootNavigator />
          <StatusBar style="auto" />
        </QueryProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
