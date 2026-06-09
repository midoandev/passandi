import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme, colors } from '@/shared/config/ThemeContext';
import { PremiumBadge } from './PremiumBadge';

type PremiumCardProps = {
  icon: string;
  title: string;
  description: string;
  isPremiumFeature?: boolean;
  isLocked?: boolean;
  onUpgrade?: () => void;
};

export function PremiumCard({
  icon,
  title,
  description,
  isPremiumFeature = false,
  isLocked = false,
  onUpgrade,
}: PremiumCardProps) {
  const { t } = useTranslation();
  const { tokens } = useTheme();

  return (
    <View style={[styles.container, {
      backgroundColor: tokens.surface,
      borderColor: tokens.border,
    }]}>
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: tokens.text }]}>{title}</Text>
          {isPremiumFeature && (
            <PremiumBadge locked={isLocked} size="sm" showLabel={false} />
          )}
        </View>
      </View>
      <Text style={[styles.description, { color: tokens.muted }]}>{description}</Text>
      {isLocked && onUpgrade && (
        <TouchableOpacity style={styles.upgradeBtn} onPress={onUpgrade}>
          <Text style={styles.upgradeText}>{t('premium.upgrade_to_premium')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0.5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  titleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 6,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  upgradeBtn: {
    backgroundColor: colors.brand.gold,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
