import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  FONT_SIZES,
  Shadows,
  ButtonGradient,
  HeroGradient,
} from '@constants';
import { useAuthStore } from '@store';
import { useGamification } from '@hooks/useGamification';
import type { AppStackParamList } from '@navigation/types';
import type { UserBadge } from '@types';

type ProfileScreenNavigationProp = StackNavigationProp<AppStackParamList>;

// Mapping des badges selon les règles
const BADGE_CONFIG: Record<string, { emoji: string; color: string; gradient: string[] }> = {
  curieux: {
    emoji: '🔍',
    color: COLORS.brandOrange,
    gradient: [COLORS.orange400, COLORS.orange500],
  },
  explorateur: {
    emoji: '🗺️',
    color: COLORS.brandPink,
    gradient: [COLORS.pink400, COLORS.pink500],
  },
  ambassadeur: {
    emoji: '👑',
    color: COLORS.brandOrange,
    gradient: [COLORS.brandOrange, COLORS.brandPink],
  },
  'feu-artifice': {
    emoji: '🎆',
    color: COLORS.brandRed,
    gradient: [COLORS.brandOrange, COLORS.brandPink, COLORS.brandRed],
  },
};

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user, logout } = useAuthStore();
  const { data: gamification, isLoading: isLoadingGamification } = useGamification();

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Erreur', 'Une erreur est survenue lors de la déconnexion');
            }
          },
        },
      ]
    );
  };

  const renderBadge = (badge: UserBadge) => {
    const config = BADGE_CONFIG[badge.type] || {
      emoji: badge.emoji,
      color: COLORS.gray500,
      gradient: [COLORS.gray400, COLORS.gray500],
    };

    return (
      <View key={badge.id} style={styles.badgeContainer}>
        <LinearGradient
          colors={config.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.badgeGradient}
        >
          <Text style={styles.badgeEmoji}>{config.emoji}</Text>
        </LinearGradient>
        <View style={styles.badgeInfo}>
          <Text style={styles.badgeLabel}>{badge.label}</Text>
          <Text style={styles.badgeDescription}>{badge.description}</Text>
          {badge.unlockedAt && (
            <Text style={styles.badgeDate}>
              Débloqué le {new Date(badge.unlockedAt).toLocaleDateString('fr-FR')}
            </Text>
          )}
        </View>
      </View>
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Utilisateur non connecté</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header avec gradient */}
      <LinearGradient
        colors={HeroGradient.colors}
        start={HeroGradient.start}
        end={HeroGradient.end}
        locations={HeroGradient.locations}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
              </View>
            )}
          </View>

          {/* Nom et email */}
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>

          {/* Karma Points */}
          {isLoadingGamification ? (
            <ActivityIndicator size="small" color={COLORS.textLight} style={styles.karmaLoader} />
          ) : (
            <View style={styles.karmaContainer}>
              <Text style={styles.karmaLabel}>Karma Points</Text>
              <Text style={styles.karmaValue}>{gamification?.karmaPoints || 0}</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Section Badges */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mes Badges</Text>
        {isLoadingGamification ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={COLORS.brandOrange} />
            <Text style={styles.loadingText}>Chargement des badges...</Text>
          </View>
        ) : gamification?.badges && gamification.badges.length > 0 ? (
          <View style={styles.badgesGrid}>
            {gamification.badges.map((badge) => renderBadge(badge))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🏆</Text>
            <Text style={styles.emptyText}>Aucun badge débloqué pour le moment</Text>
            <Text style={styles.emptySubtext}>
              Engagez-vous sur les événements pour débloquer des badges !
            </Text>
          </View>
        )}

        {/* Stats */}
        {gamification && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{gamification.totalEngagements || 0}</Text>
              <Text style={styles.statLabel}>Engagements</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{gamification.badges.length}</Text>
              <Text style={styles.statLabel}>Badges</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{gamification.karmaPoints}</Text>
              <Text style={styles.statLabel}>Karma</Text>
            </View>
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actionsSection}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Favorites')}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonIcon}>❤️</Text>
          <Text style={styles.actionButtonText}>Mes Favoris</Text>
          <Text style={styles.actionButtonArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Settings')}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonIcon}>⚙️</Text>
          <Text style={styles.actionButtonText}>Paramètres</Text>
          <Text style={styles.actionButtonArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('EditProfile')}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonIcon}>✏️</Text>
          <Text style={styles.actionButtonText}>Modifier le profil</Text>
          <Text style={styles.actionButtonArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Bouton Déconnexion */}
      <View style={styles.logoutSection}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutButtonText}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },
  headerContent: {
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: COLORS.textLight,
    ...Shadows.cardHover,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: COLORS.textLight,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '700',
    color: COLORS.textLight,
  },
  userName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  userEmail: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: SPACING.md,
  },
  karmaContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  karmaLoader: {
    marginTop: SPACING.sm,
  },
  karmaLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  karmaValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.textLight,
  },
  section: {
    padding: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    gap: SPACING.sm,
  },
  loadingText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  badgesGrid: {
    gap: SPACING.md,
  },
  badgeContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.card,
    padding: SPACING.md,
    ...Shadows.card,
    marginBottom: SPACING.sm,
  },
  badgeGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  badgeEmoji: {
    fontSize: 32,
  },
  badgeInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  badgeLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs / 2,
  },
  badgeDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs / 2,
  },
  badgeDate: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray50,
    borderRadius: BORDER_RADIUS.card,
    padding: SPACING.md,
    marginTop: SPACING.md,
    ...Shadows.card,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.gray200,
    marginHorizontal: SPACING.sm,
  },
  statValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.brandOrange,
    marginBottom: SPACING.xs / 2,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  actionsSection: {
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.card,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...Shadows.card,
  },
  actionButtonIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  actionButtonText: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  actionButtonArrow: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.textSecondary,
  },
  logoutSection: {
    padding: SPACING.md,
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    borderRadius: BORDER_RADIUS.button,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    ...Shadows.buttonGradient,
  },
  logoutButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.textLight,
  },
  errorText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.error,
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
});

