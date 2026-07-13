import React, { useRef } from 'react';
import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Animated,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { BrandColors } from '@/constants/Colors';
import MaterialIcon from './MaterialIcon';

type CustomButtonProps = {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  iconName?: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'glass';
};

export default function CustomButton({
  title,
  onPress,
  style,
  textStyle,
  iconName,
  loading = false,
  disabled = false,
  variant = 'primary',
}: CustomButtonProps) {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled || loading) return;
    Animated.spring(scaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
      tension: 40,
    }).start();
  };

  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryButton;
      case 'glass':
        return styles.glassButton;
      case 'primary':
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryText;
      case 'glass':
        return styles.glassText;
      case 'primary':
      default:
        return styles.primaryText;
    }
  };

  const getLoaderColor = () => {
    return variant === 'primary' ? '#ffffff' : BrandColors.accentBlue;
  };

  return (
    <TouchableWithoutFeedback
      onPress={disabled || loading ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.button,
          getButtonStyle(),
          disabled && styles.disabledButton,
          { transform: [{ scale: scaleValue }] },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={getLoaderColor()} />
        ) : (
          <View style={styles.content}>
            <Text style={[getTextStyle(), textStyle]}>{title}</Text>
            {iconName && (
              <MaterialIcon
                name={iconName}
                size={18}
                color={
                  variant === 'primary'
                    ? '#ffffff'
                    : variant === 'glass'
                    ? BrandColors.accentBlue
                    : BrandColors.accentBlue
                }
                style={styles.icon}
              />
            )}
          </View>
        )}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: BrandColors.primaryContainer,
    shadowColor: BrandColors.primaryContainer,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(10, 35, 66, 0.15)',
    shadowColor: '#0a2342',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  secondaryText: {
    color: BrandColors.accentBlue,
    fontSize: 16,
    fontWeight: '600',
  },
  glassButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  glassText: {
    color: BrandColors.accentBlue,
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#e6eff8',
    borderColor: '#c4c6cf',
    shadowOpacity: 0,
    elevation: 0,
    opacity: 0.6,
  },
  icon: {
    marginLeft: 8,
  },
});
