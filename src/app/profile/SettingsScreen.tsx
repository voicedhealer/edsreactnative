import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  FONT_SIZES,
  Shadows,
} from '@constants';
import { useAuthStore } from '@store';

export const SettingsScreen: React.FC = () => {
  const { user } = useAuthStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleAboutPress = () => {
    Alert.alert(
      'À propos',
      'Envie2Sortir v1.0.0\n\nLa plateforme ultra-locale de TOUS les divertissements.\n\nDécouvrez toutes vos envies, près de chez vous.',
      [{ text: 'OK' }]
    );
  };

  const handlePrivacyPress = () => {
    Alert.alert(
      'Politique de confidentialité',
      'Votre vie privée est importante pour nous. Nous collectons uniquement les données nécessaires pour améliorer votre expérience.',
      [{ text: 'OK' }]
    );
  };

  const handleTermsPress = () => {
    Alert.alert(
      'Conditions d\'utilisation',
      'En utilisant cette application, vous acceptez nos conditions d\'utilisation.',
      [{ text: 'OK' }]
    );
  };

  const renderSettingItem = (
    label: string,
    value: boolean,
    onValueChange: (value: boolean) => void,
    description?: string
  ) => {
    return (
      <View style={styles.settingItem}>
        <View style={styles.settingContent}>
          <Text style={styles.settingLabel}>{label}</Text>
          {description && <Text style={styles.settingDescription}>{description}</Text>}
        </View>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: COLORS.gray200, true: COLORS.brandOrange }}
          thumbColor={value ? COLORS.textLight : COLORS.gray400}
        />
      </View>
    );
  };

  const renderActionItem = (
    label: string,
    icon: string,
    onPress: () => void,
    variant: 'default' | 'danger' = 'default'
  ) => {
    return (
      <TouchableOpacity
        style={[
          styles.actionItem,
          variant === 'danger' && styles.actionItemDanger,
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={styles.actionIcon}>{icon}</Text>
        <Text
          style={[
            styles.actionLabel,
            variant === 'danger' && styles.actionLabelDanger,
          ]}
        >
          {label}
        </Text>
        <Text style={styles.actionArrow}>›</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Section Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.sectionContent}>
          {renderSettingItem(
            'Notifications push',
            notificationsEnabled,
            setNotificationsEnabled,
            'Recevoir des notifications sur les nouveaux événements'
          )}
        </View>
      </View>

      {/* Section Localisation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Localisation</Text>
        <View style={styles.sectionContent}>
          {renderSettingItem(
            'Géolocalisation',
            locationEnabled,
            setLocationEnabled,
            'Utiliser votre position pour trouver des établissements à proximité'
          )}
        </View>
      </View>

      {/* Section Apparence */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Apparence</Text>
        <View style={styles.sectionContent}>
          {renderSettingItem(
            'Mode sombre',
            darkModeEnabled,
            setDarkModeEnabled,
            'Activer le thème sombre (bientôt disponible)'
          )}
        </View>
      </View>

      {/* Section Compte */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Compte</Text>
        <View style={styles.sectionContent}>
          <View style={styles.accountInfo}>
            <Text style={styles.accountLabel}>Email</Text>
            <Text style={styles.accountValue}>{user?.email}</Text>
          </View>
          <View style={styles.accountInfo}>
            <Text style={styles.accountLabel}>Membre depuis</Text>
            <Text style={styles.accountValue}>
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString('fr-FR')
                : 'N/A'}
            </Text>
          </View>
        </View>
      </View>

      {/* Section Informations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations</Text>
        <View style={styles.sectionContent}>
          {renderActionItem('À propos', 'ℹ️', handleAboutPress)}
          {renderActionItem('Politique de confidentialité', '🔒', handlePrivacyPress)}
          {renderActionItem('Conditions d\'utilisation', '📄', handleTermsPress)}
        </View>
      </View>

      {/* Section Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.sectionContent}>
          {renderActionItem('Nous contacter', '✉️', () => {
            Alert.alert('Contact', 'Email: contact@envie2sortir.fr');
          })}
          {renderActionItem('Signaler un problème', '🐛', () => {
            Alert.alert('Signaler un problème', 'Merci de nous signaler tout problème rencontré.');
          })}
        </View>
      </View>

      {/* Version */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  section: {
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.card,
    ...Shadows.card,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  settingContent: {
    flex: 1,
    marginRight: SPACING.md,
  },
  settingLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs / 2,
  },
  settingDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  accountInfo: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  accountLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs / 2,
  },
  accountValue: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  actionItemDanger: {
    borderBottomColor: COLORS.gray100,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  actionLabel: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  actionLabelDanger: {
    color: COLORS.error,
  },
  actionArrow: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.textSecondary,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },
  versionText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
});

