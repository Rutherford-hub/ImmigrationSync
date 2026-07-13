import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BrandColors } from '@/constants/Colors';
import TopBar from '@/components/TopBar';
import GlassCard from '@/components/GlassCard';
import MaterialIcon from '@/components/MaterialIcon';
import { useApp } from '@/context/AppContext';

export default function CasesScreen() {
  const router = useRouter();
  const { user, activeCase } = useApp();

  const displayName = user?.name || 'Applicant';

  const handleSupportContact = () => {
    Alert.alert(
      'Support Requested',
      'Connecting to the ImmigraSync 24/7 help desk...',
      [{ text: 'Dismiss' }]
    );
  };

  if (!activeCase) {
    return (
      <View style={styles.outerContainer}>
        <TopBar title="Track Application" showBack={false} />
        <View style={styles.emptyContainer}>
          <GlassCard style={styles.emptyCard}>
            <View style={styles.emptyIconBg}>
              <MaterialIcon name="folder_off" size={40} color={BrandColors.primary} />
            </View>
            <Text style={styles.emptyTitle}>No Active Case Tracked</Text>
            <Text style={styles.emptySubtitle}>
              You currently have no active applications. Submit a passport or visa application from the dashboard to track your real-time status.
            </Text>
            <TouchableOpacity 
              style={styles.emptyBtn} 
              onPress={() => router.push('/(tabs)')}
              activeOpacity={0.8}
            >
              <Text style={styles.emptyBtnText}>Go to Dashboard</Text>
            </TouchableOpacity>
          </GlassCard>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
      <TopBar title="Track Application" showBack={false} />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Applicant Info Card */}
        <GlassCard style={styles.infoCard}>
          <View style={styles.badgeRow}>
            <View style={styles.activeBadge}>
              <Text style={styles.badgeText}>Active</Text>
            </View>
          </View>
          
          <Text style={styles.appNoLabel}>APPLICATION NUMBER</Text>
          <Text style={styles.appNo}>{activeCase.appNumber}</Text>

          <View style={styles.detailsGrid}>
            <View style={styles.gridColumn}>
              <Text style={styles.gridLabel}>Applicant</Text>
              <Text style={styles.gridValue}>{displayName}</Text>
            </View>
            <View style={styles.gridColumn}>
              <Text style={styles.gridLabel}>Visa Type</Text>
              <Text style={styles.gridValue}>{activeCase.visaType}</Text>
            </View>
          </View>
        </GlassCard>

        {/* Timeline container card */}
        <View style={styles.timelineSection}>
          <Text style={styles.timelineTitle}>Journey Progress</Text>

          <GlassCard style={styles.timelineCard}>
            <View style={styles.timelineWrapper}>
              {/* Vertical line indicator */}
              <View style={styles.verticalTimelineLine} />

              {/* Loop through case stages */}
              {(activeCase.stages || []).map((stage, index) => {
                const isCompleted = stage.status === 'completed';
                const isInProgress = stage.status === 'in_progress';
                const isPending = stage.status === 'pending';

                return (
                  <View key={index} style={styles.stageRow}>
                    {/* Node marker */}
                    <View style={styles.nodeContainer}>
                      {isCompleted ? (
                        <View style={[styles.nodeCircle, styles.nodeCompleted]}>
                          <MaterialIcon name="check" size={14} color="#ffffff" />
                        </View>
                      ) : isInProgress ? (
                        <View style={[styles.nodeCircle, styles.nodeInProgress]}>
                          <MaterialIcon name="hourglass_top" size={14} color="#ffffff" />
                        </View>
                      ) : (
                        <View style={[styles.nodeCircle, styles.nodePending]}>
                          <MaterialIcon name="verified" size={14} color={BrandColors.outline} />
                        </View>
                      )}
                    </View>

                    {/* Stage Details */}
                    <View style={styles.stageContent}>
                      <View style={styles.stageHeader}>
                        <Text
                          style={[
                            styles.stageTitleText,
                            isInProgress && styles.stageTitleActive,
                            isPending && styles.stageTitlePending,
                          ]}
                        >
                          {stage.title}
                        </Text>
                        <View
                          style={[
                            styles.statusBadge,
                            isCompleted && styles.badgeCompleted,
                            isInProgress && styles.badgeInProgress,
                            isPending && styles.badgePending,
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusBadgeText,
                              isCompleted && styles.textCompleted,
                              isInProgress && styles.textInProgress,
                              isPending && styles.textPending,
                            ]}
                          >
                            {isCompleted ? 'Completed' : isInProgress ? 'In Progress' : 'Pending'}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.stageDescription}>{stage.description}</Text>
                      
                      {stage.date && (
                        <View style={styles.metaRow}>
                          <MaterialIcon name="calendar_today" size={12} color={BrandColors.success} />
                          <Text style={styles.metaText}>{stage.date}</Text>
                        </View>
                      )}

                      {stage.estimatedCompletion && (
                        <View style={styles.estimateBox}>
                          <Text style={styles.estimateText}>
                            Estimated Completion: {stage.estimatedCompletion}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </GlassCard>
        </View>

        {/* Technical Help Banner */}
        <View style={styles.helpBanner}>
          <View style={styles.helpLeft}>
            <View style={styles.helpIconBg}>
              <MaterialIcon name="support_agent" size={20} color={BrandColors.accentBlue} />
            </View>
            <View style={styles.helpTextContainer}>
              <Text style={styles.helpTitle}>Need technical help?</Text>
              <Text style={styles.helpSub}>Support is active 24/7 for filing queries.</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.helpBtn} onPress={handleSupportContact}>
            <Text style={styles.helpBtnText}>Contact</Text>
          </TouchableOpacity>
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
    paddingBottom: 110, // Avoid bottom floating nav bar
  },
  infoCard: {
    marginBottom: 20,
    position: 'relative',
  },
  badgeRow: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  activeBadge: {
    backgroundColor: BrandColors.primaryContainer,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  appNoLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: BrandColors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  appNo: {
    fontSize: 22,
    fontWeight: '700',
    color: BrandColors.primaryContainer,
    marginBottom: 16,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(10, 35, 66, 0.05)',
    paddingTop: 16,
  },
  gridColumn: {
    width: '48%',
  },
  gridLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: BrandColors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  gridValue: {
    fontSize: 16,
    fontWeight: '700',
    color: BrandColors.text,
  },
  timelineSection: {
    marginBottom: 20,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: BrandColors.primaryContainer,
    marginBottom: 12,
    paddingLeft: 4,
  },
  timelineCard: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  timelineWrapper: {
    position: 'relative',
  },
  verticalTimelineLine: {
    position: 'absolute',
    left: 17,
    top: 8,
    bottom: 24,
    width: 2,
    backgroundColor: 'rgba(10, 35, 66, 0.08)',
  },
  stageRow: {
    flexDirection: 'row',
    marginBottom: 28,
  },
  nodeContainer: {
    width: 36,
    alignItems: 'center',
  },
  nodeCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  nodeCompleted: {
    backgroundColor: BrandColors.success,
  },
  nodeInProgress: {
    backgroundColor: BrandColors.accentBlue,
  },
  nodePending: {
    backgroundColor: '#dfe0e0',
  },
  stageContent: {
    flex: 1,
    paddingLeft: 12,
  },
  stageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  stageTitleText: {
    fontSize: 16,
    fontWeight: '700',
    color: BrandColors.primaryContainer,
  },
  stageTitleActive: {
    color: BrandColors.accentBlue,
  },
  stageTitlePending: {
    color: BrandColors.textSecondary,
    fontWeight: '500',
  },
  stageDescription: {
    fontSize: 13,
    color: BrandColors.textSecondary,
    lineHeight: 18,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeCompleted: {
    backgroundColor: 'rgba(28, 159, 62, 0.08)',
  },
  badgeInProgress: {
    backgroundColor: 'rgba(0, 86, 210, 0.08)',
  },
  badgePending: {
    backgroundColor: 'rgba(93, 95, 95, 0.08)',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  textCompleted: {
    color: BrandColors.success,
  },
  textInProgress: {
    color: BrandColors.accentBlue,
  },
  textPending: {
    color: BrandColors.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '600',
    color: BrandColors.success,
  },
  estimateBox: {
    backgroundColor: 'rgba(0, 86, 210, 0.04)',
    borderLeftWidth: 3,
    borderLeftColor: BrandColors.accentBlue,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  estimateText: {
    fontSize: 12,
    fontWeight: '600',
    color: BrandColors.accentBlue,
  },
  helpBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: BrandColors.outlineVariant,
    borderRadius: 18,
    padding: 16,
  },
  helpLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  helpIconBg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0, 86, 210, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  helpTextContainer: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: BrandColors.primaryContainer,
  },
  helpSub: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    marginTop: 2,
  },
  helpBtn: {
    backgroundColor: BrandColors.primaryContainer,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  helpBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
    width: '100%',
  },
  emptyIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(10, 35, 66, 0.04)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: BrandColors.primaryContainer,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: BrandColors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  emptyBtn: {
    backgroundColor: BrandColors.primaryContainer,
    height: 44,
    paddingHorizontal: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0a2342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
