import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Linking,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BrandColors } from '@/constants/Colors';
import TopBar from '@/components/TopBar';
import GlassCard from '@/components/GlassCard';
import MaterialIcon from '@/components/MaterialIcon';
import CustomButton from '@/components/CustomButton';
import GlassInput from '@/components/GlassInput';

export default function ContactScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      Alert.alert('Incomplete Form', 'Please fill in all the required fields.');
      return;
    }
    
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      Alert.alert(
        'Inquiry Submitted',
        'Thank you for contacting us. An immigration support representative will respond to your registered email within 24 hours.',
        [
          {
            text: 'OK',
            onPress: () => {
              setName('');
              setEmail('');
              setSubject('');
              setMessage('');
              router.back();
            },
          },
        ]
      );
    }, 1200);
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('Call Failed', `Could not initiate call to ${phone}`);
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.outerContainer}
    >
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcon name="arrow_back" size={24} color={BrandColors.primaryContainer} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help & Support</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Info Card */}
        <GlassCard style={styles.infoCard}>
          <View style={styles.infoTitleRow}>
            <MaterialIcon name="info" size={20} color={BrandColors.primary} style={{ marginRight: 8 }} />
            <Text style={styles.infoTitle}>Ghana Immigration Service HQ</Text>
          </View>
          <Text style={styles.infoText}>
            No. 7 Liberia Road, Ministries, Accra, Ghana.
          </Text>
          <Text style={styles.infoText}>
            Working Hours: Monday to Friday (08:00 AM - 05:00 PM GMT)
          </Text>
        </GlassCard>

        {/* Contact Form */}
        <Text style={styles.formSectionTitle}>Send Us a Message</Text>
        <GlassCard style={styles.formCard}>
          <GlassInput
            label="Your Full Name *"
            placeholder="e.g. Kwame Kwame"
            value={name}
            onChangeText={setName}
            onFocus={() => {
              setTimeout(() => {
                scrollViewRef.current?.scrollTo({ y: 350, animated: true });
              }, 150);
            }}
          />

          <GlassInput
            label="Your Email Address *"
            placeholder="e.g. kwame@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            onFocus={() => {
              setTimeout(() => {
                scrollViewRef.current?.scrollTo({ y: 420, animated: true });
              }, 150);
            }}
          />

          <GlassInput
            label="Subject"
            placeholder="e.g. Biometrics Appointment reschedule"
            value={subject}
            onChangeText={setSubject}
            onFocus={() => {
              setTimeout(() => {
                scrollViewRef.current?.scrollTo({ y: 490, animated: true });
              }, 150);
            }}
          />

          <Text style={styles.customLabel}>Message *</Text>
          <TextInput
            style={styles.messageInput}
            placeholder="Type your inquiry or message here..."
            placeholderTextColor={BrandColors.outline}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            onFocus={() => {
              setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
              }, 150);
            }}
          />

          <View style={{ marginTop: 12 }}>
            <CustomButton
              title={submitting ? "Sending inquiry..." : "Submit Inquiry"}
              onPress={handleSubmit}
              loading={submitting}
              variant="primary"
            />
          </View>
        </GlassCard>

        {/* Back Link */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
          <Text style={styles.backLinkText}>Back to Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingTop: 16,
    paddingBottom: 40,
  },
  quickContactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  quickCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: BrandColors.primaryContainer,
    marginBottom: 4,
  },
  quickValue: {
    fontSize: 11,
    color: BrandColors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  quickBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BrandColors.accentBlue,
  },
  quickBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: BrandColors.accentBlue,
  },
  infoCard: {
    marginBottom: 20,
    padding: 16,
  },
  infoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: BrandColors.primaryContainer,
  },
  infoText: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    lineHeight: 18,
    marginTop: 2,
  },
  formSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: BrandColors.primaryContainer,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  formCard: {
    padding: 16,
    marginBottom: 20,
  },
  customLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: BrandColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 6,
    marginTop: 10,
  },
  messageInput: {
    height: 100,
    borderWidth: 1,
    borderColor: BrandColors.outlineVariant,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: BrandColors.text,
    backgroundColor: '#ffffff',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    marginBottom: 16,
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
