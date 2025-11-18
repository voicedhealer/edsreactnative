import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { RootStackParamList } from './types';

const prefix = Linking.createURL('/');

export const linkingConfiguration: LinkingOptions<RootStackParamList> = {
  prefixes: [prefix, 'envie2sortir://', 'https://envie2sortir.com', 'https://*.envie2sortir.com'],
  config: {
    screens: {
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register',
          ForgotPassword: 'forgot-password',
        },
      },
      App: {
        screens: {
          MainTabs: {
            screens: {
              Home: 'home',
              Search: 'search',
              Favorites: 'favorites',
              Profile: 'profile',
            },
          },
          EventDetails: 'event/:eventId',
          CreateEvent: 'create-event',
          EditProfile: 'edit-profile',
          Settings: 'settings',
        },
      },
    },
  },
};
