import { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { useTheme, colors } from '@/shared/config/ThemeContext';
import { PremiumCard, UpgradeButton } from "@/shared/ui";
import {
  usePremiumStore,
  usePurchaseStatus,
  usePurchaseError,
  useProducts,
} from '../model/premiumStore';
import { useAuthStore } from '@/features/auth/model/authStore';
import { PREMIUM_PRODUCT_IDS } from '@/shared/config/subscription';

export function PaywallScreen() {
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();

  const purchaseStatus = usePurchaseStatus();
  const purchaseError = usePurchaseError();
  const products = useProducts();
  const buyPremium = usePremiumStore((s) => s.buyPremium);
  const restorePremium = usePremiumStore((s) => s.restorePremium);
  const initIap = usePremiumStore((s) => s.initIap);
  const clearPurchaseError = usePremiumStore((s) => s.clearPurchaseError);
  const subscriptionTier = usePremiumStore((s) => s.subscriptionTier);

  const isAlreadyPremium = subscriptionTier === 'premium';
  const isPurchasing = purchaseStatus === 'purchasing';
  const isRestoring = purchaseStatus === 'restoring';
  const userId = useAuthStore((s) => s.user?.id ?? '');

  const features = [
    { icon: '💾', titleKey: 'premium.feature_unlimited_items', descKey: 'premium.limit_reached_message' as const },
    { icon: '🗂️', titleKey: 'premium.feature_custom_categories', descKey: 'premium.custom_categories_message' as const },
    { icon: '⚡', titleKey: 'premium.feature_custom_fields', descKey: 'premium.custom_fields_message' as const },
    { icon: '👁️', titleKey: 'premium.feature_biometric_lock', descKey: 'premium.biometric_message' as const },
    { icon: '☁️', titleKey: 'premium.feature_cloud_sync', descKey: 'premium.cloud_sync_message' as const },
    { icon: '📄', titleKey: 'premium.feature_export_vault', descKey: 'premium.export_message' as const },
  ];

  const compareItems = [
    'premium.feature_unlimited_items', 'premium.feature_custom_categories', 'premium.feature_custom_fields',
    'premium.feature_biometric_lock', 'premium.feature_cloud_sync', 'premium.feature_export_vault',
  ] as const;

  useEffect(() => {
    if (isAlreadyPremium) return;
    const ids = PREMIUM_PRODUCT_IDS.production;
    initIap(ids.ios);
  }, []);

  useEffect(() => {
    if (purchaseStatus === 'success') {
      Alert.alert(t('premium.success'), '', [
        { text: t('common.ok'), onPress: () => router.back() },
      ]);
    }
  }, [purchaseStatus]);

  useEffect(() => {
    if (purchaseError) {
      Alert.alert(t('premium.error'), purchaseError, [
        { text: t('common.ok'), onPress: clearPurchaseError },
      ]);
    }
  }, [purchaseError]);

  const handleUpgrade = () => {
    const productId = products[0]?.id ?? 'passandi_premium_lifetime';
    buyPremium(productId, userId);
  };

  const handleRestore = async () => {
    const result = await restorePremium(userId);
    if (result === null) {
      Alert.alert(t('premium.info'), t('common.cancel'));
    }
  };

  if (isAlreadyPremium) {
    return (
      <ScrollView style={[styles.container, { backgroundColor: tokens.bg }]}
        contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={[styles.header, {
          backgroundColor: tokens.surface, borderBottomColor: tokens.border,
          paddingTop: insets.top + 12,
        }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={[styles.backText, { color: colors.brand.blue }]}>← {t('common.back')}</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: tokens.text }]}>{t('premium.title')}</Text>
          <Text style={[styles.subtitle, { color: tokens.muted }]}>{t('premium.already_premium')}</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: tokens.bg }]}
      contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={[styles.header, {
        backgroundColor: tokens.surface, borderBottomColor: tokens.border,
        paddingTop: insets.top + 12,
      }]}>
        <Text style={[styles.title, { color: tokens.text }]}>{t('premium.title')}</Text>
        <Text style={[styles.subtitle, { color: tokens.muted }]}>{t('premium.subtitle')}</Text>
      </View>

      <View style={[styles.pricing, {
        backgroundColor: tokens.surface, borderColor: tokens.border,
      }]}>
        <View style={styles.priceBox}>
          <Text style={[styles.priceLabel, { color: tokens.subtle }]}>
            {t('premium.lifetime_access')}
          </Text>
          <Text style={[styles.price, { color: tokens.text }]}>
            {products[0]?.price ?? t('premium.price_idr')}
          </Text>
          <Text style={[styles.priceSub, { color: tokens.subtle }]}>
            {t('premium.one_time_purchase')}
          </Text>
        </View>
      </View>

      <View style={styles.features}>
        <Text style={[styles.featuresTitle, { color: tokens.text }]}>
          {t('premium.subtitle')}
        </Text>
        <View style={styles.featuresGrid}>
          {features.map((f, i) => (
            <PremiumCard
              key={i}
              icon={f.icon}
              title={t(f.titleKey)}
              description={t(f.descKey, { count: 10 })}
              isPremiumFeature={true}
              isLocked={true}
              onUpgrade={handleUpgrade}
            />
          ))}
        </View>
      </View>

      <View style={[styles.compare, {
        backgroundColor: tokens.surface, borderColor: tokens.border,
      }]}>
        <Text style={[styles.compareTitle, { color: tokens.text }]}>
          {t('premium.subtitle')}
        </Text>
        {compareItems.map((key, i) => (
          <View key={i} style={styles.compareRow}>
            <Text style={[styles.compareFeature, { color: tokens.text }]}>
              {t(key)}
            </Text>
            <Text style={styles.freeCol}>❌</Text>
            <Text style={styles.premiumCol}>✅</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={handleRestore}
          disabled={isRestoring}
        >
          <Text style={[styles.secondaryText, { color: tokens.subtle }]}>
            {isRestoring ? t('premium.loading') : t('premium.restore_purchase')}
          </Text>
        </TouchableOpacity>
        <UpgradeButton
          onPress={handleUpgrade}
          loading={isPurchasing}
          disabled={isPurchasing || isRestoring || purchaseStatus === 'loading_products'}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, borderBottomWidth: 1 },
  backBtn: { paddingVertical: 8, paddingHorizontal: 12, alignSelf: 'flex-start', marginBottom: 12 },
  backText: { fontSize: 14, fontWeight: '600' },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 8 },
  subtitle: { fontSize: 14, lineHeight: 20 },
  pricing: { padding: 20, marginHorizontal: 16, borderRadius: 16, marginTop: 20, borderWidth: 1 },
  priceBox: { alignItems: 'center', marginBottom: 16 },
  priceLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  price: { fontSize: 40, fontWeight: '800' },
  priceSub: { fontSize: 13, marginTop: 4 },
  features: { padding: 20 },
  featuresTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  featuresGrid: { gap: 12 },
  compare: { padding: 20, marginHorizontal: 16, borderRadius: 16, marginTop: 20 },
  compareTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  compareRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  compareFeature: { flex: 1, fontSize: 14 },
  freeCol: { fontSize: 16, width: 20, textAlign: 'center' },
  premiumCol: { fontSize: 16, width: 20, textAlign: 'center' },
  footer: { padding: 20, marginTop: 20 },
  secondaryBtn: { paddingVertical: 14, alignItems: 'center', marginBottom: 12 },
  secondaryText: { fontSize: 15, fontWeight: '600' },
});
