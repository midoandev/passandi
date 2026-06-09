import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '@/shared/config/ThemeContext';

type UpgradeButtonSize = 'sm' | 'md' | 'lg';

type UpgradeButtonProps = {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  size?: UpgradeButtonSize;
};

export function UpgradeButton({
  onPress,
  loading = false,
  disabled = false,
  size = 'md',
}: UpgradeButtonProps) {
  const { t } = useTranslation();

  const buttonStyles = {
    sm: { paddingVertical: 8, paddingHorizontal: 16, minHeight: 36 },
    md: { paddingVertical: 12, paddingHorizontal: 24, minHeight: 44 },
    lg: { paddingVertical: 16, paddingHorizontal: 32, minHeight: 52 },
  };

  const textSizes = { sm: 12 as const, md: 14 as const, lg: 16 as const };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        buttonStyles[size],
        (disabled || loading) && styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <Text style={[styles.text, { fontSize: textSizes[size] }]}>
          {t('premium.upgrade_to_premium')}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.brand.gold,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
