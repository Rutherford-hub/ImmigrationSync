import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Animated, ActivityIndicator, Image, Text, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { AppProvider } from '@/context/AppContext';
import { BrandColors } from '@/constants/Colors';
import MaterialIcon from '@/components/MaterialIcon';

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const fadeAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    // Simulate splash screen load
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => setAppReady(true));
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AppProvider>
      <View style={styles.wrapper}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>

        {!appReady && (
          <Animated.View style={[styles.splashContainer, { opacity: fadeAnim }]} pointerEvents="none">
            {/* Soft gradient accent orb in background */}
            <View style={styles.blurOrb} />
            
            <View style={styles.splashLogoContainer}>
              <View style={styles.logoOrb}>
                <Image
                  source={require('../../assets/images/stitch-logo.png')}
                  style={styles.logoImage}
                />
              </View>
              <Text style={styles.splashBrand}>ImmigraSync</Text>
              <Text style={styles.splashSub}>Secure Immigration</Text>
            </View>
            <ActivityIndicator size="small" color={BrandColors.accentBlue} style={styles.loader} />
          </Animated.View>
        )}
      </View>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  splashContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999,
  },
  blurOrb: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(46, 125, 50, 0.03)',
    top: '30%',
    left: '20%',
    ...Platform.select({
      web: {
        filter: 'blur(50px)',
      },
    }),
  },
  splashLogoContainer: {
    alignItems: 'center',
    gap: 12,
  },
  logoOrb: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0a2342',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(10, 35, 66, 0.04)',
    overflow: 'hidden',
  },
  logoImage: {
    width: 58,
    height: 58,
    resizeMode: 'contain',
  },
  splashBrand: {
    fontSize: 24,
    fontWeight: '800',
    color: BrandColors.primaryContainer,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    marginTop: 8,
  },
  splashSub: {
    fontSize: 11,
    color: BrandColors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  loader: {
    position: 'absolute',
    bottom: 60,
  },
});
