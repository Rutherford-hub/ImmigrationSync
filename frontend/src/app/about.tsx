import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BrandColors } from '@/constants/Colors';
import GlassCard from '@/components/GlassCard';
import MaterialIcon from '@/components/MaterialIcon';

export default function AboutScreen() {
  const router = useRouter();

  return (
    <View style={styles.outerContainer}>
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcon name="arrow_back" size={24} color={BrandColors.primaryContainer} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>About ImmigrationSync</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Main Brand Section */}
        <View style={styles.brandHero}>
          <View style={styles.logoOrb}>
            <Image 
              source={require('../../assets/images/stitch-logo.png')} 
              style={styles.logoImage}
            />
          </View>
          <Text style={styles.appName}>ImmigrationSync</Text>
          <Text style={styles.appVersion}>Version 1.4.2 (Official Release)</Text>
        </View>

        {/* Partnership / Authorities card */}
        <GlassCard style={styles.infoCard}>
          <View style={styles.authoritiesRow}>
            <MaterialIcon name="verified_user" size={32} color={BrandColors.accentBlue} />
            <View style={styles.authorityTextCol}>
              <Text style={styles.authorityTitle}>Authorized Agency System</Text>
              <Text style={styles.authoritySub}>
                Jointly powered by the Ghana Immigration Service (GIS) and the Ministry of the Interior, Republic of Ghana.
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* Platform Purpose */}
        <Text style={styles.sectionTitle}>Platform Overview</Text>
        <GlassCard style={styles.detailCard}>
          <Text style={styles.detailText}>
            ImmigrationSync is Ghana's secure biometric processing node designed to synchronize civil identity data with travel permit systems. By linking the National Identification Authority (NIA) Ghana Card records to active visa or passport applications, the system reduces biometric vetting time by up to 80%.
          </Text>
          
          <View style={styles.featureItem}>
            <View style={styles.bulletDot} />
            <Text style={styles.featureText}>Secure biometric verification</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.bulletDot} />
            <Text style={styles.featureText}>Direct National Identity Database syncing</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.bulletDot} />
            <Text style={styles.featureText}>Real-time application status tracking</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.bulletDot} />
            <Text style={styles.featureText}>Digitized appointment booking and alerts</Text>
          </View>
        </GlassCard>

        {/* Security & Isolation */}
        <Text style={styles.sectionTitle}>Privacy & Security</Text>
        <GlassCard style={styles.detailCard}>
          <View style={styles.securityRow}>
            <MaterialIcon name="lock" size={20} color={BrandColors.success} style={{ marginRight: 8, marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.securityTitle}>Full Cryptographic Encryption</Text>
              <Text style={styles.securityDesc}>
                All uploaded data including National Identity Numbers (Ghana Cards) and high-resolution biometric passport images are encrypted end-to-end (AES-256) before storage on government servers.
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* Developer / Platform credit */}
        <Text style={styles.developerCredit}>
          Republic of Ghana © 2026. All rights reserved.
        </Text>

        {/* Back link */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
          <Text style={styles.backLinkText}>Back to Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerSafeArea: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(10, 35, 66, 0.05)',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(10, 35, 66, 0.02)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: BrandColors.primaryContainer,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },
  brandHero: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoOrb: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0a2342',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(10, 35, 66, 0.03)',
    marginBottom: 12,
    overflow: 'hidden',
  },
  logoImage: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
  appName: {
    fontSize: 22,
    fontWeight: '800',
    color: BrandColors.primaryContainer,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  appVersion: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    fontWeight: '500',
    marginTop: 4,
  },
  infoCard: {
    padding: 16,
    marginBottom: 24,
  },
  authoritiesRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorityTextCol: {
    flex: 1,
    marginLeft: 12,
  },
  authorityTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: BrandColors.primaryContainer,
    marginBottom: 4,
  },
  authoritySub: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    lineHeight: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: BrandColors.primaryContainer,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingLeft: 4,
  },
  detailCard: {
    padding: 16,
    marginBottom: 20,
  },
  detailText: {
    fontSize: 13,
    color: BrandColors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: BrandColors.accentBlue,
    marginRight: 8,
  },
  featureText: {
    fontSize: 12,
    color: BrandColors.text,
    fontWeight: '600',
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  securityTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: BrandColors.primaryContainer,
    marginBottom: 4,
  },
  securityDesc: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    lineHeight: 16,
  },
  developerCredit: {
    fontSize: 11,
    color: BrandColors.outline,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  backLink: {
    alignItems: 'center',
    padding: 12,
    marginTop: 10,
  },
  backLinkText: {
    color: BrandColors.accentBlue,
    fontSize: 14,
    fontWeight: '600',
  },
});
