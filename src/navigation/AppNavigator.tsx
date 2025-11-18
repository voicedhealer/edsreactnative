import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppStackParamList, MainTabParamList } from './types';
import { COLORS } from '@constants';

// Importez vos écrans ici
import { HomeScreen } from '@app/home/HomeScreen';
import { SearchResultsScreen } from '@app/search/SearchResultsScreen';
import { EstablishmentDetailScreen } from '@app/establishment/EstablishmentDetailScreen';
import { MapScreen } from '@app/map/MapScreen';
import { ProfileScreen, FavoritesScreen, SettingsScreen } from '@app/profile';

const EventDetailsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Event Details Screen</Text>
  </View>
);

const CreateEventScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Create Event Screen</Text>
  </View>
);

const EditProfileScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Edit Profile Screen</Text>
  </View>
);

const SettingsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Settings Screen</Text>
  </View>
);

// Bottom Tab Navigator
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabsNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary || '#ff751f',
        tabBarInactiveTintColor: COLORS.textSecondary || '#6b7280',
        tabBarStyle: {
          backgroundColor: COLORS.background || '#ffffff',
          borderTopColor: COLORS.border || '#e5e7eb',
        },
        headerStyle: {
          backgroundColor: COLORS.primary || '#ff751f',
        },
        headerTintColor: COLORS.textLight || '#ffffff',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Accueil',
          tabBarLabel: 'Accueil',
          headerShown: false,
          // tabBarIcon: ({ color, size }) => <Icon name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: 'Recherche',
          tabBarLabel: 'Recherche',
          // tabBarIcon: ({ color, size }) => <Icon name="search" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          title: 'Favoris',
          tabBarLabel: 'Favoris',
          headerShown: false,
          // tabBarIcon: ({ color, size }) => <Icon name="heart" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profil',
          tabBarLabel: 'Profil',
          headerShown: false,
          // tabBarIcon: ({ color, size }) => <Icon name="user" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

// Stack Navigator principal
const Stack = createStackNavigator<AppStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary || '#ff751f',
        },
        headerTintColor: COLORS.textLight || '#ffffff',
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabsNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EventDetails"
        component={EventDetailsScreen}
        options={{
          title: "Détails de l'événement",
        }}
      />
      <Stack.Screen
        name="EstablishmentDetails"
        component={EstablishmentDetailScreen}
        options={{
          title: "Détails de l'établissement",
        }}
      />
      <Stack.Screen
        name="CreateEvent"
        component={CreateEventScreen}
        options={{
          title: 'Créer un événement',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          title: 'Modifier le profil',
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Paramètres',
        }}
      />
      <Stack.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          title: 'Mes Favoris',
        }}
      />
      <Stack.Screen
        name="SearchResults"
        component={SearchResultsScreen}
        options={{
          title: 'Résultats de recherche',
        }}
      />
      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={{
          title: 'Carte interactive',
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
