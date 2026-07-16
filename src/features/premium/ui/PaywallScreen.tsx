import { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme, colors } from '@/shared/config/ThemeContext';
import { UpgradeButton } from "@/shared/ui";
import type { IoniconsName } from '@/shared/lib/iconTypes';
import {
  usePremiumStore,
  usePurchaseStatus,
  usePurchaseError,
  useProducts,
} from '../model/premiumStore';
import { useAuthStore } from '@/features/auth/model/authStore';
import { PREMIUM_PRODUCT_IDS } from '@/shared/config/subscription';

type FeatureItem = {
  icon: IoniconsName;
  titleKey: string;
  descKey: string;
};

const FEATURES: FeatureItem[] = [
  { icon: "infinite-outline", titleKey: 'premium.feature_unlimited_items', descKey: 'premium.limit_reached_message' },
  { icon: "layers-outline", titleKey: 'premium.feature_custom_categories', descKey: 'premium.custom_categories_message' },
  { icon: "list-outline", titleKey: 'premium.feature_custom_fields', descKey: 'premium.custom_fields_message' },
  { icon: "finger-print-outline", titleKey: 'premium.feature_biometric_lock', descKey: 'premium.biometric_message' },
  { icon: "cloud-done-outline", titleKey: 'premium.feature_cloud_sync', descKey: 'premium.cloud_sync_message' },
  { icon: "download-outline", titleKey: 'premium.feature_export_vault', descKey: 'premium.export_message' },
];

export function PaywallScreen() {
  const { t } = useTranslation();
  const { tokens } = useTheme();

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
  const isLoading = purchaseStatus === 'loading_products';

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
      <SafeAreaView style={[styles.flex, { backgroundColor: tokens.bg }]}>
        <View style={styles.alreadyWrap}>
          <Ionicons name="shield-checkmark" size={64} color={colors.brand.gold} />
          <Text style={[styles.alreadyTitle, { color: tokens.text }]}>
            {t('premium.title')}
          </Text>
          <Text style={[styles.alreadySub, { color: tokens.muted }]}>
            {t('premium.already_premium')}
          </Text>
          <TouchableOpacity style={styles.backLink} onPress={() => router.back()}>
            <Text style={[styles.backLinkText, { color: colors.brand.blue }]}>
              {`← ${t('common.back')}`}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: tokens.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: tokens.text }]}>{t('premium.title')}</Text>
          <Text style={[styles.subtitle, { color: tokens.muted }]}>
            {t('premium.subtitle')}
          </Text>
        </View>

        {/* Pricing */}
        <View style={[styles.pricingCard, {
          backgroundColor: tokens.surface,
          borderColor: colors.brand.gold + "44",
        }]}>
          <Ionicons name="diamond" size={28} color={colors.brand.gold} />
          <Text style={[styles.price, { color: tokens.text }]}>
            {products[0]?.price ?? t('premium.price_idr')}
          </Text>
          <Text style={[styles.priceLabel, { color: tokens.subtle }]}>
            {t('premium.one_time_purchase')}
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresWrap}>
          {FEATURES.map((f, i) => (
            <View key={i} style={[styles.featureRow, {
              backgroundColor: tokens.surface,
              borderColor: tokens.border,
            }]}>
              <View style={[styles.featureIcon, {
                backgroundColor: colors.brand.blue + "22",
              }]}>
                <Ionicons name={f.icon} size={20} color={colors.brand.blue} />
              </View>
              <View style={styles.featureText}>
                <Text style={[styles.featureTitle, { color: tokens.text }]}>
                  {t(f.titleKey)}
                </Text>
                <Text style={[styles.featureDesc, { color: tokens.muted }]}>
                  {t(f.descKey)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* CTA */}
        <View style={styles.ctaWrap}>
          <UpgradeButton
            onPress={handleUpgrade}
            loading={isPurchasing || isLoading}
            disabled={isPurchasing || isRestoring || isLoading}
            size="lg"
          />
          <TouchableOpacity
            style={styles.restoreBtn}
            onPress={handleRestore}
            disabled={isRestoring}
          >
            <Text style={[styles.restoreText, { color: tokens.subtle }]}>
              {isRestoring ? t('premium.loading') : t('premium.restore_purchase')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { paddingBottom: 40 },

  // Already premium
  alreadyWrap: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 32, gap: 12,
  },
  alreadyTitle: { fontSize: 22, fontWeight: '700', textAlign: 'center' },
  alreadySub: { fontSize: 14, textAlign: 'center' },
  backLink: { marginTop: 16 },
  backLinkText: { fontSize: 14, fontWeight: '500' },

  // Header
  header: { padding: 24, paddingBottom: 8 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 6 },
  subtitle: { fontSize: 14, lineHeight: 20 },

  // Pricing
  pricingCard: {
    marginHorizontal: 20, marginTop: 16,
    borderRadius: 20, borderWidth: 1.5,
    padding: 24, alignItems: 'center', gap: 8,
  },
  price: { fontSize: 34, fontWeight: '800' },
  priceLabel: { fontSize: 13 },

  // Features
  featuresWrap: { paddingHorizontal: 20, marginTop: 20, gap: 10 },
  featureRow: {
    flexDirection: 'row', gap: 14,
    padding: 14, borderRadius: 14,
    borderWidth: 0.5, alignItems: 'center',
  },
  featureIcon: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  featureDesc: { fontSize: 12, lineHeight: 17 },

  // CTA
  ctaWrap: { padding: 20, gap: 12 },
  restoreBtn: { paddingVertical: 12, alignItems: 'center' },
  restoreText: { fontSize: 14, fontWeight: '500' },
});
