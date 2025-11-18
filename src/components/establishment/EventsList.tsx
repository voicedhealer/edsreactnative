import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, Typography, Shadows } from '@constants';
import type { Event } from '@types';

interface EventsListProps {
  events: Event[];
  isLoading?: boolean;
  onEventPress?: (event: Event) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export const EventsList: React.FC<EventsListProps> = ({
  events,
  isLoading,
  onEventPress,
  onLoadMore,
  hasMore,
}) => {
  const renderEvent = ({ item }: { item: Event }) => {
    const startDate = new Date(item.startDate);
    const formattedDate = startDate.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const formattedTime = startDate.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <TouchableOpacity
        style={styles.eventCard}
        onPress={() => onEventPress?.(item)}
        activeOpacity={0.8}
      >
        <View style={styles.eventHeader}>
          <View style={styles.eventDateContainer}>
            <Text style={styles.eventDay}>{startDate.getDate()}</Text>
            <Text style={styles.eventMonth}>
              {startDate.toLocaleDateString('fr-FR', { month: 'short' })}
            </Text>
          </View>
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.eventTime}>
              🕐 {formattedDate} à {formattedTime}
            </Text>
            {item.price !== undefined && (
              <Text style={styles.eventPrice}>
                💰 {item.price === 0 ? 'Gratuit' : `${item.price.toFixed(2)} €`}
              </Text>
            )}
          </View>
        </View>
        {item.description && (
          <Text style={styles.eventDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        {item.tags && item.tags.length > 0 && (
          <View style={styles.eventTags}>
            {item.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.eventTag}>
                <Text style={styles.eventTagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
        {item.maxParticipants && (
          <View style={styles.eventParticipants}>
            <Text style={styles.eventParticipantsText}>
              👥 {item.currentParticipants || 0}/{item.maxParticipants} participants
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (isLoading && events.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.brandOrange} />
      </View>
    );
  }

  if (events.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📅</Text>
        <Text style={styles.emptyTitle}>Aucun événement</Text>
        <Text style={styles.emptyText}>
          Cet établissement n'a pas encore d'événements programmés.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>📅 Événements à venir</Text>
      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        ListFooterComponent={
          hasMore && isLoading ? (
            <View style={styles.footer}>
              <ActivityIndicator size="small" color={COLORS.brandOrange} />
            </View>
          ) : null
        }
        onEndReached={() => {
          if (hasMore && !isLoading) {
            onLoadMore?.();
          }
        }}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
  },
  sectionTitle: {
    fontSize: Typography.h3.fontSize,
    fontWeight: Typography.h3.fontWeight,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  eventCard: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.card,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...Shadows.card,
  },
  eventHeader: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  eventDateContainer: {
    width: 60,
    height: 60,
    backgroundColor: COLORS.brandOrange,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventDay: {
    fontSize: Typography.h3.fontSize,
    fontWeight: Typography.h3.fontWeight,
    color: COLORS.textLight,
  },
  eventMonth: {
    fontSize: Typography.small.fontSize,
    color: COLORS.textLight,
    textTransform: 'uppercase',
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: Typography.h3.fontSize,
    fontWeight: Typography.h3.fontWeight,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  eventTime: {
    fontSize: Typography.small.fontSize,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs / 2,
  },
  eventPrice: {
    fontSize: Typography.small.fontSize,
    color: COLORS.brandOrange,
    fontWeight: '600',
  },
  eventDescription: {
    fontSize: Typography.body.fontSize,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    lineHeight: Typography.body.lineHeight * Typography.body.fontSize,
  },
  eventTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginTop: SPACING.sm,
  },
  eventTag: {
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
  },
  eventTagText: {
    fontSize: Typography.caption.fontSize,
    color: COLORS.textSecondary,
  },
  eventParticipants: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  eventParticipantsText: {
    fontSize: Typography.small.fontSize,
    color: COLORS.textSecondary,
  },
  loadingContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: Typography.h3.fontSize,
    fontWeight: Typography.h3.fontWeight,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: Typography.body.fontSize,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  footer: {
    padding: SPACING.md,
    alignItems: 'center',
  },
});
