import React, { useState, useRef } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { BrandColors } from '@/constants/Colors';
import GlassCard from '@/components/GlassCard';
import GlassInput from '@/components/GlassInput';
import CustomButton from '@/components/CustomButton';
import MaterialIcon from '@/components/MaterialIcon';
import { useApp } from '@/context/AppContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { registerUser } = useApp();
  const scrollViewRef = useRef<ScrollView>(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ghanaCard, setGhanaCard] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);

  // Automatically format Ghana Card number as user types: GHA-XXXXXXXXX-X
  const handleGhanaCardChange = (text: string) => {
    // Strip all non-alphanumeric, convert to uppercase
    const cleaned = text.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    
    let formatted = '';
    
    // We expect the card to start with GHA. If user types numbers first, prepend GHA
    let numbers = cleaned;
    if (cleaned.startsWith('GHA')) {
      numbers = cleaned.slice(3);
    }
    
    // Limit to 10 digits/characters after GHA
    numbers = numbers.slice(0, 10);
    
    formatted = 'GHA';
    if (numbers.length > 0) {
      if (numbers.length <= 9) {
        formatted += '-' + numbers;
      } else {
        formatted += '-' + numbers.slice(0, 9) + '-' + numbers.slice(9);
      }
    }
    
    setGhanaCard(formatted);
  };

  const handleRegister = async () => {
    if (!fullName || !email || !password || !ghanaCard || !age) {
      Alert.alert('Required Fields', 'Please fill in all registration fields.');
      return;
    }

    if (/[0-9]/.test(fullName)) {
      Alert.alert('Invalid Name', 'Full Name should not contain any numbers.');
      return;
    }

    // Email validation
    if (!email.includes('@') || email.length < 5) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    // Password validation (e.g. min 6 characters)
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }

    // Ghana Card validation: regex checks for GHA-XXXXXXXXX-X (9 digits, 1 check digit)
    const ghanaCardRegex = /^GHA-\d{9}-\d$/;
    if (!ghanaCardRegex.test(ghanaCard)) {
      Alert.alert(
        'Invalid Ghana Card',
        'Ghana Card number must be in the format GHA-123456789-0 (9 digits followed by a hyphen and a check digit).'
      );
      return;
    }

    // Age validation
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      Alert.alert('Invalid Age', 'Please enter a valid age between 1 and 120.');
      return;
    }

    setLoading(true);
    try {
      await registerUser(fullName, email, password, ghanaCard, ageNum);
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Registration Failed', e?.message || 'An error occurred during account creation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={s.flex}
    >
      {/* Stick header */}
      <View style={s.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={s.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={s.backArrow}>←</Text>
        </TouchableOpacity>

        <View style={s.wordmark}>
          <View style={s.wordmarkDot} />
          <Text style={s.wordmarkText}>ImmigrationSync</Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      {/* Scrollable content */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={s.pageHead}>
          <Text style={s.pageTitle}>Create Account</Text>
          <Text style={s.pageSub}>
            Register with your official Ghana Card and security credentials.
          </Text>
        </View>

        {/* Main Card */}
        <GlassCard style={s.card}>
          <GlassInput
            label="Full Name"
            iconName="person"
            value={fullName}
            onChangeText={(text) => setFullName(text.replace(/[0-9]/g, ''))}
            placeholder="As it appears on your ID"
            autoCapitalize="words"
            onFocus={() => {
              setTimeout(() => {
                scrollViewRef.current?.scrollTo({ y: 50, animated: true });
              }, 150);
            }}
          />

          <GlassInput
            label="Email Address"
            iconName="mail"
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            onFocus={() => {
              setTimeout(() => {
                scrollViewRef.current?.scrollTo({ y: 120, animated: true });
              }, 150);
            }}
          />

          <GlassInput
            label="Password"
            iconName="lock"
            isPassword={true}
            value={password}
            onChangeText={setPassword}
            placeholder="Minimum 6 characters"
            onFocus={() => {
              setTimeout(() => {
                scrollViewRef.current?.scrollTo({ y: 190, animated: true });
              }, 150);
            }}
          />

          <GlassInput
            label="Ghana Card Number"
            iconName="badge"
            value={ghanaCard}
            onChangeText={handleGhanaCardChange}
            placeholder="GHA-123456789-0"
            autoCapitalize="characters"
            onFocus={() => {
              setTimeout(() => {
                scrollViewRef.current?.scrollTo({ y: 260, animated: true });
              }, 150);
            }}
          />

          <GlassInput
            label="User Age"
            iconName="calendar_today"
            value={age}
            onChangeText={setAge}
            placeholder="Enter age (e.g. 25)"
            keyboardType="number-pad"
            onFocus={() => {
              setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
              }, 150);
            }}
          />

          <CustomButton
            title="Create Account"
            iconName="person_add"
            onPress={handleRegister}
            loading={loading}
            style={s.registerBtn}
          />

          {/* Login link */}
          <View style={s.loginRow}>
            <Text style={s.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/login')} activeOpacity={0.7}>
              <Text style={s.loginLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* Security footer */}
        <View style={s.secFooter}>
          <MaterialIcon name="verified_user" size={14} color={BrandColors.success} />
          <Text style={s.secText}>AES-256 encrypted · Government Secure Node</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  flex: { 
    flex: 1, 
    backgroundColor: '#ffffff' 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 48 : 28,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(30, 58, 39, 0.05)',
    backgroundColor: '#ffffff',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(141, 155, 145, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    color: BrandColors.text,
    fontSize: 16,
  },
  wordmark: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  wordmarkDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: BrandColors.primary,
  },
  wordmarkText: {
    color: BrandColors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  pageHead: {
    marginBottom: 20,
  },
  pageTitle: {
    color: BrandColors.text,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  pageSub: {
    color: BrandColors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(141, 155, 145, 0.2)',
    padding: 16,
  },
  registerBtn: {
    marginTop: 10,
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginText: {
    color: BrandColors.textSecondary,
    fontSize: 13,
  },
  loginLink: {
    color: BrandColors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  secFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 6,
  },
  secText: {
    fontSize: 11,
    color: BrandColors.textSecondary,
  },
});
