import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { BrandColors } from '@/constants/Colors';
import TopBar from '@/components/TopBar';
import GlassCard from '@/components/GlassCard';
import CustomButton from '@/components/CustomButton';
import MaterialIcon from '@/components/MaterialIcon';
import { useApp, AppointmentType } from '@/context/AppContext';

const locations = [
  { id: 'accra_hq', name: 'Greater Accra - GIS Head Office, Accra' },
  { id: 'kia', name: 'Greater Accra - Kotoka International Airport Office' },
  { id: 'kumasi', name: 'Ashanti Region - Kumasi Regional Office' },
  { id: 'takoradi', name: 'Western Region - Takoradi Regional Office' },
  { id: 'tamale', name: 'Northern Region - Tamale Regional Office' },
  { id: 'ho', name: 'Volta Region - Ho Regional Office' },
  { id: 'cape_coast', name: 'Central Region - Cape Coast Office' },
  { id: 'sunyani', name: 'Bono Region - Sunyani Office' },
];

const timeSlots = [
  { time: '08:30 AM', available: true },
  { time: '09:00 AM', available: true },
  { time: '09:30 AM', available: true },
  { time: '10:00 AM', available: true },
  { time: '10:30 AM', available: false },
  { time: '11:00 AM', available: true },
  { time: '11:30 AM', available: true },
  { time: '01:00 PM', available: true },
  { time: '01:30 PM', available: true },
  { time: '02:00 PM', available: true },
  { time: '02:30 PM', available: true },
];

const years = [2026, 2027, 2028];
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function AppointmentsScreen() {
  const { bookAppointment, deleteAppointment, updateAppointment, appointments } = useApp();

  const [selectedLocIdx, setSelectedLocIdx] = useState(0);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(6); // July (0-indexed)
  const [selectedDay, setSelectedDay] = useState(14);
  const [selectedTime, setSelectedTime] = useState('09:00 AM');
  
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  
  const [supportingDoc, setSupportingDoc] = useState<string | null>(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [showUploadPicker, setShowUploadPicker] = useState(false);
  const [booking, setBooking] = useState(false);

  // Edit / Modify Appointment State
  const [editingApptId, setEditingApptId] = useState<string | null>(null);

  // Custom Alert Modal State
  const [customAlert, setCustomAlert] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type: 'info' | 'success' | 'confirm' | 'error';
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
  }>({
    visible: false,
    title: '',
    message: '',
    type: 'info',
  });

  const showAlert = (
    title: string,
    message: string,
    type: 'info' | 'success' | 'confirm' | 'error' = 'info',
    onConfirm?: () => void,
    confirmText = 'OK',
    cancelText = 'Cancel'
  ) => {
    setCustomAlert({
      visible: true,
      title,
      message,
      type,
      onConfirm,
      confirmText,
      cancelText,
    });
  };

  const handleBookOrUpdate = () => {
    setBooking(true);
    setTimeout(() => {
      const dateStr = `${months[selectedMonth]} ${selectedDay}, ${selectedYear}`;
      const officeName = locations[selectedLocIdx].name.split(' - ')[0];
      const officeDetail = locations[selectedLocIdx].name.split(' - ')[1];

      if (editingApptId) {
        // Update existing appointment
        updateAppointment(editingApptId, {
          office: officeName,
          date: dateStr,
          time: selectedTime,
          supportingDocUri: supportingDoc || undefined,
        });
        setEditingApptId(null);
        showAlert(
          'Appointment Modified',
          `Your biometrics appointment has been updated to ${officeDetail} for ${dateStr} at ${selectedTime}.`,
          'success'
        );
      } else {
        // Book brand new appointment
        bookAppointment(
          officeName,
          dateStr,
          selectedTime,
          supportingDoc || undefined
        );
        showAlert(
          'Appointment Scheduled',
          `Your biometrics appointment at the ${officeDetail} for ${dateStr} at ${selectedTime} has been secured.`,
          'success'
        );
      }
      
      setBooking(false);
      // Reset upload states
      setSupportingDoc(null);
    }, 1200);
  };

  const handleMonthChange = (idx: number) => {
    setSelectedMonth(idx);
    setShowMonthPicker(false);
    const maxDays = new Date(selectedYear, idx + 1, 0).getDate();
    if (selectedDay > maxDays) {
      setSelectedDay(1);
    }
  };

  const handleYearChange = (yr: number) => {
    setSelectedYear(yr);
    setShowYearPicker(false);
    const maxDays = new Date(yr, selectedMonth + 1, 0).getDate();
    if (selectedDay > maxDays) {
      setSelectedDay(1);
    }
  };

  // Pre-fill the scheduler form to modify appointment details
  const startModifyAppointment = (appt: AppointmentType) => {
    setEditingApptId(appt.id);
    
    // Find matching regional office index
    const foundIdx = locations.findIndex(
      loc => loc.name.includes(appt.office) || appt.office.includes(loc.name.split(' - ')[0])
    );
    if (foundIdx !== -1) {
      setSelectedLocIdx(foundIdx);
    }

    // Parse structured date (e.g. "July 14, 2026")
    try {
      const parts = appt.date.split(' ');
      if (parts.length >= 3) {
        const mStr = parts[0];
        const mIdx = months.indexOf(mStr);
        if (mIdx !== -1) setSelectedMonth(mIdx);

        const dStr = parts[1].replace(',', '');
        const dNum = parseInt(dStr, 10);
        if (!isNaN(dNum)) setSelectedDay(dNum);

        const yStr = parts[2];
        const yNum = parseInt(yStr, 10);
        if (!isNaN(yNum)) setSelectedYear(yNum);
      }
    } catch (e) {
      console.log('Could not parse scheduled date:', e);
    }

    setSelectedTime(appt.time);
    setSupportingDoc(appt.supportingDocUri || null);

    showAlert(
      'Modify Appointment',
      'The scheduler form has been pre-filled with your appointment details. Modify your values and click "Update Appointment" below.',
      'info'
    );
  };

  const cancelModifyMode = () => {
    setEditingApptId(null);
    setSupportingDoc(null);
    showAlert('Edit Cancelled', 'Reverted back to standard scheduling mode.', 'info');
  };

  const confirmCancelAppointment = (id: string, office: string, date: string) => {
    showAlert(
      'Cancel Appointment',
      `Are you sure you want to cancel your booked biometrics appointment for ${office} on ${date}? This slot will be released back to the general pool.`,
      'confirm',
      () => {
        deleteAppointment(id);
        setTimeout(() => {
          showAlert('Slot Released', 'Your biometrics appointment slot has been successfully cancelled.', 'success');
        }, 150);
      },
      'Cancel Slot',
      'Keep Slot'
    );
  };

  // Helper to generate calendar grid dynamically
  const getDaysInMonth = (monthIndex: number, yearValue: number) => {
    const date = new Date(yearValue, monthIndex, 1);
    const days = [];
    const startDayOfWeek = date.getDay();
    const totalDays = new Date(yearValue, monthIndex + 1, 0).getDate();
    const prevMonthTotalDays = new Date(yearValue, monthIndex, 0).getDate();
    
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthTotalDays - i,
        isCurrentMonth: false,
      });
    }
    
    for (let d = 1; d <= totalDays; d++) {
      days.push({
        day: d,
        isCurrentMonth: true,
      });
    }
    
    const totalCells = days.length <= 35 ? 35 : 42;
    const remaining = totalCells - days.length;
    for (let n = 1; n <= remaining; n++) {
      days.push({
        day: n,
        isCurrentMonth: false,
      });
    }
    
    return days;
  };

  const calendarDays = getDaysInMonth(selectedMonth, selectedYear);

  const getDayStyle = (item: { day: number; isCurrentMonth: boolean }) => {
    if (!item.isCurrentMonth) {
      return styles.calendarDayOutside;
    }
    if (item.day === selectedDay) {
      return styles.calendarDaySelected;
    }
    return styles.calendarDayActive;
  };

  const getDayTextStyle = (item: { day: number; isCurrentMonth: boolean }) => {
    if (!item.isCurrentMonth) {
      return styles.calendarDayTextOutside;
    }
    if (item.day === selectedDay) {
      return styles.calendarDayTextSelected;
    }
    return styles.calendarDayTextActive;
  };

  // Document Upload simulator (Clean, no fake/stock Unsplash images)
  const triggerUpload = (option: 'ghana_card_slip' | 'nia_slip' | 'camera_live') => {
    setShowUploadPicker(false);
    setUploadingDoc(true);
    
    setTimeout(() => {
      setUploadingDoc(false);
      const names = {
        ghana_card_slip: 'Ghana_Card_Vetting_Confirmation.pdf',
        nia_slip: 'NIA_Official_Registration_Slip.pdf',
        camera_live: 'Live_Document_Camera_Capture.pdf'
      };
      setSupportingDoc(names[option]);
      showAlert('Upload Successful', 'Security document scan was encrypted, uploaded, and linked to this booking slot.', 'success');
    }, 1200);
  };

  return (
    <View style={styles.outerContainer}>
      <TopBar title="Book Appointment" showBack={false} />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {editingApptId ? 'Modify Biometric Slot' : 'Schedule Biometric Appointment'}
          </Text>
          <Text style={styles.subtitle}>
            Secure or update your regional booking for biometrics capturing, official document verification, and GIS registry onboarding.
          </Text>
        </View>

        {editingApptId && (
          <View style={styles.editingBanner}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcon name="edit" size={16} color="#0056d2" />
              <Text style={styles.editingBannerText}>Currently modifying booked slot</Text>
            </View>
            <TouchableOpacity onPress={cancelModifyMode} style={styles.cancelEditHeaderBtn}>
              <Text style={styles.cancelEditHeaderBtnText}>Cancel Edit</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 1. Select Location */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcon name="location_on" size={20} color={BrandColors.primaryContainer} />
            <Text style={styles.sectionTitle}>Select Regional Office</Text>
          </View>

          <TouchableOpacity
            style={styles.pickerSelector}
            onPress={() => {
              setShowLocationPicker(!showLocationPicker);
              setShowYearPicker(false);
              setShowMonthPicker(false);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.pickerSelectorText} numberOfLines={1}>
              {locations[selectedLocIdx].name}
            </Text>
            <MaterialIcon name="expand_more" size={20} color={BrandColors.outline} />
          </TouchableOpacity>

          {showLocationPicker && (
            <GlassCard style={styles.pickerDropdown}>
              {locations.map((loc, idx) => (
                <TouchableOpacity
                  key={loc.id}
                  style={[
                    styles.pickerOption,
                    idx === selectedLocIdx && styles.pickerOptionActive,
                  ]}
                  onPress={() => {
                    setSelectedLocIdx(idx);
                    setShowLocationPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.pickerOptionText,
                      idx === selectedLocIdx && styles.pickerOptionTextActive,
                    ]}
                  >
                    {loc.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </GlassCard>
          )}
        </View>

        {/* 2. Select Date (Dynamic Year, Month, Day) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcon name="calendar_month" size={20} color={BrandColors.primaryContainer} />
            <Text style={styles.sectionTitle}>Select Date</Text>
          </View>

          {/* Selectors for Year and Month */}
          <View style={styles.dateSelectorRow}>
            {/* Month Dropdown */}
            <View style={{ flex: 1.3 }}>
              <TouchableOpacity
                style={styles.dateSubSelector}
                onPress={() => {
                  setShowMonthPicker(!showMonthPicker);
                  setShowYearPicker(false);
                  setShowLocationPicker(false);
                }}
              >
                <Text style={styles.dateSubSelectorText}>{months[selectedMonth]}</Text>
                <MaterialIcon name="expand_more" size={16} color={BrandColors.textSecondary} />
              </TouchableOpacity>
              
              {showMonthPicker && (
                <GlassCard style={styles.subDropdown}>
                  <ScrollView style={{ maxHeight: 180 }} nestedScrollEnabled>
                    {months.map((m, idx) => (
                      <TouchableOpacity
                        key={m}
                        style={[styles.subDropdownOption, idx === selectedMonth && styles.subDropdownOptionActive]}
                        onPress={() => handleMonthChange(idx)}
                      >
                        <Text style={[styles.subDropdownText, idx === selectedMonth && styles.subDropdownTextActive]}>
                          {m}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </GlassCard>
              )}
            </View>

            {/* Year Dropdown */}
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={styles.dateSubSelector}
                onPress={() => {
                  setShowYearPicker(!showYearPicker);
                  setShowMonthPicker(false);
                  setShowLocationPicker(false);
                }}
              >
                <Text style={styles.dateSubSelectorText}>{selectedYear}</Text>
                <MaterialIcon name="expand_more" size={16} color={BrandColors.textSecondary} />
              </TouchableOpacity>

              {showYearPicker && (
                <GlassCard style={styles.subDropdown}>
                  {years.map((y) => (
                    <TouchableOpacity
                      key={y}
                      style={[styles.subDropdownOption, y === selectedYear && styles.subDropdownOptionActive]}
                      onPress={() => handleYearChange(y)}
                    >
                      <Text style={[styles.subDropdownText, y === selectedYear && styles.subDropdownTextActive]}>
                        {y}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </GlassCard>
              )}
            </View>
          </View>

          {/* Dynamic Day Grid */}
          <GlassCard style={styles.calendarCard}>
            <View style={styles.weekdayRow}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                <Text key={idx} style={styles.weekdayText}>
                  {day}
                </Text>
              ))}
            </View>

            <View style={styles.daysGrid}>
              {calendarDays.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.calendarDay, getDayStyle(item)]}
                  onPress={() => item.isCurrentMonth && setSelectedDay(item.day)}
                  disabled={!item.isCurrentMonth}
                >
                  <Text style={[styles.calendarDayText, getDayTextStyle(item)]}>
                    {item.day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </GlassCard>
        </View>

        {/* 3. Select Time */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcon name="schedule" size={20} color={BrandColors.primaryContainer} />
            <Text style={styles.sectionTitle}>Select Time Slot</Text>
          </View>

          <View style={styles.timeGrid}>
            {timeSlots.map((slot) => {
              const isActive = selectedTime === slot.time;
              return (
                <TouchableOpacity
                  key={slot.time}
                  style={[
                    styles.timeSlot,
                    isActive && styles.timeSlotActive,
                    !slot.available && styles.timeSlotDisabled,
                  ]}
                  disabled={!slot.available}
                  onPress={() => setSelectedTime(slot.time)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.timeSlotText,
                      isActive && styles.timeSlotTextActive,
                      !slot.available && styles.timeSlotTextDisabled,
                    ]}
                  >
                    {slot.time}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 4. Mandatory Supporting Document / Image upload for scheduling */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcon name="upload_file" size={20} color={BrandColors.primaryContainer} />
            <Text style={styles.sectionTitle}>Supporting Documentation</Text>
          </View>

          <GlassCard style={styles.uploadContainer}>
            <Text style={styles.uploadLabel}>
              Please pre-authenticate your booking slot by uploading an official confirmation document (Ghana Card confirmation slip or NIA registry slip):
            </Text>

            {uploadingDoc ? (
              <View style={styles.uploadLoader}>
                <ActivityIndicator size="small" color={BrandColors.accentBlue} />
                <Text style={styles.uploadLoaderText}>Securing and uploading official scan...</Text>
              </View>
            ) : supportingDoc ? (
              <View style={styles.previewContainer}>
                <View style={styles.docFileCircle}>
                  <MaterialIcon name="picture_as_pdf" size={24} color={BrandColors.accentBlue} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.docName} numberOfLines={1}>
                    {supportingDoc}
                  </Text>
                  <Text style={styles.docStatus}>Ready for Biometrics Vetting</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => setShowUploadPicker(true)} 
                  style={styles.reuploadDocBtn}
                >
                  <Text style={styles.reuploadDocBtnText}>Replace</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.uploadButton}
                onPress={() => setShowUploadPicker(true)}
              >
                <MaterialIcon name="cloud_upload" size={24} color={BrandColors.accentBlue} />
                <Text style={styles.uploadButtonTitle}>Upload Required Scan</Text>
                <Text style={styles.uploadButtonSub}>Select PDF or image of NIA / Ghana Card Slip</Text>
              </TouchableOpacity>
            )}
          </GlassCard>

          {/* Upload Selector Overlay */}
          {showUploadPicker && (
            <GlassCard style={styles.uploadPickerOverlay}>
              <Text style={styles.pickerHeader}>Select Document Source</Text>
              
              <TouchableOpacity 
                style={styles.pickerOptionItem}
                onPress={() => triggerUpload('ghana_card_slip')}
              >
                <MaterialIcon name="badge" size={18} color={BrandColors.accentBlue} style={{ marginRight: 10 }} />
                <Text style={styles.pickerOptionItemText}>Ghana Card Confirmation Slip</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.pickerOptionItem}
                onPress={() => triggerUpload('nia_slip')}
              >
                <MaterialIcon name="receipt" size={18} color={BrandColors.accentBlue} style={{ marginRight: 10 }} />
                <Text style={styles.pickerOptionItemText}>NIA Official Registration Slip</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.pickerOptionItem, { borderBottomWidth: 0 }]}
                onPress={() => triggerUpload('camera_live')}
              >
                <MaterialIcon name="photo_camera" size={18} color={BrandColors.accentBlue} style={{ marginRight: 10 }} />
                <Text style={styles.pickerOptionItemText}>Take Photo with Device Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.cancelPickerBtn}
                onPress={() => setShowUploadPicker(false)}
              >
                <Text style={styles.cancelPickerBtnText}>Cancel</Text>
              </TouchableOpacity>
            </GlassCard>
          )}
        </View>

        {/* 5. Summary & Booking */}
        <GlassCard style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Appointment Summary</Text>

          <View style={styles.summaryDetails}>
            <View style={styles.summaryRow}>
              <MaterialIcon name="domain" size={18} color="rgba(255, 255, 255, 0.7)" />
              <View style={styles.summaryTextCol}>
                <Text style={styles.summaryLabel}>Regional Location</Text>
                <Text style={styles.summaryVal}>
                  {locations[selectedLocIdx].name.split(' - ')[1]}
                </Text>
              </View>
            </View>

            <View style={styles.summaryRow}>
              <MaterialIcon name="calendar_today" size={18} color="rgba(255, 255, 255, 0.7)" />
              <View style={styles.summaryTextCol}>
                <Text style={styles.summaryLabel}>Scheduled Date</Text>
                <Text style={styles.summaryVal}>{months[selectedMonth]} {selectedDay}, {selectedYear}</Text>
              </View>
            </View>

            <View style={styles.summaryRow}>
              <MaterialIcon name="schedule" size={18} color="rgba(255, 255, 255, 0.7)" />
              <View style={styles.summaryTextCol}>
                <Text style={styles.summaryLabel}>Biometric Time Slot</Text>
                <Text style={styles.summaryVal}>{selectedTime}</Text>
              </View>
            </View>

            <View style={styles.summaryRow}>
              <MaterialIcon name="check_circle" size={18} color="rgba(255, 255, 255, 0.7)" />
              <View style={styles.summaryTextCol}>
                <Text style={styles.summaryLabel}>Vetting Attachment</Text>
                <Text style={styles.summaryVal}>
                  {supportingDoc ? 'GIS_Verification_Attached.pdf' : 'No document uploaded (Upload recommended)'}
                </Text>
              </View>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            {editingApptId && (
              <TouchableOpacity 
                style={styles.cancelEditBtn}
                onPress={cancelModifyMode}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelEditBtnText}>Cancel</Text>
              </TouchableOpacity>
            )}
            <CustomButton
              title={booking ? "Saving details..." : (editingApptId ? "Update Appointment" : "Book Appointment")}
              variant="glass"
              textStyle={{ color: '#ffffff' }}
              onPress={handleBookOrUpdate}
              loading={booking}
              style={{ ...styles.bookBtn, flex: 1 }}
            />
          </View>
        </GlassCard>

        {/* 6. List of already booked appointments */}
        {appointments.length > 0 && (
          <View style={{ marginTop: 24 }}>
            <View style={styles.sectionHeader}>
              <MaterialIcon name="bookmark_added" size={20} color={BrandColors.success} />
              <Text style={[styles.sectionTitle, { color: BrandColors.success }]}>Your Booked Appointments</Text>
            </View>

            {appointments.map((appt) => (
              <GlassCard key={appt.id} style={styles.bookedCard}>
                <View style={styles.bookedHeader}>
                  <View style={styles.bookedIconCircle}>
                    <MaterialIcon name="verified" size={18} color={BrandColors.success} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.bookedOffice}>{appt.office}</Text>
                    <Text style={styles.bookedType}>{appt.type}</Text>
                  </View>
                  <View style={styles.actionsContainer}>
                    {/* Modify Appointment Button */}
                    <TouchableOpacity 
                      style={styles.actionBtnIcon} 
                      onPress={() => startModifyAppointment(appt)}
                      activeOpacity={0.7}
                    >
                      <MaterialIcon name="edit" size={18} color={BrandColors.accentBlue} />
                    </TouchableOpacity>
                    
                    {/* Delete Appointment Button */}
                    <TouchableOpacity 
                      style={styles.actionBtnIcon} 
                      onPress={() => confirmCancelAppointment(appt.id, appt.office, appt.date)}
                      activeOpacity={0.7}
                    >
                      <MaterialIcon name="delete" size={18} color={BrandColors.error} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.bookedDetailsRow}>
                  <View style={styles.bookedDetailCol}>
                    <Text style={styles.bookedDetailLabel}>Date</Text>
                    <Text style={styles.bookedDetailVal}>{appt.date}</Text>
                  </View>
                  <View style={styles.bookedDetailCol}>
                    <Text style={styles.bookedDetailLabel}>Time</Text>
                    <Text style={styles.bookedDetailVal}>{appt.time}</Text>
                  </View>
                  <View style={styles.bookedDetailCol}>
                    <Text style={styles.bookedDetailLabel}>Status</Text>
                    <Text style={[styles.bookedDetailVal, { color: BrandColors.success, fontWeight: '700' }]}>Secured</Text>
                  </View>
                </View>
              </GlassCard>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Custom Elegant Alert Dialog */}
      {customAlert.visible && (
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={[
                styles.modalIconBg,
                customAlert.type === 'success' && { backgroundColor: 'rgba(16, 185, 129, 0.1)' },
                customAlert.type === 'confirm' && { backgroundColor: 'rgba(239, 68, 68, 0.1)' },
                customAlert.type === 'error' && { backgroundColor: 'rgba(239, 68, 68, 0.1)' },
                customAlert.type === 'info' && { backgroundColor: 'rgba(0, 86, 210, 0.1)' },
              ]}>
                <MaterialIcon 
                  name={
                    customAlert.type === 'success' ? 'check_circle' :
                    customAlert.type === 'confirm' ? 'warning' :
                    customAlert.type === 'error' ? 'error' : 'info'
                  } 
                  size={28} 
                  color={
                    customAlert.type === 'success' ? BrandColors.success :
                    customAlert.type === 'confirm' ? BrandColors.error :
                    customAlert.type === 'error' ? BrandColors.error : BrandColors.accentBlue
                  } 
                />
              </View>
              <Text style={styles.modalTitle}>{customAlert.title}</Text>
            </View>
            <Text style={styles.modalMessage}>{customAlert.message}</Text>
            <View style={styles.modalActionRow}>
              {customAlert.type === 'confirm' ? (
                <>
                  <TouchableOpacity 
                    style={[styles.modalBtn, styles.modalBtnCancel]} 
                    onPress={() => setCustomAlert({ ...customAlert, visible: false })}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.modalBtnCancelText}>{customAlert.cancelText || 'Cancel'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.modalBtn, styles.modalBtnConfirm]} 
                    onPress={() => {
                      setCustomAlert({ ...customAlert, visible: false });
                      if (customAlert.onConfirm) {
                        customAlert.onConfirm();
                      }
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.modalBtnConfirmText}>{customAlert.confirmText || 'Confirm'}</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity 
                  style={[styles.modalBtn, styles.modalBtnOk]} 
                  onPress={() => setCustomAlert({ ...customAlert, visible: false })}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalBtnOkText}>{customAlert.confirmText || 'OK'}</Text>
                </TouchableOpacity>
              )}
            </View>
          </GlassCard>
        </View>
      )}
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
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: BrandColors.primaryContainer,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  subtitle: {
    fontSize: 13,
    color: BrandColors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  editingBanner: {
    backgroundColor: '#e6eff8',
    borderColor: 'rgba(0, 86, 210, 0.15)',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  editingBannerText: {
    color: '#0056d2',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
  cancelEditHeaderBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#0056d2',
  },
  cancelEditHeaderBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0056d2',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: BrandColors.primaryContainer,
    marginLeft: 6,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  pickerSelector: {
    height: 50,
    borderWidth: 1,
    borderColor: BrandColors.outlineVariant,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  pickerSelectorText: {
    fontSize: 13,
    color: BrandColors.text,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  pickerDropdown: {
    marginTop: 6,
    padding: 6,
    borderRadius: 12,
  },
  pickerOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  pickerOptionActive: {
    backgroundColor: 'rgba(0, 86, 210, 0.06)',
  },
  pickerOptionText: {
    fontSize: 13,
    color: BrandColors.textSecondary,
  },
  pickerOptionTextActive: {
    color: BrandColors.accentBlue,
    fontWeight: '600',
  },
  dateSelectorRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
    zIndex: 10,
  },
  dateSubSelector: {
    height: 44,
    borderWidth: 1,
    borderColor: BrandColors.outlineVariant,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  dateSubSelectorText: {
    fontSize: 13,
    fontWeight: '600',
    color: BrandColors.text,
  },
  subDropdown: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 4,
    shadowColor: '#0a2342',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    zIndex: 50,
  },
  subDropdownOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  subDropdownOptionActive: {
    backgroundColor: 'rgba(0, 86, 210, 0.06)',
  },
  subDropdownText: {
    fontSize: 12,
    color: BrandColors.textSecondary,
  },
  subDropdownTextActive: {
    color: BrandColors.accentBlue,
    fontWeight: '600',
  },
  calendarCard: {
    padding: 12,
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  weekdayText: {
    width: 36,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    color: BrandColors.outline,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    rowGap: 8,
  },
  calendarDay: {
    width: 38,
    height: 38,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarDayOutside: {
    opacity: 0.25,
  },
  calendarDayActive: {
    backgroundColor: 'transparent',
  },
  calendarDaySelected: {
    backgroundColor: BrandColors.accentBlue,
  },
  calendarDayText: {
    fontSize: 13,
    fontWeight: '600',
  },
  calendarDayTextOutside: {
    color: BrandColors.outline,
  },
  calendarDayTextActive: {
    color: BrandColors.text,
  },
  calendarDayTextSelected: {
    color: '#ffffff',
    fontWeight: '700',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlot: {
    width: '23%',
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BrandColors.outlineVariant,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeSlotActive: {
    backgroundColor: BrandColors.primaryContainer,
    borderColor: BrandColors.primaryContainer,
  },
  timeSlotDisabled: {
    backgroundColor: '#e6eff8',
    borderColor: '#c4c6cf',
    opacity: 0.4,
  },
  timeSlotText: {
    fontSize: 11,
    fontWeight: '600',
    color: BrandColors.text,
  },
  timeSlotTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  timeSlotTextDisabled: {
    color: BrandColors.outline,
  },
  uploadContainer: {
    padding: 14,
  },
  uploadLabel: {
    fontSize: 11,
    color: BrandColors.textSecondary,
    marginBottom: 12,
    lineHeight: 16,
  },
  uploadButton: {
    height: 100,
    borderWidth: 1,
    borderColor: BrandColors.outline,
    borderStyle: 'dashed',
    borderRadius: 10,
    backgroundColor: 'rgba(10, 35, 66, 0.01)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButtonTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: BrandColors.accentBlue,
    marginTop: 6,
  },
  uploadButtonSub: {
    fontSize: 10,
    color: BrandColors.outline,
    marginTop: 2,
  },
  uploadLoader: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadLoaderText: {
    fontSize: 11,
    fontWeight: '600',
    color: BrandColors.textSecondary,
    marginTop: 8,
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: 10,
    padding: 10,
  },
  docFileCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 86, 210, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  docName: {
    fontSize: 12,
    fontWeight: '700',
    color: BrandColors.primaryContainer,
  },
  docStatus: {
    fontSize: 10,
    color: BrandColors.success,
    fontWeight: '600',
    marginTop: 2,
  },
  reuploadDocBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: BrandColors.outline,
    backgroundColor: '#ffffff',
  },
  reuploadDocBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: BrandColors.textSecondary,
  },
  uploadPickerOverlay: {
    marginTop: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: BrandColors.outlineVariant,
  },
  pickerHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: BrandColors.primaryContainer,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    paddingLeft: 4,
  },
  pickerOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(10, 35, 66, 0.05)',
    paddingLeft: 4,
  },
  pickerOptionItemText: {
    fontSize: 12,
    fontWeight: '600',
    color: BrandColors.text,
  },
  cancelPickerBtn: {
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 6,
    backgroundColor: 'rgba(10, 35, 66, 0.03)',
    borderRadius: 6,
  },
  cancelPickerBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: BrandColors.textSecondary,
  },
  summaryCard: {
    backgroundColor: BrandColors.primaryContainer,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: BrandColors.primaryContainer,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    marginTop: 8,
    padding: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  summaryDetails: {
    gap: 12,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryTextCol: {
    marginLeft: 12,
  },
  summaryLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  summaryVal: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '600',
    marginTop: 1,
  },
  bookBtn: {
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  cancelEditBtn: {
    width: 80,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelEditBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  bookedCard: {
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.12)',
  },
  bookedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  bookedIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  bookedOffice: {
    fontSize: 13,
    fontWeight: '700',
    color: BrandColors.primaryContainer,
  },
  bookedType: {
    fontSize: 10,
    color: BrandColors.textSecondary,
    marginTop: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtnIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f4f9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(10, 35, 66, 0.05)',
  },
  bookedDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(10, 35, 66, 0.02)',
    borderRadius: 8,
    padding: 8,
  },
  bookedDetailCol: {
    flex: 1,
    alignItems: 'center',
  },
  bookedDetailLabel: {
    fontSize: 9,
    color: BrandColors.outline,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 2,
  },
  bookedDetailVal: {
    fontSize: 11,
    color: BrandColors.text,
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 35, 66, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99999,
    padding: 24,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#0a2342',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(10, 35, 66, 0.08)',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: BrandColors.primaryContainer,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    color: BrandColors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    justifyContent: 'center',
  },
  modalBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnCancel: {
    backgroundColor: '#f0f4f9',
    borderWidth: 1,
    borderColor: 'rgba(10, 35, 66, 0.08)',
  },
  modalBtnCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: BrandColors.textSecondary,
  },
  modalBtnConfirm: {
    backgroundColor: BrandColors.error,
  },
  modalBtnConfirmText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  modalBtnOk: {
    backgroundColor: BrandColors.accentBlue,
  },
  modalBtnOkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});
