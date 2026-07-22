import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BrandColors } from '@/constants/Colors';
import GlassCard from '@/components/GlassCard';
import GlassInput from '@/components/GlassInput';
import CustomButton from '@/components/CustomButton';
import MaterialIcon from '@/components/MaterialIcon';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { identifier, otp } = useLocalSearchParams<{ identifier: string; otp: string }>();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Required', 'Please enter and confirm your new password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Mismatch', 'Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Too Short', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const apiModule = await import('@/services/api');
      await apiModule.apiService.resetPassword(identifier || '', otp || '', newPassword);
      
      Alert.alert(
        'Success',
        'Your password has been successfully reset. Please login with your new password.',
        [
          {
            text: 'Login',
            onPress: () => router.replace('/(auth)/login'),
          },
        ]
      );
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardContainer}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcon name="arrow_back" size={24} color={BrandColors.primaryContainer} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Password</Text>
        </View>

        <View style={styles.canvas}>
          <GlassCard style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.titleText}>Reset Password</Text>
              <Text style={styles.subtitleText}>
                Enter your new password below. Make sure it's secure and at least 6 characters long.
              </Text>
            </View>

            <View style={styles.form}>
              <GlassInput
                label="New Password"
                iconName="lock"
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                isPassword
              />
              
              <GlassInput
                label="Confirm Password"
                iconName="lock"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                isPassword
              />

              <CustomButton
                title="Reset Password"
                onPress={handleResetPassword}
                loading={loading}
                style={styles.submitBtn}
              />
            </View>
          </GlassCard>

          <View style={styles.secureBadge}>
            <MaterialIcon name="lock" size={16} color={BrandColors.outline} />
            <Text style={styles.secureText}>Secure network channel.</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f6faff',
  },
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(10, 35, 66, 0.05)',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: BrandColors.primaryContainer,
    marginLeft: 12,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  canvas: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 48,
  },
  card: {
    width: '100%',
    maxWidth: 440,
  },
  cardHeader: {
    marginBottom: 24,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '700',
    color: BrandColors.primaryContainer,
    marginBottom: 6,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  subtitleText: {
    fontSize: 14,
    color: BrandColors.textSecondary,
    lineHeight: 20,
  },
  form: {
    marginBottom: 12,
  },
  submitBtn: {
    marginTop: 12,
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    opacity: 0.8,
  },
  secureText: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    marginLeft: 6,
  },
});
