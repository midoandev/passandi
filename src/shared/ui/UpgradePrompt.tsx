import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme, colors } from '@/shared/config/ThemeContext';
import { PremiumBadge } from './PremiumBadge';

type UpgradePromptProps = {
  featureName: string;
  message: string;
  onUpgrade: () => void;
  size?: 'sm' | 'md' | 'lg';
};

export function UpgradePrompt({
  featureName,
  message,
  onUpgrade,
  size = 'md',
}: UpgradePromptProps) {
  const { t } = useTranslation();
  const { tokens } = useTheme();

  return (
    <View style={[styles.container, {
      backgroundColor: tokens.surface,
      borderColor: tokens.border,
    }]}>
      <View style={styles.content}>
        <View style={styles.featureInfo}>
          <PremiumBadge size={size === 'sm' ? 'sm' : 'md'} locked={true} />
          <Text style={[styles.featureName, { color: tokens.text }]}>{featureName}</Text>
        </View>
        <Text style={[styles.message, { color: tokens.subtle }]}>{message}</Text>
      </View>
      <TouchableOpacity style={styles.upgradeBtn} onPress={onUpgrade}>
        <Text style={styles.upgradeText}>{t('premium.upgrade_to_premium')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    borderWidth: 0.5,
  },
  content: {
    flex: 1,
  },
  featureInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  featureName: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
  },
  upgradeBtn: {
    backgroundColor: colors.brand.gold,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 12,
  },
  upgradeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
