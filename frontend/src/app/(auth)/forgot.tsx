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
import { useRouter } from 'expo-router';
import { BrandColors } from '@/constants/Colors';
import GlassCard from '@/components/GlassCard';
import GlassInput from '@/components/GlassInput';
import CustomButton from '@/components/CustomButton';
import MaterialIcon from '@/components/MaterialIcon';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetRequest = () => {
    if (!identifier) {
      Alert.alert('Required', 'Please enter your registered Email or National ID.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Code Sent',
        'If an account is associated with this ID/Email, a password reset link has been dispatched.',
        [
          {
            text: 'OK',
            onPress: () => router.push('/(auth)/otp'),
          },
        ]
      );
    }, 1200);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardContainer}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcon name="arrow_back" size={24} color={BrandColors.primaryContainer} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Recovery</Text>
        </View>

        <View style={styles.canvas}>
          <GlassCard style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.titleText}>Forgot Password?</Text>
              <Text style={styles.subtitleText}>
                Enter your registered National ID or Email to receive password recovery details.
              </Text>
            </View>

            <View style={styles.form}>
              <GlassInput
                label="Email or National ID"
                iconName="badge"
                value={identifier}
                onChangeText={setIdentifier}
                placeholder="Enter details"
                autoCapitalize="none"
              />

              <CustomButton
                title="Send Recovery Code"
                onPress={handleResetRequest}
                loading={loading}
                style={styles.submitBtn}
              />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Remember your password?{' '}
                <Text style={styles.loginLink} onPress={() => router.push('/(auth)/login')}>
                  Login
                </Text>
              </Text>
            </View>
          </GlassCard>

          {/* Secure environment logo */}
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
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: BrandColors.textSecondary,
  },
  loginLink: {
    color: BrandColors.accentBlue,
    fontWeight: '700',
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
