import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors } from '@/shared/config/ThemeContext';

type BadgeSize = 'sm' | 'md' | 'lg';

type PremiumBadgeProps = {
  size?: BadgeSize;
  showIcon?: boolean;
  showLabel?: boolean;
  locked?: boolean;
};

export function PremiumBadge({
  size = 'md',
  showIcon = true,
  showLabel = true,
  locked = false,
}: PremiumBadgeProps) {
  const { t } = useTranslation();

  const badgeDims = {
    sm: { height: 18, iconSize: 10, fontSize: 9, paddingH: 5 },
    md: { height: 22, iconSize: 12, fontSize: 10, paddingH: 6 },
    lg: { height: 28, iconSize: 14, fontSize: 12, paddingH: 8 },
  };

  const dims = badgeDims[size];

  return (
    <View
      style={[
        styles.badge,
        {
          height: dims.height,
          paddingHorizontal: dims.paddingH,
          backgroundColor: locked ? '#374151' : colors.brand.gold,
        },
      ]}
    >
      {showIcon && (
        <Ionicons
          name={locked ? 'lock-closed' : 'diamond'}
          size={dims.iconSize}
          color={locked ? '#6B7280' : '#FFFFFF'}
          style={{ marginRight: 3 }}
        />
      )}
      {showLabel && (
        <Text
          style={[
            styles.label,
            {
              fontSize: dims.fontSize,
              color: locked ? '#9CA3AF' : '#FFFFFF',
            },
          ]}
        >
          {locked ? t('premium.badge_locked') : t('premium.badge_pro')}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
  },
  label: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
