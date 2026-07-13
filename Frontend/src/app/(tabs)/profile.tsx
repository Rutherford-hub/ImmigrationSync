import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { BrandColors } from '@/constants/Colors';
import TopBar from '@/components/TopBar';
import GlassCard from '@/components/GlassCard';
import MaterialIcon from '@/components/MaterialIcon';
import { useApp } from '@/context/AppContext';

type UploadTarget = 'passport' | 'front' | 'back';

export default function ProfileScreen() {
  const router = useRouter();
  const {
    user,
    logout,
    activeCase,
    passportPicUri,
    uploadPassportPic,
    ghanaCardFrontUri,
    uploadGhanaCardFront,
    ghanaCardBackUri,
    uploadGhanaCardBack,
  } = useApp();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [uploadingTarget, setUploadingTarget] = useState<UploadTarget | null>(null);

  // Fallbacks
  const displayName = user?.name || 'Applicant';
  const displayAppId = user?.appId || 'GHA-000000000-0';

  const getInitials = () => {
    if (user?.name) {
      const parts = user.name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return parts[0].slice(0, 2).toUpperCase();
    }
    if (user?.email) {
      const namePart = user.email.split('@')[0];
      return namePart.slice(0, 2).toUpperCase();
    }
    return 'AP';
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/login');
        },
      },
    ]);
  };

  // Launches the actual OS image picker (library) and returns the picked URI, or null if cancelled.
  const pickFromLibrary = async (): Promise<string | null> => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permission needed',
        'Please allow photo library access in your device settings to upload this document.'
      );
      return null;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (result.canceled || !result.assets?.length) return null;
    return result.assets[0].uri;
  };

  // Launches the device camera and returns the captured URI, or null if cancelled.
  const captureWithCamera = async (): Promise<string | null> => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permission needed',
        'Please allow camera access in your device settings to scan this document.'
      );
      return null;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.85,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (result.canceled || !result.assets?.length) return null;
    return result.assets[0].uri;
  };

  // Shows a Camera / Library choice, then runs the picker and hands the URI to the given setter.
  const runUploadFlow = (target: UploadTarget, onPicked: (uri: string) => void) => {
    Alert.alert('Upload Document', 'Choose how you want to add this document', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Take Photo',
        onPress: async () => {
          setUploadingTarget(target);
          const uri = await captureWithCamera();
          setUploadingTarget(null);
          if (uri) onPicked(uri);
        },
      },
      {
        text: 'Choose from Library',
        onPress: async () => {
          setUploadingTarget(target);
          const uri = await pickFromLibrary();
          setUploadingTarget(null);
          if (uri) onPicked(uri);
        },
      },
    ]);
  };

  const handlePassportUpload = () =>
    runUploadFlow('passport', (uri) => uploadPassportPic(uri));

  const handleFrontUpload = () =>
    runUploadFlow('front', (uri) => uploadGhanaCardFront(uri));

  const handleBackUpload = () =>
    runUploadFlow('back', (uri) => uploadGhanaCardBack(uri));

  // Calculate progress of the 3 mandatory tasks
  let completedTasks = 0;
  if (passportPicUri) completedTasks++;
  if (ghanaCardFrontUri) completedTasks++;
  if (ghanaCardBackUri) completedTasks++;

  const progressPercent = Math.round((completedTasks / 3) * 100);
  const progressStatus =
    completedTasks === 3
      ? 'All mandatory identity uploads complete'
      : `${3 - completedTasks} mandatory verification upload(s) remaining`;

  // Reusable renderer for each of the 3 upload tasks so the JSX below stays clean.
  const renderUploadTask = (params: {
    target: UploadTarget;
    uri: string | null;
    icon: string;
    title: string;
    subtitle: string;
    label: string;
    onUpload: () => void;
    isLast?: boolean;
  }) => {
    const { target, uri, icon, title, subtitle, label, onUpload, isLast } = params;
    const isBusy = uploadingTarget === target;

    return (
      <View style={[styles.taskItem, isLast && { borderBottomWidth: 0, paddingBottom: 0 }]}>
        <View style={styles.taskInfoRow}>
          <View
            style={[
              styles.taskIconCircle,
              { backgroundColor: uri ? 'rgba(16, 185, 129, 0.08)' : 'rgba(10, 35, 66, 0.04)' },
            ]}
          >
            <MaterialIcon
              name={uri ? 'check_circle' : icon}
              size={18}
              color={uri ? BrandColors.success : BrandColors.primary}
            />
          </View>
          <View style={styles.taskTextCol}>
            <Text style={styles.taskTitle}>{title}</Text>
            <Text style={styles.taskSub}>{subtitle}</Text>
          </View>
          {uri ? (
            <View style={styles.verifiedLabel}>
              <Text style={styles.verifiedLabelText}>Uploaded</Text>
            </View>
          ) : (
            <View style={styles.requiredLabel}>
              <Text style={styles.requiredLabelText}>Mandatory</Text>
            </View>
          )}
        </View>

        {!uri ? (
          <TouchableOpacity
            style={styles.taskUploadBtn}
            onPress={onUpload}
            disabled={isBusy}
            activeOpacity={0.8}
          >
            {isBusy ? (
              <ActivityIndicator size="small" color="#ffffff" style={{ marginRight: 6 }} />
            ) : (
              <MaterialIcon name="file_upload" size={14} color="#ffffff" style={{ marginRight: 4 }} />
            )}
            <Text style={styles.taskUploadBtnText}>{isBusy ? 'Uploading...' : label}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.previewDocumentContainer}>
            <Image source={{ uri }} style={styles.uploadedPreviewThumbnail} />
            <View style={{ flex: 1 }}>
              <Text style={styles.previewDocumentName}>{title}</Text>
              <Text style={styles.previewDocumentStatus}>Uploaded</Text>
            </View>
            <TouchableOpacity onPress={onUpload} style={styles.reuploadBtn}>
              <Text style={styles.reuploadBtnText}>Replace</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.outerContainer}>
      {/* top header bar with title and logout button */}
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <View style={styles.logoIconWrapper}>
              <Image
                source={require('../../../assets/images/stitch-logo.png')}
                style={styles.logoIcon}
              />
            </View>
            <Text style={styles.headerTitle}>ImmigrationSync</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <MaterialIcon name="logout" size={22} color={BrandColors.textSecondary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <GlassCard style={styles.profileCard}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarWrapper}>
              {passportPicUri ? (
                <Image source={{ uri: passportPicUri }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.profileMonogramText}>{getInitials()}</Text>
              )}
              <TouchableOpacity
                style={styles.editAvatarBtn}
                activeOpacity={0.7}
                onPress={handlePassportUpload}
              >
                {uploadingTarget === 'passport' ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <MaterialIcon name="edit" size={14} color="#ffffff" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.profileName}>{displayName}</Text>
          <Text style={styles.profileAppId}>App ID: {displayAppId}</Text>

          {completedTasks === 3 && (
            <View style={styles.verifiedBadge}>
              <MaterialIcon name="verified" size={16} color="#83fc8e" style={{ marginRight: 4 }} />
              <Text style={styles.verifiedText}>Identity Verified</Text>
            </View>
          )}
        </GlassCard>

        {/* Mandatory Identity Uploads card */}
        <GlassCard style={styles.docsCard}>
          <View style={styles.docsHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.docsCardTitle}>Mandatory ID Uploads</Text>
              <Text style={styles.docsCardSub}>{progressStatus}</Text>
            </View>
            <Text style={styles.docsCardPercent}>{progressPercent}%</Text>
          </View>

          {/* Progress bar */}
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>

          {renderUploadTask({
            target: 'passport',
            uri: passportPicUri,
            icon: 'account_box',
            title: 'Passport Photo',
            subtitle: 'Serves as active biometric profile pic',
            label: 'Upload Photo',
            onUpload: handlePassportUpload,
          })}

          {renderUploadTask({
            target: 'front',
            uri: ghanaCardFrontUri,
            icon: 'credit_card',
            title: 'Ghana Card Front',
            subtitle: 'Scan of front-face card credentials',
            label: 'Upload Front',
            onUpload: handleFrontUpload,
          })}

          {renderUploadTask({
            target: 'back',
            uri: ghanaCardBackUri,
            icon: 'credit_card',
            title: 'Ghana Card Back',
            subtitle: 'Scan of back security credentials',
            label: 'Upload Back',
            onUpload: handleBackUpload,
            isLast: true,
          })}
        </GlassCard>

        {/* Preferences Sections */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionHeader}>Preferences</Text>

          {/* Notifications */}
          <View style={styles.settingsRow}>
            <View style={styles.settingsLabelCol}>
              <View style={styles.settingIconBg}>
                <MaterialIcon name="notifications_active" size={18} color={BrandColors.primaryContainer} />
              </View>
              <View>
                <Text style={styles.settingLabelTitle}>Notifications</Text>
                <Text style={styles.settingLabelSub}>Push alerts & emails</Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#dfe0e0', true: BrandColors.accentBlue }}
              thumbColor={Platform.OS === 'android' ? '#ffffff' : undefined}
            />
          </View>

          {/* Language */}
          <TouchableOpacity style={styles.settingsRow} activeOpacity={0.7}>
            <View style={styles.settingsLabelCol}>
              <View style={styles.settingIconBg}>
                <MaterialIcon name="language" size={18} color={BrandColors.primaryContainer} />
              </View>
              <View>
                <Text style={styles.settingLabelTitle}>Language</Text>
                <Text style={styles.settingLabelSub}>English (US)</Text>
              </View>
            </View>
            <MaterialIcon name="chevron_right" size={20} color={BrandColors.outline} />
          </TouchableOpacity>
        </View>

        {/* Security & Support Section */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionHeader}>Support & System</Text>

          {/* Security details */}
          <TouchableOpacity style={styles.settingsRow} activeOpacity={0.7}>
            <View style={styles.settingsLabelCol}>
              <View style={styles.settingIconBg}>
                <MaterialIcon name="lock" size={18} color={BrandColors.primaryContainer} />
              </View>
              <View>
                <Text style={styles.settingLabelTitle}>Security</Text>
                <Text style={styles.settingLabelSub}>Password & Biometrics</Text>
              </View>
            </View>
            <MaterialIcon name="chevron_right" size={20} color={BrandColors.outline} />
          </TouchableOpacity>

          {/* Help & Support */}
          <TouchableOpacity
            style={styles.settingsRow}
            activeOpacity={0.7}
            onPress={() => router.push('/contact')}
          >
            <View style={styles.settingsLabelCol}>
              <View style={styles.settingIconBg}>
                <MaterialIcon name="help_outline" size={18} color={BrandColors.primaryContainer} />
              </View>
              <View>
                <Text style={styles.settingLabelTitle}>Help & Support</Text>
                <Text style={styles.settingLabelSub}>Contact helpline & file query</Text>
              </View>
            </View>
            <MaterialIcon name="chevron_right" size={20} color={BrandColors.outline} />
          </TouchableOpacity>

          {/* About Screen */}
          <TouchableOpacity
            style={[styles.settingsRow, { marginBottom: 12 }]}
            activeOpacity={0.7}
            onPress={() => router.push('/about')}
          >
            <View style={styles.settingsLabelCol}>
              <View style={styles.settingIconBg}>
                <MaterialIcon name="info" size={18} color={BrandColors.primaryContainer} />
              </View>
              <View>
                <Text style={styles.settingLabelTitle}>About Agency Portal</Text>
                <Text style={styles.settingLabelSub}>System version & specifications</Text>
              </View>
            </View>
            <MaterialIcon name="chevron_right" size={20} color={BrandColors.outline} />
          </TouchableOpacity>
        </View>
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
    borderBottomColor: 'rgba(30, 58, 39, 0.05)',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    boxShadow: '0px 2px 4px rgba(10, 35, 66, 0.06)',
    elevation: 1,
    borderWidth: 1,
    borderColor: 'rgba(10, 35, 66, 0.08)',
    overflow: 'hidden',
  },
  logoIcon: {
    width: 22,
    height: 22,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: BrandColors.primaryContainer,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(10, 35, 66, 0.02)',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 110,
  },
  profileCard: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 28,
    backgroundColor: BrandColors.primaryContainer,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },
  avatarRow: {
    marginBottom: 16,
  },
  avatarWrapper: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: BrandColors.accentBlue,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
    boxShadow: `0px 4px 8px ${BrandColors.accentBlue}33`,
    elevation: 4,
    position: 'relative',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 39,
  },
  profileMonogramText: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 1,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: BrandColors.accentBlue,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: BrandColors.primaryContainer,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
  },
  profileName: {
    fontSize: 19,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    textAlign: 'center',
  },
  profileAppId: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.65)',
    marginTop: 4,
    textAlign: 'center',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginTop: 14,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  docsCard: {
    marginBottom: 20,
  },
  docsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  docsCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: BrandColors.primaryContainer,
  },
  docsCardSub: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    marginTop: 2,
  },
  docsCardPercent: {
    fontSize: 20,
    fontWeight: '700',
    color: BrandColors.accentBlue,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(10, 35, 66, 0.05)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: BrandColors.accentBlue,
    borderRadius: 4,
  },
  taskItem: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(10, 35, 66, 0.06)',
    paddingVertical: 12,
    marginBottom: 10,
  },
  taskInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  taskIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  taskTextCol: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: BrandColors.primaryContainer,
  },
  taskSub: {
    fontSize: 10,
    color: BrandColors.textSecondary,
    marginTop: 1,
  },
  verifiedLabel: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  verifiedLabelText: {
    fontSize: 9,
    fontWeight: '700',
    color: BrandColors.success,
  },
  requiredLabel: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  requiredLabelText: {
    fontSize: 9,
    fontWeight: '700',
    color: BrandColors.error,
  },
  taskUploadBtn: {
    backgroundColor: BrandColors.accentBlue,
    borderRadius: 8,
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    boxShadow: `0px 2px 3px ${BrandColors.accentBlue}1a`,
    elevation: 1,
  },
  taskUploadBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  previewDocumentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.04)',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  previewDocumentName: {
    fontSize: 10,
    fontWeight: '700',
    color: BrandColors.primaryContainer,
  },
  previewDocumentStatus: {
    fontSize: 9,
    color: BrandColors.success,
    fontWeight: '600',
    marginTop: 1,
  },
  uploadedPreviewThumbnail: {
    width: 36,
    height: 36,
    borderRadius: 6,
    marginRight: 10,
    backgroundColor: '#e5e7eb',
  },
  reuploadBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: BrandColors.outline,
    backgroundColor: '#ffffff',
  },
  reuploadBtnText: {
    fontSize: 10,
    fontWeight: '600',
    color: BrandColors.textSecondary,
  },
  settingsSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: BrandColors.outline,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingLeft: 6,
    marginBottom: 8,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: BrandColors.outlineVariant,
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    boxShadow: '0px 2px 4px rgba(10, 35, 66, 0.03)',
    elevation: 1,
  },
  settingsLabelCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(10, 35, 66, 0.02)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingLabelTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: BrandColors.primaryContainer,
  },
  settingLabelSub: {
    fontSize: 11,
    color: BrandColors.textSecondary,
    marginTop: 1,
  },
});