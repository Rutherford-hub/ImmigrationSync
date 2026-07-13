import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { BrandColors } from '@/constants/Colors';
import MaterialIcon from './MaterialIcon';
import { useApp } from '@/context/AppContext';

type TopBarProps = {
  title?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  showProfile?: boolean;
  profileImage?: string;
  onNotificationPress?: () => void;
};

export default function TopBar({
  title = 'ImmigraSync',
  showBack = false,
  onBackPress,
  showProfile = true,
  profileImage,
  onNotificationPress,
}: TopBarProps) {
  const router = useRouter();
  const { user } = useApp();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.leftSection}>
          {showBack ? (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <MaterialIcon name="arrow_back" size={24} color={BrandColors.primary} />
            </TouchableOpacity>
          ) : showProfile ? (
            <View style={styles.avatarContainer}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>{getInitials()}</Text>
              )}
            </View>
          ) : (
            <View style={styles.brandLogoWrapper}>
              <Image
                source={require('../../assets/images/stitch-logo.png')}
                style={styles.brandLogo}
                resizeMode="contain"
              />
            </View>
          )}

          <Text style={styles.title}>{title}</Text>
        </View>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={onNotificationPress || (() => router.push('/notifications'))}
          activeOpacity={0.7}
        >
          <MaterialIcon name="notifications" size={24} color={BrandColors.primaryContainer} />
          <View style={styles.badge} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(30, 58, 39, 0.05)',
    zIndex: 100,
    ...Platform.select({
      android: {
        paddingTop: 10,
      },
    }),
  },
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 20,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: BrandColors.accentBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: '#ffffff',
    overflow: 'hidden',
    boxShadow: `0px 2px 3px ${BrandColors.accentBlue}1a`,
    elevation: 2,
  } as any,
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  brandLogoWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(10, 35, 66, 0.08)',
    overflow: 'hidden',
    boxShadow: '0px 2px 4px rgba(10, 35, 66, 0.06)',
    elevation: 1,
  } as any,
  brandLogo: {
    width: 22,
    height: 22,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: BrandColors.primaryContainer,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 58, 39, 0.02)',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BrandColors.error,
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
});