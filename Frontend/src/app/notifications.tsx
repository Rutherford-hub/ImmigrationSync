import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BrandColors } from '@/constants/Colors';
import GlassCard from '@/components/GlassCard';
import MaterialIcon from '@/components/MaterialIcon';
import TopBar from '@/components/TopBar';
import { useApp } from '@/context/AppContext';

export default function NotificationsScreen() {
  const router = useRouter();
  const { activeCase, appointments, passportPicUri, ghanaCardFrontUri, ghanaCardBackUri } = useApp();

  const mockSystemNotification = {
    id: 'system-welcome',
    title: 'Welcome to ImmigrationSync',
    desc: 'Jointly powered by the Ghana Immigration Service (GIS). Start by completing your profile and uploading identity documents.',
    time: 'Just now',
    icon: 'security',
    color: BrandColors.accentBlue,
    bgColor: 'rgba(0, 86, 210, 0.08)',
  };

  const hasNotifications = !!(activeCase || appointments.length > 0 || passportPicUri || ghanaCardFrontUri || ghanaCardBackUri);

  return (
    <View style={styles.outerContainer}>
      <TopBar title="Notifications" showBack={true} showProfile={false} />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All Recent Notifications</Text>
          <Text style={styles.sectionSubtitle}>
            Real-time biometric scheduling and document status updates from GIS Registry.
          </Text>
        </View>

        <View style={styles.listContainer}>
          {/* Active Case Notification */}
          {activeCase && (
            <GlassCard style={styles.notificationCard}>
              <View style={styles.notificationRow}>
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(0, 86, 210, 0.08)' }]}>
                  <MaterialIcon name="assignment" size={22} color={BrandColors.accentBlue} />
                </View>
                <View style={styles.contentContainer}>
                  <View style={styles.titleRow}>
                    <Text style={styles.notificationTitle}>Application In Progress</Text>
                    <Text style={styles.timeBadge}>ACTIVE</Text>
                  </View>
                  <Text style={styles.notificationText}>
                    Your {activeCase.visaType} application was received successfully. Current Tracking ID: <Text style={styles.boldText}>{activeCase.appNumber}</Text>.
                  </Text>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => router.push('/(tabs)/cases')}
                  >
                    <Text style={styles.actionButtonText}>View Progress Stages</Text>
                    <MaterialIcon name="arrow_forward" size={12} color={BrandColors.accentBlue} />
                  </TouchableOpacity>
                </View>
              </View>
            </GlassCard>
          )}

          {/* Appointment Notification */}
          {appointments.length > 0 && (
            <GlassCard style={styles.notificationCard}>
              <View style={styles.notificationRow}>
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(46, 125, 50, 0.08)' }]}>
                  <MaterialIcon name="calendar_today" size={22} color={BrandColors.success} />
                </View>
                <View style={styles.contentContainer}>
                  <View style={styles.titleRow}>
                    <Text style={styles.notificationTitle}>Biometrics Scheduled</Text>
                    <Text style={[styles.timeBadge, { color: BrandColors.success, backgroundColor: 'rgba(46, 125, 50, 0.08)' }]}>CONFIRMED</Text>
                  </View>
                  <Text style={styles.notificationText}>
                    Your biometric interview is scheduled for <Text style={styles.boldText}>{appointments[0].date}</Text> at <Text style={styles.boldText}>{appointments[0].time}</Text> ({appointments[0].office}).
                  </Text>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => router.push('/(tabs)/appointments')}
                  >
                    <Text style={[styles.actionButtonText, { color: BrandColors.success }]}>Manage Interview</Text>
                    <MaterialIcon name="arrow_forward" size={12} color={BrandColors.success} />
                  </TouchableOpacity>
                </View>
              </View>
            </GlassCard>
          )}

          {/* Passport Photo Notification */}
          {passportPicUri && (
            <GlassCard style={styles.notificationCard}>
              <View style={styles.notificationRow}>
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.08)' }]}>
                  <MaterialIcon name="verified_user" size={22} color={BrandColors.success} />
                </View>
                <View style={styles.contentContainer}>
                  <View style={styles.titleRow}>
                    <Text style={styles.notificationTitle}>Passport Scan Encrypted</Text>
                    <Text style={[styles.timeBadge, { color: BrandColors.success, backgroundColor: 'rgba(16, 185, 129, 0.08)' }]}>SECURED</Text>
                  </View>
                  <Text style={styles.notificationText}>
                    Your biometric digital passport photo has been successfully verified, encrypted, and saved in your secure applicant vault.
                  </Text>
                </View>
              </View>
            </GlassCard>
          )}

          {/* Ghana Card Front Notification */}
          {ghanaCardFrontUri && (
            <GlassCard style={styles.notificationCard}>
              <View style={styles.notificationRow}>
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.08)' }]}>
                  <MaterialIcon name="credit_card" size={22} color={BrandColors.success} />
                </View>
                <View style={styles.contentContainer}>
                  <View style={styles.titleRow}>
                    <Text style={styles.notificationTitle}>Ghana Card Front Scanned</Text>
                    <Text style={[styles.timeBadge, { color: BrandColors.success, backgroundColor: 'rgba(16, 185, 129, 0.08)' }]}>VERIFIED</Text>
                  </View>
                  <Text style={styles.notificationText}>
                    Ghana Card Front scan has been processed and linked. All key details have been imported.
                  </Text>
                </View>
              </View>
            </GlassCard>
          )}

          {/* Ghana Card Back Notification */}
          {ghanaCardBackUri && (
            <GlassCard style={styles.notificationCard}>
              <View style={styles.notificationRow}>
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.08)' }]}>
                  <MaterialIcon name="vpn_key" size={22} color={BrandColors.success} />
                </View>
                <View style={styles.contentContainer}>
                  <View style={styles.titleRow}>
                    <Text style={styles.notificationTitle}>Ghana Card Back Scanned</Text>
                    <Text style={[styles.timeBadge, { color: BrandColors.success, backgroundColor: 'rgba(16, 185, 129, 0.08)' }]}>VERIFIED</Text>
                  </View>
                  <Text style={styles.notificationText}>
                    Ghana Card Back hologram validation and secure chip certificate signature successfully imported.
                  </Text>
                </View>
              </View>
            </GlassCard>
          )}

          {/* Welcome Notification (Always Shown) */}
          <GlassCard style={styles.notificationCard}>
            <View style={styles.notificationRow}>
              <View style={[styles.iconContainer, { backgroundColor: mockSystemNotification.bgColor }]}>
                <MaterialIcon name={mockSystemNotification.icon} size={22} color={mockSystemNotification.color} />
              </View>
              <View style={styles.contentContainer}>
                <View style={styles.titleRow}>
                  <Text style={styles.notificationTitle}>{mockSystemNotification.title}</Text>
                  <Text style={styles.timeBadge}>SYSTEM</Text>
                </View>
                <Text style={styles.notificationText}>
                  {mockSystemNotification.desc}
                </Text>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => router.push('/(tabs)/profile')}
                >
                  <Text style={styles.actionButtonText}>Go to Secure Vault</Text>
                  <MaterialIcon name="arrow_forward" size={12} color={BrandColors.accentBlue} />
                </TouchableOpacity>
              </View>
            </View>
          </GlassCard>
        </View>

        <View style={styles.footerInfo}>
          <MaterialIcon name="info" size={14} color={BrandColors.textSecondary} />
          <Text style={styles.footerText}>
            This application maintains military-grade security. All personal data is encrypted at rest.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#f6faff',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 110,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: BrandColors.primaryContainer,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: BrandColors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  listContainer: {
    gap: 12,
  },
  notificationCard: {
    padding: 16,
    borderRadius: 16,
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  contentContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    flexWrap: 'wrap',
    gap: 6,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: BrandColors.primaryContainer,
  },
  timeBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: BrandColors.accentBlue,
    backgroundColor: 'rgba(0, 86, 210, 0.08)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    overflow: 'hidden',
  },
  notificationText: {
    fontSize: 13,
    color: BrandColors.textSecondary,
    lineHeight: 18,
  },
  boldText: {
    fontWeight: '700',
    color: BrandColors.primaryContainer,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: BrandColors.accentBlue,
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    gap: 6,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 11,
    color: BrandColors.textSecondary,
    textAlign: 'center',
    lineHeight: 15,
    flex: 1,
  },
});
