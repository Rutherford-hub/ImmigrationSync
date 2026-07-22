import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BrandColors } from '@/constants/Colors';
import GlassCard from '@/components/GlassCard';
import CustomButton from '@/components/CustomButton';
import MaterialIcon from '@/components/MaterialIcon';
import { useApp } from '@/context/AppContext';

export default function OtpScreen() {
  const router = useRouter();
  const { login } = useApp();
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(59);
  const [loading, setLoading] = useState(false);
  const [resendActive, setResendActive] = useState(false);
  
  const otpInputsRef = useRef<Array<TextInput | null>>([]);

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      setResendActive(true);
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otpCode];
    newOtp[index] = text;
    setOtpCode(newOtp);

    // Focus next box
    if (text && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otpCode[index] && index > 0) {
      const newOtp = [...otpCode];
      newOtp[index - 1] = '';
      setOtpCode(newOtp);
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    setTimeLeft(59);
    setResendActive(false);
    setOtpCode(['', '', '', '', '', '']);
    otpInputsRef.current[0]?.focus();
    Alert.alert('Sent', 'A new 6-digit code has been dispatched.');
  };

  const handleVerify = async () => {
    const code = otpCode.join('');
    if (code.length !== 6) {
      Alert.alert('Incomplete', 'Please enter all 6 digits of the code.');
      return;
    }

    setLoading(true);
    // Simulate verification
    setTimeout(async () => {
      try {
        await login('ID-984A-TEMP', 'password');
        setLoading(false);
        Alert.alert('Verified', 'Identity verified successfully!', [
          {
            text: 'Proceed',
            onPress: () => router.replace('/(tabs)'),
          },
        ]);
      } catch (err) {
        setLoading(false);
        Alert.alert('Verification Failed', 'The code you entered is invalid.');
      }
    }, 1200);
  };

  const formatTime = (seconds: number) => {
    const secs = seconds < 10 ? `0${seconds}` : seconds;
    return `00:${secs}`;
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
          <Text style={styles.headerTitle}>Verification</Text>
        </View>

        <View style={styles.canvas}>
          <GlassCard style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.titleText}>Verify Your Identity</Text>
              <Text style={styles.subtitleText}>
                We've sent a 6-digit security code to your registered contact details.
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.otpGrid}>
                {otpCode.map((digit, idx) => (
                  <TextInput
                    key={idx}
                    ref={(ref) => {
                      otpInputsRef.current[idx] = ref;
                    }}
                    style={styles.otpBox}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={(text) => handleOtpChange(text, idx)}
                    onKeyPress={(e) => handleOtpKeyPress(e, idx)}
                  />
                ))}
              </View>

              {/* Countdown / Resend link */}
              <View style={styles.timerRow}>
                {resendActive ? (
                  <TouchableOpacity onPress={handleResend}>
                    <Text style={styles.resendLink}>Resend Code</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.timerText}>
                    Resend code in <Text style={styles.timerBold}>{formatTime(timeLeft)}</Text>
                  </Text>
                )}
              </View>

              <CustomButton
                title="Verify"
                onPress={handleVerify}
                loading={loading}
                style={styles.submitBtn}
              />
            </View>
          </GlassCard>

          <View style={styles.secureBadge}>
            <MaterialIcon name="lock" size={16} color={BrandColors.outline} />
            <Text style={styles.secureText}>Encrypted session environment.</Text>
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
    alignItems: 'center',
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
    textAlign: 'center',
    lineHeight: 20,
  },
  form: {
    marginBottom: 12,
  },
  otpGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpBox: {
    width: 48,
    height: 52,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BrandColors.outlineVariant,
    backgroundColor: '#ffffff',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: BrandColors.primaryContainer,
  },
  timerRow: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timerText: {
    fontSize: 14,
    color: BrandColors.textSecondary,
  },
  timerBold: {
    fontWeight: '700',
    color: BrandColors.primaryContainer,
  },
  resendLink: {
    fontSize: 14,
    color: BrandColors.accentBlue,
    fontWeight: '700',
    textDecorationLine: 'underline',
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
