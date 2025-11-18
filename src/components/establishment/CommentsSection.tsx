import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, Typography, Shadows } from '@constants';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  rating?: number;
  createdAt: string;
}

interface CommentsSectionProps {
  comments?: Comment[];
  establishmentId: string;
  onAddComment?: () => void;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  comments = [],
  establishmentId,
  onAddComment,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const renderComment = (comment: Comment) => {
    return (
      <View key={comment.id} style={styles.commentCard}>
        <View style={styles.commentHeader}>
          <View style={styles.commentAvatar}>
            <Text style={styles.commentAvatarText}>{comment.userName.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.commentInfo}>
            <Text style={styles.commentAuthor}>{comment.userName}</Text>
            <Text style={styles.commentDate}>{formatDate(comment.createdAt)}</Text>
          </View>
          {comment.rating && (
            <View style={styles.commentRating}>
              <Text style={styles.commentRatingIcon}>⭐</Text>
              <Text style={styles.commentRatingValue}>{comment.rating.toFixed(1)}</Text>
            </View>
          )}
        </View>
        <Text style={styles.commentContent}>{comment.content}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>💬 Commentaires</Text>
        {onAddComment && (
          <TouchableOpacity style={styles.addButton} onPress={onAddComment}>
            <Text style={styles.addButtonText}>+ Ajouter</Text>
          </TouchableOpacity>
        )}
      </View>

      {comments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>💬</Text>
          <Text style={styles.emptyTitle}>Aucun commentaire</Text>
          <Text style={styles.emptyText}>
            Soyez le premier à laisser un commentaire sur cet établissement !
          </Text>
          {onAddComment && (
            <TouchableOpacity style={styles.emptyButton} onPress={onAddComment}>
              <Text style={styles.emptyButtonText}>Ajouter un commentaire</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>{comments.map(renderComment)}</ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: Typography.h3.fontSize,
    fontWeight: Typography.h3.fontWeight,
    color: COLORS.textPrimary,
  },
  addButton: {
    backgroundColor: COLORS.brandOrange,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  addButtonText: {
    color: COLORS.textLight,
    fontSize: Typography.small.fontSize,
    fontWeight: '600',
  },
  commentCard: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.card,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...Shadows.card,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.brandOrange,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentAvatarText: {
    color: COLORS.textLight,
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
  },
  commentInfo: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  commentDate: {
    fontSize: Typography.small.fontSize,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs / 2,
  },
  commentRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs / 2,
  },
  commentRatingIcon: {
    fontSize: Typography.small.fontSize,
  },
  commentRatingValue: {
    fontSize: Typography.small.fontSize,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  commentContent: {
    fontSize: Typography.body.fontSize,
    color: COLORS.textSecondary,
    lineHeight: Typography.body.lineHeight * Typography.body.fontSize,
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
    marginBottom: SPACING.md,
  },
  emptyButton: {
    backgroundColor: COLORS.brandOrange,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  emptyButtonText: {
    color: COLORS.textLight,
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
  },
});
