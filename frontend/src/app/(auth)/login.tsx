import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BrandColors } from '@/constants/Colors';
import GlassCard from '@/components/GlassCard';
import GlassInput from '@/components/GlassInput';
import CustomButton from '@/components/CustomButton';
import MaterialIcon from '@/components/MaterialIcon';
import { useApp } from '@/context/AppContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useApp();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Error', 'Please fill in your Name, Email, and Password');
      return;
    }
    if (/[0-9]/.test(fullName)) {
      Alert.alert('Invalid Name', 'Full Name should not contain any numbers.');
      return;
    }
    if (!email.includes('@') || email.length < 5) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    setLoading(true);
    try {
      await login(email, fullName, password);
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Login Failed', e?.message || 'Invalid credentials');
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
        {/* Top bar header */}
        <View style={styles.header}>
          <View style={styles.brandContainer}>
            <View style={styles.logoIconWrapper}>
              <Image
                source={require('../../../assets/images/stitch-logo.png')}
                style={styles.logoIcon}
              />
            </View>
            <Text style={styles.brandName}>ImmigraSync</Text>
          </View>
          <View style={styles.supportNav}>
            <Text style={styles.supportLink}>Applicant Portal</Text>
          </View>
        </View>

        {/* Outer Canvas Container */}
        <View style={styles.canvas}>
          <GlassCard style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.welcomeText}>Welcome Back</Text>
              <Text style={styles.subtitleText}>Access your secure immigration dashboard</Text>
            </View>

            <View style={styles.form}>
              <GlassInput
                label="Full Name"
                iconName="person"
                value={fullName}
                onChangeText={(text) => setFullName(text.replace(/[0-9]/g, ''))}
                autoCapitalize="words"
                placeholder="e.g. Alex Thompson"
              />

              <GlassInput
                label="Email Address"
                iconName="mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="e.g. alex.t@domain.com"
              />

              <GlassInput
                label="Password"
                iconName="lock"
                isPassword={true}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
              />

              {/* Remember & Forgot */}
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => setRememberMe(!rememberMe)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                    {rememberMe && <MaterialIcon name="check" size={12} color="#ffffff" />}
                  </View>
                  <Text style={styles.checkboxLabel}>Remember Me</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/(auth)/forgot')}>
                  <Text style={styles.forgotLink}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              {/* Submit button */}
              <CustomButton
                title="Sign In"
                iconName="login"
                onPress={handleLogin}
                loading={loading}
              />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Don't have an account?{' '}
                <Text style={styles.registerLink} onPress={() => router.push('/(auth)/register')}>
                  Register
                </Text>
              </Text>
            </View>
          </GlassCard>

          {/* Secure Node Info Banner */}
          <View style={styles.secureNode}>
            <View style={styles.secureHeader}>
              <MaterialIcon name="verified_user" size={14} color={BrandColors.success} />
              <Text style={styles.secureNodeTitle}>Government Secure Node</Text>
            </View>
            <Text style={styles.secureNodeText}>
              Session protected with military-grade AES-256 encryption. Access is strictly audited.
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.pageFooter}>
          <Text style={styles.pageFooterText}>
            © 2026 ImmigraSync Secure Portal. All rights reserved.
          </Text>
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
    backgroundColor: '#ffffff',
    paddingBottom: 24,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(30, 58, 39, 0.05)',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0a2342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: 'rgba(10, 35, 66, 0.08)',
    overflow: 'hidden',
  },
  logoIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  brandName: {
    fontSize: 16,
    fontWeight: '700',
    color: BrandColors.primaryContainer,
    marginLeft: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  supportNav: {
    flexDirection: 'row',
  },
  supportLink: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    fontWeight: '600',
    backgroundColor: 'rgba(46, 125, 50, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  canvas: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  card: {
    width: '100%',
    maxWidth: 400,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '700',
    color: BrandColors.primaryContainer,
    marginBottom: 4,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  subtitleText: {
    fontSize: 13,
    color: BrandColors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  form: {
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: BrandColors.outlineVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxActive: {
    backgroundColor: BrandColors.primaryContainer,
    borderColor: BrandColors.primaryContainer,
  },
  checkboxLabel: {
    fontSize: 13,
    color: BrandColors.textSecondary,
  },
  forgotLink: {
    fontSize: 13,
    color: BrandColors.primary,
    fontWeight: '600',
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: BrandColors.textSecondary,
  },
  registerLink: {
    color: BrandColors.primary,
    fontWeight: '700',
  },
  secureNode: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 14,
    marginTop: 20,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      },
    }),
  },
  secureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  secureNodeTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: BrandColors.primaryContainer,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginLeft: 6,
  },
  secureNodeText: {
    fontSize: 10.5,
    color: BrandColors.textSecondary,
    lineHeight: 14,
  },
  pageFooter: {
    marginTop: 24,
    alignItems: 'center',
  },
  pageFooterText: {
    fontSize: 11,
    color: BrandColors.outline,
    textAlign: 'center',
  },
});
