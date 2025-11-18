import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Animated,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  FONT_SIZES,
  ButtonGradient,
  Shadows,
  Typography,
} from '@constants';

// Phrases exactes du site web
const TYPEWRITER_PHRASES = [
  'manger une crêpe au nutella',
  'boire une bière artisanale',
  'faire un laser game',
  'faire du patin à roulettes',
  'manger un tacos 3 viandes',
  "découvrir un bar d'ambiance",
  'manger une pizza au fromage',
  'faire du karting en famille',
  'boire un cocktail mojito',
  'faire un escape game',
  'manger un burger extra',
  'danser en boîte de nuit',
];

// Configuration exacte du site web
const TYPING_SPEED = 80; // ms par caractère
const ERASING_SPEED = 50; // ms par caractère
const INITIAL_DELAY = 500; // ms avant début
const NEW_TEXT_DELAY = 2000; // ms entre phrases

// Villes disponibles
const CITIES = [
  'Paris, France',
  'Lyon, France',
  'Marseille, France',
  'Toulouse, France',
  'Nantes, France',
  'Strasbourg, France',
  'Montpellier, France',
  'Bordeaux, France',
  'Lille, France',
  'Rennes, France',
  'Reims, France',
  'Saint-Étienne, France',
  'Toulon, France',
  'Le Havre, France',
  'Dijon, France',
  'Angers, France',
  'Grenoble, France',
  'Villeurbanne, France',
  'Le Mans, France',
  'Aix-en-Provence, France',
];

const RADIUS_OPTIONS = [
  { value: 1, label: '1 km' },
  { value: 3, label: '3 km' },
  { value: 5, label: '5 km' },
  { value: 10, label: '10 km' },
  { value: 20, label: '20 km' },
  { value: 50, label: '50 km' },
];

interface SearchBarProps {
  onSubmit: (
    envie: string,
    city: string,
    radius: number,
    coords?: { lat: number; lng: number }
  ) => void;
  initialEnvie?: string;
  initialCity?: string;
  style?: ViewStyle;
  // Props pour compatibilité avec l'ancien composant
  city?: string;
  activity?: string;
  onCityChange?: (city: string) => void;
  onActivityChange?: (activity: string) => void;
  onSearch?: () => void;
  onGeolocationPress?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSubmit,
  initialEnvie = '',
  initialCity = '',
  style,
  // Props legacy pour compatibilité
  city: legacyCity,
  activity: legacyActivity,
  onCityChange: legacyOnCityChange,
  onActivityChange: legacyOnActivityChange,
  onSearch: legacyOnSearch,
  onGeolocationPress: legacyOnGeolocationPress,
}) => {
  // États
  const [envieValue, setEnvieValue] = useState(legacyActivity || initialEnvie);
  const [cityValue, setCityValue] = useState(legacyCity || initialCity);
  const [selectedRadius, setSelectedRadius] = useState(5);
  const [isTyping, setIsTyping] = useState(false);
  const [typewriterText, setTypewriterText] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Références pour le typewriter
  const typewriterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const textIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const isMountedRef = useRef(true);

  // Animation curseur clignotant
  const cursorOpacity = useRef(new Animated.Value(1)).current;

  // Animation curseur clignotant (orange #f97316)
  useEffect(() => {
    const blinkAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(cursorOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );

    blinkAnimation.start();

    return () => {
      blinkAnimation.stop();
    };
  }, [cursorOpacity]);

  // Effet typewriter (exact du site web)
  useEffect(() => {
    // Réinitialiser si l'utilisateur commence à taper
    if (isTyping || envieValue.length > 0) {
      if (typewriterTimeoutRef.current) {
        clearTimeout(typewriterTimeoutRef.current);
        typewriterTimeoutRef.current = null;
      }
      setTypewriterText('');
      return;
    }

    isMountedRef.current = true;
    textIndexRef.current = 0;
    charIndexRef.current = 0;
    setTypewriterText('');

    const type = () => {
      if (!isMountedRef.current || isTyping || envieValue.length > 0) return;

      const currentPhrase = TYPEWRITER_PHRASES[textIndexRef.current];

      if (charIndexRef.current < currentPhrase.length) {
        // Ajouter le caractère suivant
        setTypewriterText(currentPhrase.substring(0, charIndexRef.current + 1));
        charIndexRef.current++;
        typewriterTimeoutRef.current = setTimeout(type, TYPING_SPEED);
      } else {
        // Phrase terminée, commencer l'effacement après pause
        typewriterTimeoutRef.current = setTimeout(erase, NEW_TEXT_DELAY);
      }
    };

    const erase = () => {
      if (!isMountedRef.current || isTyping || envieValue.length > 0) return;

      if (charIndexRef.current > 0) {
        charIndexRef.current--;
        const currentPhrase = TYPEWRITER_PHRASES[textIndexRef.current];
        setTypewriterText(currentPhrase.substring(0, charIndexRef.current));
        typewriterTimeoutRef.current = setTimeout(erase, ERASING_SPEED);
      } else {
        // Texte effacé, passer à la phrase suivante
        textIndexRef.current = (textIndexRef.current + 1) % TYPEWRITER_PHRASES.length;
        typewriterTimeoutRef.current = setTimeout(type, TYPING_SPEED + 500);
      }
    };

    // Démarrer l'animation après délai initial
    typewriterTimeoutRef.current = setTimeout(type, INITIAL_DELAY);

    return () => {
      isMountedRef.current = false;
      if (typewriterTimeoutRef.current) {
        clearTimeout(typewriterTimeoutRef.current);
        typewriterTimeoutRef.current = null;
      }
    };
  }, [isTyping, envieValue]);

  // Gestionnaires d'événements
  const handleEnvieChange = (text: string) => {
    setEnvieValue(text);
    setIsTyping(text.length > 0);
    legacyOnActivityChange?.(text);
  };

  const handleCityChange = (text: string) => {
    setCityValue(text);
    legacyOnCityChange?.(text);

    if (text.trim()) {
      const filtered = CITIES.filter(city => city.toLowerCase().includes(text.toLowerCase()));
      setFilteredCities(filtered);
      setShowCityDropdown(true);
    } else {
      setFilteredCities(CITIES);
      setShowCityDropdown(true);
    }
  };

  const selectCity = (city: string) => {
    setCityValue(city);
    setShowCityDropdown(false);
    legacyOnCityChange?.(city);
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission de localisation refusée');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
      setCityValue('Autour de moi');
      setShowCityDropdown(false);
      legacyOnCityChange?.('Autour de moi');
      legacyOnGeolocationPress?.();
    } catch (error) {
      console.error('Erreur géolocalisation:', error);
      alert('Impossible de récupérer votre position');
    }
  };

  const handleSubmit = async () => {
    if (!envieValue.trim()) {
      alert('Veuillez décrire votre envie !');
      return;
    }

    const cityLower = cityValue.toLowerCase().trim();
    const isAroundMe = cityLower === 'autour de moi' || cityLower === 'autour';

    let coords = userLocation;

    // Si géolocalisation nécessaire
    if ((isAroundMe || !cityValue.trim()) && !coords) {
      // Déclencher géolocalisation
      await getCurrentLocation();
      if (!userLocation) {
        alert('Veuillez autoriser la géolocalisation ou sélectionner une ville');
        return;
      }
      coords = userLocation;
    }

    // Utiliser la nouvelle API ou l'ancienne pour compatibilité
    if (onSubmit) {
      onSubmit(envieValue.trim(), cityValue, selectedRadius, coords || undefined);
    } else {
      legacyOnSearch?.();
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.form}>
        {/* Section Envie */}
        <View style={styles.envieSection}>
          <Text style={styles.label}>Envie de</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={envieValue}
              onChangeText={handleEnvieChange}
              placeholder=""
              placeholderTextColor="transparent"
              autoCapitalize="none"
              autoCorrect={false}
              onSubmitEditing={handleSubmit}
              returnKeyType="search"
            />
            {/* Typewriter overlay */}
            {!isTyping && envieValue.length === 0 && (
              <View style={styles.typewriterOverlay} pointerEvents="none">
                <Text style={styles.typewriterText}>{typewriterText}</Text>
                <Animated.View style={[styles.cursor, { opacity: cursorOpacity }]} />
              </View>
            )}
          </View>
        </View>

        {/* Section Localisation */}
        <View style={styles.locationSection}>
          <Text style={styles.locationIcon}>📍</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={cityValue}
              onChangeText={handleCityChange}
              onFocus={() => {
                if (!cityValue.trim()) {
                  setFilteredCities(CITIES);
                }
                setShowCityDropdown(true);
              }}
              onBlur={() => {
                // Délai pour permettre le clic sur dropdown
                setTimeout(() => setShowCityDropdown(false), 200);
              }}
              placeholder="Dijon"
              placeholderTextColor={COLORS.gray400}
              onSubmitEditing={handleSubmit}
              returnKeyType="search"
            />

            {/* Dropdown villes */}
            {showCityDropdown && (
              <View style={styles.dropdown}>
                <ScrollView
                  style={styles.dropdownScroll}
                  keyboardShouldPersistTaps="handled"
                  nestedScrollEnabled
                >
                  {/* Option "Autour de moi" */}
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      getCurrentLocation();
                      setShowCityDropdown(false);
                    }}
                  >
                    <View style={styles.dropdownIcon}>
                      <Text style={styles.dropdownIconText}>✈️</Text>
                    </View>
                    <Text style={styles.dropdownText}>Autour de moi</Text>
                    <Text style={styles.dropdownArrow}>→</Text>
                  </TouchableOpacity>

                  {/* Liste villes */}
                  {(cityValue.trim() ? filteredCities : CITIES).map(city => (
                    <TouchableOpacity
                      key={city}
                      style={styles.dropdownItem}
                      onPress={() => selectCity(city)}
                    >
                      <View style={styles.dropdownIcon}>
                        <Text style={styles.dropdownIconText}>📍</Text>
                      </View>
                      <Text style={styles.dropdownText}>{city}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </View>

        {/* Sélecteur rayon */}
        <View style={styles.radiusSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.radiusScroll}
          >
            {RADIUS_OPTIONS.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.radiusOption,
                  selectedRadius === option.value && styles.radiusOptionActive,
                ]}
                onPress={() => setSelectedRadius(option.value)}
              >
                <Text
                  style={[
                    styles.radiusText,
                    selectedRadius === option.value && styles.radiusTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Bouton recherche */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.9}>
          <LinearGradient
            colors={ButtonGradient.colors}
            start={ButtonGradient.start}
            end={ButtonGradient.end}
            locations={ButtonGradient.locations}
            style={styles.submitButtonGradient}
          >
            <Text style={styles.submitButtonText}>Trouve-moi ça !</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.card,
    ...Shadows.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'visible',
    zIndex: 100,
    elevation: 5, // Android
  },
  form: {
    padding: SPACING.md,
    gap: SPACING.md,
  },
  envieSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    width: '100%',
  },
  label: {
    color: COLORS.brandOrange,
    fontSize: Typography.h3.fontSize,
    fontWeight: Typography.h3.fontWeight,
  },
  inputContainer: {
    flex: 1,
    position: 'relative',
    height: 48,
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: Typography.body.fontSize,
    color: COLORS.textPrimary,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.gray200,
  },
  typewriterOverlay: {
    position: 'absolute',
    left: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    pointerEvents: 'none',
  },
  typewriterText: {
    color: COLORS.gray400,
    fontSize: Typography.body.fontSize,
    fontWeight: Typography.body.fontWeight,
  },
  cursor: {
    width: 2,
    height: 20,
    backgroundColor: COLORS.orange500, // #f97316
    marginLeft: 2,
  },
  separator: {
    display: 'none', // Masquer les séparateurs verticaux sur mobile
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    width: '100%',
    position: 'relative',
  },
  locationIcon: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: SPACING.sm,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Shadows.cardHover,
    maxHeight: 320,
    zIndex: 1000,
    elevation: 10, // Android
  },
  dropdownScroll: {
    maxHeight: 320,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.md,
  },
  dropdownIcon: {
    width: 32,
    height: 32,
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownIconText: {
    fontSize: FONT_SIZES.md,
  },
  dropdownText: {
    flex: 1,
    fontSize: Typography.body.fontSize,
    color: COLORS.gray900,
    fontWeight: '500',
  },
  dropdownArrow: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray400,
  },
  radiusSection: {
    width: '100%',
  },
  radiusScroll: {
    gap: SPACING.sm,
  },
  radiusOption: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  radiusOptionActive: {
    borderColor: COLORS.brandOrange,
    backgroundColor: 'rgba(254, 215, 170, 0.25)', // orange-200 avec transparence
  },
  radiusText: {
    fontSize: Typography.small.fontSize,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  radiusTextActive: {
    color: COLORS.brandOrange,
    fontWeight: '600',
  },
  submitButton: {
    width: '100%',
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    ...Shadows.buttonGradient,
  },
  submitButtonGradient: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: COLORS.textLight,
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
  },
});
