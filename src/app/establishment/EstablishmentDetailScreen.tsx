import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ImageGallery,
  EstablishmentInfo,
  EventsList,
  CommentsSection,
  ActionButtons,
  EstablishmentMap,
} from '@components/establishment';
import { useEstablishment } from '@hooks/useEstablishments';
import { useEventsByEstablishment } from '@hooks/useEvents';
import { COLORS, SPACING } from '@constants';
import type { AppStackParamList } from '@navigation/types';
import type { Event } from '@types';

type EstablishmentDetailScreenRouteProp = RouteProp<AppStackParamList, 'EstablishmentDetails'>;
type EstablishmentDetailScreenNavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'EstablishmentDetails'
>;

export const EstablishmentDetailScreen: React.FC = () => {
  const route = useRoute<EstablishmentDetailScreenRouteProp>();
  const navigation = useNavigation<EstablishmentDetailScreenNavigationProp>();
  const { establishmentId } = route.params;

  const {
    data: establishment,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useEstablishment(establishmentId);

  const {
    data: eventsData,
    isLoading: isLoadingEvents,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useEventsByEstablishment(establishmentId);

  const events = eventsData?.pages.flatMap(page => page.data) ?? [];

  const handleEventPress = (event: Event) => {
    navigation.navigate('EventDetails', { eventId: event.id });
  };

  const handleAddComment = () => {
    Alert.alert('Commentaire', 'Fonctionnalité de commentaires à implémenter');
  };

  const handleMapPress = () => {
    if (establishment?.latitude && establishment?.longitude) {
      // Ouvrir l'application de cartes avec les coordonnées
      const url = `https://maps.google.com/?q=${establishment.latitude},${establishment.longitude}`;
      Alert.alert('Ouvrir dans Maps', 'Voulez-vous ouvrir la localisation dans Google Maps ?', [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Ouvrir',
          onPress: () => {
            // Utiliser Linking pour ouvrir l'URL
            // Linking.openURL(url);
          },
        },
      ]);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.brandOrange} />
      </View>
    );
  }

  if (error || !establishment) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorContent}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Erreur</Text>
          <Text style={styles.errorText}>
            Impossible de charger les détails de l'établissement.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor={COLORS.brandOrange}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Galerie d'images */}
      <ImageGallery images={establishment.images || []} establishmentName={establishment.name} />

      {/* Informations établissement avec hero gradient */}
      <EstablishmentInfo establishment={establishment} />

      {/* Boutons d'action */}
      <ActionButtons
        establishmentId={establishment.id}
        establishmentName={establishment.name}
        onFavoriteChange={isFavorite => {
          // Optionnel : mettre à jour l'UI localement
        }}
      />

      {/* Carte avec localisation */}
      <EstablishmentMap establishment={establishment} onPress={handleMapPress} />

      {/* Liste des événements */}
      <EventsList
        events={events}
        isLoading={isLoadingEvents}
        onEventPress={handleEventPress}
        onLoadMore={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        hasMore={hasNextPage}
      />

      {/* Section commentaires */}
      <CommentsSection establishmentId={establishment.id} onAddComment={handleAddComment} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.xl,
  },
  errorContent: {
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.error,
    marginBottom: SPACING.sm,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
