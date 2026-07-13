import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BrandColors } from '@/constants/Colors';
import TopBar from '@/components/TopBar';
import GlassCard from '@/components/GlassCard';
import MaterialIcon from '@/components/MaterialIcon';
import GlassInput from '@/components/GlassInput';
import CustomButton from '@/components/CustomButton';
import { useApp } from '@/context/AppContext';

export default function DashboardScreen() {
  const router = useRouter();
  const formScrollViewRef = useRef<ScrollView>(null);
  const { user, activeCase, setActiveCase, appointments, passportPicUri } = useApp();

  // Navigation overlays state
  const [activeForm, setActiveForm] = useState<'none' | 'passport' | 'visa' | 'upload'>('none');

  // Passport Form States
  const [passportName, setPassportName] = useState(user?.name || '');
  const [passportDob, setPassportDob] = useState('');
  const [passportPob, setPassportPob] = useState('');
  const [passportGender, setPassportGender] = useState<'Male' | 'Female' | ''>('');
  const [passportGhanaCard, setPassportGhanaCard] = useState(user?.ghanaCard || '');
  const [passportType, setPassportType] = useState<'Standard' | 'Express'>('Standard');
  const [passportSubmitting, setPassportSubmitting] = useState(false);

  // Visa Form States
  const [visaName, setVisaName] = useState(user?.name || '');
  const [visaNationality, setVisaNationality] = useState('');
  const [visaPassportNo, setVisaPassportNo] = useState('');
  const [visaType, setVisaType] = useState<'Tourist' | 'Business' | 'Student' | 'Work'>('Tourist');
  const [visaDuration, setVisaDuration] = useState('90 Days');
  const [visaPurpose, setVisaPurpose] = useState('');
  const [visaSubmitting, setVisaSubmitting] = useState(false);

  // Document Upload States
  const [govtIdFront, setGovtIdFront] = useState<string | null>(null);
  const [govtIdBack, setGovtIdBack] = useState<string | null>(null);
  const [passportPhoto, setPassportPhoto] = useState<string | null>(null);
  const [uploadingField, setUploadingField] = useState<'front' | 'back' | 'passport' | null>(null);

  // Determine user name
  const displayName = user?.name || 'Applicant';
  
  const hasAppt = appointments.length > 0;
  const progressPercent = activeCase ? activeCase.progressPercent : 0;

  // Handle Ghana Card formatting inside Passport Form
  const handlePassportGhanaCardChange = (text: string) => {
    const cleaned = text.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    let numbers = cleaned;
    if (cleaned.startsWith('GHA')) {
      numbers = cleaned.slice(3);
    }
    numbers = numbers.slice(0, 10);
    let formatted = 'GHA';
    if (numbers.length > 0) {
      if (numbers.length <= 9) {
        formatted += '-' + numbers;
      } else {
        formatted += '-' + numbers.slice(0, 9) + '-' + numbers.slice(9);
      }
    }
    setPassportGhanaCard(formatted);
  };

  // Submit Passport Application
  const handlePassportSubmit = () => {
    if (!passportName || !passportDob || !passportPob || !passportGender || !passportGhanaCard) {
      Alert.alert('Required Fields', 'Please fill in all fields of the passport form.');
      return;
    }
    // Simple DOB check (YYYY-MM-DD)
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dobRegex.test(passportDob)) {
      Alert.alert('Invalid Date', 'Date of birth must be in YYYY-MM-DD format.');
      return;
    }
    // Validate Ghana card format
    const cardRegex = /^GHA-\d{9}-\d$/;
    if (!cardRegex.test(passportGhanaCard)) {
      Alert.alert('Invalid Ghana Card', 'Ghana Card number must be in the format GHA-123456789-0.');
      return;
    }

    setPassportSubmitting(true);
    setTimeout(() => {
      setPassportSubmitting(false);
      const appNo = `PAS-GHA-${Math.floor(100000 + Math.random() * 900000)}`;
      setActiveCase({
        appNumber: appNo,
        applicantName: displayName,
        visaType: `${passportType} Passport`,
        status: 'Active',
        stages: [
          {
            title: 'Submitted',
            description: 'Passport application successfully received.',
            status: 'completed',
            date: 'Today',
          },
          {
            title: 'Document Verification',
            description: 'Verifying scanned credentials and Ghana Card.',
            status: 'in_progress',
          },
          {
            title: 'Approval Decision',
            description: 'Final security clearing and review.',
            status: 'pending',
          },
          {
            title: 'Issuance',
            description: 'Printing physical biometric document.',
            status: 'pending',
          },
        ],
        progressPercent: 25,
      });

      Alert.alert(
        'Submission Successful',
        `Your ${passportType} Passport Application has been received! Tracking ID: ${appNo}`
      );
      // Reset & close
      setActiveForm('none');
      setPassportDob('');
      setPassportPob('');
      setPassportGender('');
    }, 1500);
  };

  // Submit Visa Application
  const handleVisaSubmit = () => {
    if (!visaName || !visaNationality || !visaPassportNo || !visaPurpose) {
      Alert.alert('Required Fields', 'Please fill in all fields of the visa form.');
      return;
    }
    if (visaPassportNo.length < 6 || visaPassportNo.length > 12) {
      Alert.alert('Invalid Passport Number', 'Passport number must be 6 to 12 alphanumeric characters.');
      return;
    }

    setVisaSubmitting(true);
    setTimeout(() => {
      setVisaSubmitting(false);
      const appNo = `VISA-GHA-${Math.floor(100000 + Math.random() * 900000)}`;
      setActiveCase({
        appNumber: appNo,
        applicantName: displayName,
        visaType: `${visaType} Visa (${visaDuration})`,
        status: 'Active',
        stages: [
          {
            title: 'Submitted',
            description: 'Visa application received online.',
            status: 'completed',
            date: 'Today',
          },
          {
            title: 'Vetting Process',
            description: 'Evaluating entry permission and support docs.',
            status: 'in_progress',
          },
          {
            title: 'Approval & Stamping',
            description: 'Securing electronic visa stamp decision.',
            status: 'pending',
          },
        ],
        progressPercent: 33,
      });

      Alert.alert(
        'Submission Successful',
        `Your ${visaType} Visa Application (${visaDuration}) has been received! Tracking ID: ${appNo}`
      );
      // Reset & close
      setActiveForm('none');
      setVisaNationality('');
      setVisaPassportNo('');
      setVisaPurpose('');
    }, 1500);
  };

  // Simulate File Uploading
  const simulateUpload = (field: 'front' | 'back' | 'passport') => {
    setUploadingField(field);
    setTimeout(() => {
      setUploadingField(null);
      const secureFileToken = 'scanned_file_secured';
      if (field === 'front') setGovtIdFront(secureFileToken);
      if (field === 'back') setGovtIdBack(secureFileToken);
      if (field === 'passport') setPassportPhoto(secureFileToken);
      Alert.alert('Upload Success', 'Security document scanned, encrypted, and saved to GIS Secure Registry.');
    }, 1200);
  };

  const handleUploadsSubmit = () => {
    if (!govtIdFront || !govtIdBack || !passportPhoto) {
      Alert.alert('Missing Documents', 'Please upload ID Front, ID Back, and Passport Photo to complete.');
      return;
    }
    Alert.alert('Verification Success', 'All application photos and card scans have been uploaded and linked to your profile.');
    setActiveForm('none');
  };

  // Render individual upload cards for documents
  const renderUploadCard = (
    title: string,
    subtitle: string,
    uri: string | null,
    field: 'front' | 'back' | 'passport'
  ) => {
    const isUploading = uploadingField === field;
    return (
      <View style={styles.uploadCard}>
        <View style={styles.uploadCardHeader}>
          <View>
            <Text style={styles.uploadCardTitle}>{title}</Text>
            <Text style={styles.uploadCardSubtitle}>{subtitle}</Text>
          </View>
          {uri && (
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => {
                if (field === 'front') setGovtIdFront(null);
                if (field === 'back') setGovtIdBack(null);
                if (field === 'passport') setPassportPhoto(null);
              }}
            >
              <MaterialIcon name="delete" size={18} color={BrandColors.error} />
            </TouchableOpacity>
          )}
        </View>

        {uri ? (
          <View style={styles.previewContainer}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: 'rgba(46, 125, 50, 0.02)' }}>
              <MaterialIcon name="verified_user" size={32} color={BrandColors.success} />
              <Text style={{ fontSize: 12, fontWeight: '700', color: BrandColors.primaryContainer }}>ENCRYPTED_SCAN_COMMITTED.BIN</Text>
              <Text style={{ fontSize: 10, color: BrandColors.success, fontWeight: '600' }}>SHA-256 Vault ID: GIS-{Math.floor(1000 + Math.random() * 9000)}</Text>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.uploadBox, isUploading && styles.uploadBoxActive]}
            onPress={() => simulateUpload(field)}
            disabled={isUploading}
            activeOpacity={0.7}
          >
            {isUploading ? (
              <ActivityIndicator size="small" color={BrandColors.primary} />
            ) : (
              <>
                <MaterialIcon name="cloud_upload" size={24} color={BrandColors.primary} />
                <Text style={styles.uploadBoxText}>Upload Document Scan</Text>
                <Text style={styles.uploadBoxSubtext}>JPG, PNG up to 5MB</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // If a form overlay is active, render the clean form screen
  if (activeForm !== 'none') {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.formContainer}>
          {/* Form Header */}
          <View style={styles.formHeader}>
            <TouchableOpacity style={styles.backBtn} onPress={() => setActiveForm('none')}>
              <MaterialIcon name="arrow_back" size={20} color={BrandColors.primary} />
            </TouchableOpacity>
            <Text style={styles.formHeaderTitle}>
              {activeForm === 'passport' && 'Passport Application'}
              {activeForm === 'visa' && 'Visa Application'}
              {activeForm === 'upload' && 'Upload Photos'}
            </Text>
            <View style={{ width: 36 }} />
          </View>

          <ScrollView ref={formScrollViewRef} contentContainerStyle={styles.formScrollContainer} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          
          {/* PASSPORT APPLICATION FORM */}
          {activeForm === 'passport' && (
            <GlassCard style={styles.formCard}>
              <Text style={styles.formSectionTitle}>Personal Passport Details</Text>
              <GlassInput
                label="Full Name"
                iconName="person"
                value={passportName}
                onChangeText={setPassportName}
                placeholder="Name as printed on birth certificate"
                onFocus={() => {
                  setTimeout(() => {
                    formScrollViewRef.current?.scrollTo({ y: 0, animated: true });
                  }, 150);
                }}
              />
              <GlassInput
                label="Date of Birth"
                iconName="calendar_today"
                value={passportDob}
                onChangeText={setPassportDob}
                placeholder="YYYY-MM-DD"
                onFocus={() => {
                  setTimeout(() => {
                    formScrollViewRef.current?.scrollTo({ y: 50, animated: true });
                  }, 150);
                }}
              />
              <GlassInput
                label="Place of Birth"
                iconName="location_on"
                value={passportPob}
                onChangeText={setPassportPob}
                placeholder="e.g. Accra, Ghana"
                onFocus={() => {
                  setTimeout(() => {
                    formScrollViewRef.current?.scrollTo({ y: 120, animated: true });
                  }, 150);
                }}
              />

              <Text style={styles.customLabel}>Gender Selection</Text>
              <View style={styles.genderRow}>
                {['Male', 'Female'].map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[
                      styles.genderBtn,
                      passportGender === g && styles.genderBtnActive
                    ]}
                    onPress={() => setPassportGender(g as any)}
                  >
                    <Text style={[styles.genderBtnText, passportGender === g && styles.genderBtnTextActive]}>
                      {g}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <GlassInput
                label="Ghana Card Number"
                iconName="badge"
                value={passportGhanaCard}
                onChangeText={handlePassportGhanaCardChange}
                placeholder="GHA-123456789-0"
                autoCapitalize="characters"
                onFocus={() => {
                  setTimeout(() => {
                    formScrollViewRef.current?.scrollTo({ y: 250, animated: true });
                  }, 150);
                }}
              />

              <Text style={styles.customLabel}>Processing Priority</Text>
              <View style={styles.priorityRow}>
                {[
                  { id: 'Standard', desc: 'Standard (15 Days)' },
                  { id: 'Express', desc: 'Express (3 Days)' }
                ].map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.priorityBtn,
                      passportType === type.id && styles.priorityBtnActive
                    ]}
                    onPress={() => setPassportType(type.id as any)}
                  >
                    <Text style={[styles.priorityBtnText, passportType === type.id && styles.priorityBtnTextActive]}>
                      {type.desc}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <CustomButton
                title="Submit Passport Application"
                iconName="send"
                onPress={handlePassportSubmit}
                loading={passportSubmitting}
                style={styles.submitBtn}
              />
            </GlassCard>
          )}

          {/* VISA APPLICATION FORM */}
          {activeForm === 'visa' && (
            <GlassCard style={styles.formCard}>
              <Text style={styles.formSectionTitle}>Visa Application Details</Text>
              <GlassInput
                label="Full Name"
                iconName="person"
                value={visaName}
                onChangeText={setVisaName}
                placeholder="Full applicant name"
                onFocus={() => {
                  setTimeout(() => {
                    formScrollViewRef.current?.scrollTo({ y: 0, animated: true });
                  }, 150);
                }}
              />
              <GlassInput
                label="Nationality"
                iconName="flag"
                value={visaNationality}
                onChangeText={setVisaNationality}
                placeholder="e.g. Ghanaian"
                onFocus={() => {
                  setTimeout(() => {
                    formScrollViewRef.current?.scrollTo({ y: 50, animated: true });
                  }, 150);
                }}
              />
              <GlassInput
                label="Passport Number"
                iconName="badge"
                value={visaPassportNo}
                onChangeText={setVisaPassportNo}
                placeholder="e.g. GHA1029384"
                autoCapitalize="characters"
                onFocus={() => {
                  setTimeout(() => {
                    formScrollViewRef.current?.scrollTo({ y: 120, animated: true });
                  }, 150);
                }}
              />

              <Text style={styles.customLabel}>Visa Category Type</Text>
              <View style={styles.genderRow}>
                {['Tourist', 'Business', 'Student', 'Work'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.genderBtn,
                      styles.categoryBtn,
                      visaType === type && styles.genderBtnActive
                    ]}
                    onPress={() => setVisaType(type as any)}
                  >
                    <Text style={[styles.genderBtnText, visaType === type && styles.genderBtnTextActive]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.customLabel}>Requested Stay Duration</Text>
              <View style={styles.priorityRow}>
                {['30 Days', '90 Days', '1 Year'].map((dur) => (
                  <TouchableOpacity
                    key={dur}
                    style={[
                      styles.priorityBtn,
                      visaDuration === dur && styles.priorityBtnActive
                    ]}
                    onPress={() => setVisaDuration(dur)}
                  >
                    <Text style={[styles.priorityBtnText, visaDuration === dur && styles.priorityBtnTextActive]}>
                      {dur}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <GlassInput
                label="Purpose of Visit"
                iconName="notes"
                value={visaPurpose}
                onChangeText={setVisaPurpose}
                placeholder="Briefly explain visit motivation"
                multiline={true}
                onFocus={() => {
                  setTimeout(() => {
                    formScrollViewRef.current?.scrollTo({ y: 280, animated: true });
                  }, 150);
                }}
              />

              <CustomButton
                title="Submit Visa Application"
                iconName="send"
                onPress={handleVisaSubmit}
                loading={visaSubmitting}
                style={styles.submitBtn}
              />
            </GlassCard>
          )}

          {/* UPLOAD PICTURES FLOW */}
          {activeForm === 'upload' && (
            <View style={styles.uploadViewContainer}>
              <Text style={styles.uploadSectionHeader}>Upload Government ID & Passport Photos</Text>
              <Text style={styles.uploadSectionSub}>Please upload clean, high-resolution scans for applicant identity verification.</Text>
              
              {renderUploadCard('Government ID Front', 'Valid Ghana Card front face', govtIdFront, 'front')}
              {renderUploadCard('Government ID Back', 'Valid Ghana Card back face', govtIdBack, 'back')}
              {renderUploadCard('Passport Biometric Photo', 'Recent passport portrait picture', passportPhoto, 'passport')}

              <CustomButton
                title="Save & Submit Documents"
                iconName="cloud_done"
                onPress={handleUploadsSubmit}
                style={styles.uploadSubmitBtn}
              />
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
    );
  }

  // Dashboard Default Main View
  return (
    <View style={styles.outerContainer}>
      <TopBar />
      
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Welcome Greeting */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome back, {displayName.split(' ')[0]}!</Text>
          <Text style={styles.welcomeSubtitle}>
            Your immigration journey is currently {progressPercent}% complete. Here is your latest overview.
          </Text>
        </View>

        {/* Statistics Grid */}
        <View style={styles.statsGrid}>
          {/* Submitted */}
          <View style={[styles.statsCard, { backgroundColor: BrandColors.submitted }]}>
            <View style={styles.statsHeader}>
              <MaterialIcon name="send" size={20} color="#ffffff" />
              <Text style={styles.statsNumber}>{activeCase ? '01' : '00'}</Text>
            </View>
            <Text style={styles.statsLabel}>Submitted</Text>
          </View>

          {/* Under Review */}
          <View style={[styles.statsCard, { backgroundColor: BrandColors.underReview }]}>
            <View style={styles.statsHeader}>
              <MaterialIcon name="search" size={20} color="#ffffff" />
              <Text style={styles.statsNumber}>{activeCase ? '01' : '00'}</Text>
            </View>
            <Text style={styles.statsLabel}>Under Review</Text>
          </View>

          {/* Approved */}
          <View style={[styles.statsCard, { backgroundColor: BrandColors.approved }]}>
            <View style={styles.statsHeader}>
              <MaterialIcon name="verified" size={20} color="#ffffff" />
              <Text style={styles.statsNumber}>00</Text>
            </View>
            <Text style={styles.statsLabel}>Approved</Text>
          </View>

          {/* Rejected */}
          <View style={[styles.statsCard, { backgroundColor: BrandColors.rejected }]}>
            <View style={styles.statsHeader}>
              <MaterialIcon name="cancel" size={20} color="#ffffff" />
              <Text style={styles.statsNumber}>00</Text>
            </View>
            <Text style={styles.statsLabel}>Rejected</Text>
          </View>
        </View>

        {/* Case Summary Component */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <MaterialIcon name="analytics" size={20} color={BrandColors.primaryContainer} />
            <Text style={styles.sectionTitle}>Case Summary</Text>
          </View>

          {activeCase ? (
            <GlassCard style={styles.caseSummaryCard}>
              <View style={styles.caseSummaryHeader}>
                <View style={styles.caseSummaryIconBadge}>
                  <MaterialIcon 
                    name={activeCase.visaType.toLowerCase().includes('passport') ? 'badge' : 'travel_explore'} 
                    size={24} 
                    color={BrandColors.primary} 
                  />
                </View>
                <View style={styles.caseSummaryTitleContainer}>
                  <Text style={styles.caseSummaryType}>{activeCase.visaType}</Text>
                  <Text style={styles.caseSummaryId}>ID: {activeCase.appNumber}</Text>
                </View>
                <View style={[
                  styles.statusBadge, 
                  { backgroundColor: activeCase.status === 'Approved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0, 86, 210, 0.1)' }
                ]}>
                  <Text style={[
                    styles.statusBadgeText, 
                    { color: activeCase.status === 'Approved' ? BrandColors.success : BrandColors.accentBlue }
                  ]}>{activeCase.status}</Text>
                </View>
              </View>

              {/* Progress Bar Section */}
              <View style={styles.progressSection}>
                <View style={styles.progressTextRow}>
                  <Text style={styles.progressLabel}>Overall Progress</Text>
                  <Text style={styles.progressPercentText}>{activeCase.progressPercent}%</Text>
                </View>
                {/* Progress Bar Track */}
                <View style={styles.progressBarTrack}>
                  <View style={[styles.progressBarFill, { width: `${activeCase.progressPercent}%` }]} />
                </View>
              </View>

              {/* Active Step Details */}
              {(() => {
                const stages = activeCase.stages || [];
                const currentStage = stages.find(s => s.status === 'in_progress') || 
                                     stages.find(s => s.status === 'completed') || 
                                     stages[0];
                return currentStage ? (
                  <View style={styles.currentStepContainer}>
                    <View style={styles.stepInfoRow}>
                      <MaterialIcon name="hourglass_empty" size={16} color={BrandColors.accentBlue} />
                      <Text style={styles.currentStepTitle}>Current Step: {currentStage.title}</Text>
                    </View>
                    <Text style={styles.currentStepDesc}>{currentStage.description}</Text>
                  </View>
                ) : null;
              })()}

              {/* Action Button */}
              <TouchableOpacity 
                style={styles.caseSummaryBtn}
                onPress={() => router.push('/(tabs)/cases')}
                activeOpacity={0.8}
              >
                <Text style={styles.caseSummaryBtnText}>View Full Tracking Details</Text>
                <MaterialIcon name="arrow_forward" size={16} color="#ffffff" />
              </TouchableOpacity>
            </GlassCard>
          ) : (
            <GlassCard style={styles.caseSummaryCard}>
              <View style={styles.noCaseContainer}>
                <View style={styles.noCaseIconBg}>
                  <MaterialIcon name="folder_off" size={28} color={BrandColors.textSecondary} />
                </View>
                <Text style={styles.noCaseTitle}>No Active Applications</Text>
                <Text style={styles.noCaseSub}>
                  Apply for a biometric passport or entry visa to start tracking your journey with a real-time progress bar.
                </Text>
                
                {/* Embedded Call to Action Buttons */}
                <View style={styles.noCaseActionRow}>
                  <TouchableOpacity 
                    style={styles.noCaseSmallBtn}
                    onPress={() => setActiveForm('passport')}
                    activeOpacity={0.8}
                  >
                    <MaterialIcon name="badge" size={16} color={BrandColors.primary} />
                    <Text style={styles.noCaseSmallBtnText}>Apply Passport</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.noCaseSmallBtn, { borderColor: BrandColors.accentBlue, backgroundColor: 'rgba(0, 86, 210, 0.05)' }]}
                    onPress={() => setActiveForm('visa')}
                    activeOpacity={0.8}
                  >
                    <MaterialIcon name="travel_explore" size={16} color={BrandColors.accentBlue} />
                    <Text style={[styles.noCaseSmallBtnText, { color: BrandColors.accentBlue }]}>Apply Visa</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </GlassCard>
          )}
        </View>

        {/* Quick Actions Bento Grid */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>

          <View style={styles.bentoGrid}>
            {/* Primary Large Bento Action - Opens Passport Form */}
            <TouchableOpacity 
              style={styles.bentoBigButton}
              onPress={() => setActiveForm('passport')}
              activeOpacity={0.9}
            >
              <View style={styles.bentoIconBadge}>
                <MaterialIcon name="badge" size={28} color={BrandColors.primary} />
              </View>
              <View style={styles.bentoBigTextContainer}>
                <Text style={styles.bentoBigTitle}>Apply for Passport</Text>
                <Text style={styles.bentoBigSubtitle}>Renew or request a new travel document.</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.bentoGridRight}>
              <View style={styles.bentoRow}>
                {/* Visa Button - Opens Visa Form */}
                <TouchableOpacity 
                  style={styles.bentoSmallButton}
                  onPress={() => setActiveForm('visa')}
                  activeOpacity={0.8}
                >
                  <MaterialIcon name="travel_explore" size={22} color={BrandColors.primary} />
                  <Text style={styles.bentoSmallTitle}>Apply for Visa</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.bentoSmallButton}
                  onPress={() => router.push('/(tabs)/cases')}
                  activeOpacity={0.8}
                >
                  <MaterialIcon name="location_searching" size={22} color={BrandColors.primary} />
                  <Text style={styles.bentoSmallTitle}>Track Case</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.bentoRow}>
                {/* Upload Pics Button - Opens Upload Form */}
                <TouchableOpacity 
                  style={styles.bentoSmallButton}
                  onPress={() => setActiveForm('upload')}
                  activeOpacity={0.8}
                >
                  <MaterialIcon name="cloud_upload" size={22} color={BrandColors.primary} />
                  <Text style={styles.bentoSmallTitle}>Upload Pics</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.bentoSmallButton}
                  onPress={() => router.push('/(tabs)/appointments')}
                  activeOpacity={0.8}
                >
                  <MaterialIcon name="calendar_month" size={22} color={BrandColors.primary} />
                  <Text style={styles.bentoSmallTitle}>Schedule Appt</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Notifications Table */}
        <View style={[styles.sectionContainer, styles.activitySection]}>
          <View style={styles.recentHeader}>
            <Text style={styles.sectionTitle}>Recent Notifications</Text>
            <TouchableOpacity onPress={() => router.push('/notifications')}>
              <Text style={styles.viewAllLink}>View all</Text>
            </TouchableOpacity>
          </View>

          <GlassCard style={styles.notificationsCard}>
            {!(activeCase || hasAppt || passportPicUri) ? (
              <View style={styles.emptyNotificationsContainer}>
                <MaterialIcon name="notifications_off" size={28} color={BrandColors.textSecondary} style={{ marginBottom: 6, opacity: 0.5 }} />
                <Text style={styles.emptyNotificationsTitle}>No recent notifications</Text>
                <Text style={styles.emptyNotificationsSub}>Your inbox is clear. Application updates will appear here.</Text>
              </View>
            ) : (
              <>
                {/* Active Case Notification if Submitted */}
                {activeCase && (
                  <View style={[styles.notificationItem, { borderBottomWidth: (hasAppt || passportPicUri) ? 1 : 0 }]}>
                    <View style={[styles.notificationIconBg, { backgroundColor: 'rgba(0, 86, 210, 0.08)' }]}>
                      <MaterialIcon name="assignment" size={20} color={BrandColors.primary} />
                    </View>
                    <View style={styles.notificationContent}>
                      <Text style={styles.notificationTitle}>Application Submitted</Text>
                      <Text style={styles.notificationDesc}>
                        Your {activeCase.visaType} application was received with Tracking ID {activeCase.appNumber}.
                      </Text>
                    </View>
                  </View>
                )}

                {/* Active Appointment Notification if Booked */}
                {hasAppt && (
                  <View style={[styles.notificationItem, { borderBottomWidth: passportPicUri ? 1 : 0 }]}>
                    <View style={[styles.notificationIconBg, { backgroundColor: 'rgba(46, 125, 50, 0.08)' }]}>
                      <MaterialIcon name="calendar_today" size={20} color={BrandColors.primary} />
                    </View>
                    <View style={styles.notificationContent}>
                      <Text style={styles.notificationTitle}>Appointment Booked</Text>
                      <Text style={styles.notificationDesc}>
                        Biometrics scheduled for {appointments[0].date} at {appointments[0].time}.
                      </Text>
                    </View>
                  </View>
                )}

                {/* Passport photo upload notification if uploaded */}
                {passportPicUri && (
                  <View style={[styles.notificationItem, { borderBottomWidth: 0 }]}>
                    <View style={[styles.notificationIconBg, { backgroundColor: 'rgba(28, 159, 62, 0.08)' }]}>
                      <MaterialIcon name="verified_user" size={20} color={BrandColors.success} />
                    </View>
                    <View style={styles.notificationContent}>
                      <Text style={styles.notificationTitle}>Passport Photo Uploaded</Text>
                      <Text style={styles.notificationDesc}>
                        Softcopy of passport photo has been linked to your ID profile.
                      </Text>
                    </View>
                  </View>
                )}
              </>
            )}
          </GlassCard>
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
  welcomeSection: {
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: BrandColors.primaryContainer,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: BrandColors.textSecondary,
    marginTop: 4,
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 8,
  },
  statsCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#0a2342',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statsNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  statsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    opacity: 0.8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  greenPulseDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#83fc8e',
    shadowColor: '#83fc8e',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: BrandColors.primaryContainer,
    marginLeft: 6,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  bentoGrid: {
    flexDirection: 'column',
    gap: 12,
  },
  bentoBigButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: BrandColors.outlineVariant,
    borderRadius: 18,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#0a2342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  bentoIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(46, 125, 50, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  bentoBigTextContainer: {
    flex: 1,
  },
  bentoBigTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: BrandColors.primaryContainer,
  },
  bentoBigSubtitle: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    marginTop: 2,
  },
  bentoGridRight: {
    flexDirection: 'column',
    gap: 12,
  },
  bentoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  bentoSmallButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: BrandColors.outlineVariant,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0a2342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    gap: 8,
  },
  bentoSmallTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: BrandColors.primaryContainer,
    textAlign: 'center',
  },
  activitySection: {
    marginTop: 8,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllLink: {
    fontSize: 13,
    fontWeight: '600',
    color: BrandColors.primary,
  },
  notificationsCard: {
    padding: 0,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(10, 35, 66, 0.05)',
    alignItems: 'center',
  },
  notificationIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: BrandColors.primaryContainer,
  },
  notificationDesc: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },

  // Form overlay Styles
  formContainer: {
    flex: 1,
    backgroundColor: '#f6faff',
  },
  formHeader: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(30, 58, 39, 0.08)',
    backgroundColor: '#ffffff',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: BrandColors.primary,
  },
  formScrollContainer: {
    padding: 16,
  },
  formCard: {
    padding: 18,
    borderRadius: 16,
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: BrandColors.primary,
    marginBottom: 16,
  },
  customLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: BrandColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
    marginTop: 4,
    paddingLeft: 2,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  genderBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(141, 155, 145, 0.3)',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBtn: {
    flex: 0.25,
  },
  genderBtnActive: {
    borderColor: BrandColors.primary,
    backgroundColor: 'rgba(46, 125, 50, 0.06)',
  },
  genderBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: BrandColors.textSecondary,
  },
  genderBtnTextActive: {
    color: BrandColors.primary,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  priorityBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(141, 155, 145, 0.3)',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  priorityBtnActive: {
    borderColor: BrandColors.primary,
    backgroundColor: 'rgba(46, 125, 50, 0.06)',
  },
  priorityBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: BrandColors.textSecondary,
  },
  priorityBtnTextActive: {
    color: BrandColors.primary,
  },
  submitBtn: {
    marginTop: 10,
  },

  // Document upload screen styles
  uploadViewContainer: {
    padding: 4,
  },
  uploadSectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: BrandColors.primary,
    marginBottom: 6,
  },
  uploadSectionSub: {
    fontSize: 13,
    color: BrandColors.textSecondary,
    marginBottom: 20,
    lineHeight: 18,
  },
  uploadCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(141, 155, 145, 0.25)',
    padding: 16,
    marginBottom: 16,
  },
  uploadCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: BrandColors.primary,
  },
  uploadCardSubtitle: {
    fontSize: 11,
    color: BrandColors.textSecondary,
    marginTop: 2,
  },
  deleteBtn: {
    padding: 6,
    backgroundColor: 'rgba(211, 47, 47, 0.08)',
    borderRadius: 8,
  },
  previewContainer: {
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(141, 155, 145, 0.2)',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  uploadBox: {
    height: 100,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: BrandColors.primary,
    backgroundColor: 'rgba(46, 125, 50, 0.02)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  uploadBoxActive: {
    backgroundColor: 'rgba(46, 125, 50, 0.08)',
  },
  uploadBoxText: {
    fontSize: 12,
    fontWeight: '700',
    color: BrandColors.primary,
  },
  uploadBoxSubtext: {
    fontSize: 10,
    color: BrandColors.outline,
  },
  uploadSubmitBtn: {
    marginTop: 8,
  },
  emptyNotificationsContainer: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyNotificationsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: BrandColors.primaryContainer,
    marginBottom: 4,
    textAlign: 'center',
  },
  emptyNotificationsSub: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  caseSummaryCard: {
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: BrandColors.outlineVariant,
  },
  caseSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  caseSummaryIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 86, 210, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  caseSummaryTitleContainer: {
    flex: 1,
  },
  caseSummaryType: {
    fontSize: 16,
    fontWeight: '700',
    color: BrandColors.primaryContainer,
  },
  caseSummaryId: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressSection: {
    marginBottom: 16,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: BrandColors.textSecondary,
  },
  progressPercentText: {
    fontSize: 14,
    fontWeight: '700',
    color: BrandColors.accentBlue,
  },
  progressBarTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 86, 210, 0.06)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: BrandColors.accentBlue,
  },
  currentStepContainer: {
    backgroundColor: 'rgba(10, 35, 66, 0.02)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(10, 35, 66, 0.04)',
    marginBottom: 16,
  },
  stepInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  currentStepTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: BrandColors.primaryContainer,
    marginLeft: 6,
  },
  currentStepDesc: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    lineHeight: 16,
  },
  caseSummaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BrandColors.accentBlue,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  caseSummaryBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  noCaseContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  noCaseIconBg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(10, 35, 66, 0.04)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  noCaseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: BrandColors.primaryContainer,
    marginBottom: 6,
  },
  noCaseSub: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  noCaseActionRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  noCaseSmallBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BrandColors.outlineVariant,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  noCaseSmallBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: BrandColors.primaryContainer,
  },
});
