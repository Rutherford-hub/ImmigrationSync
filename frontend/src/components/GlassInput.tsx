import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  TextInputProps,
  Platform,
} from 'react-native';
import MaterialIcon from './MaterialIcon';
import { BrandColors } from '@/constants/Colors';

interface GlassInputProps extends TextInputProps {
  label: string;
  iconName?: string;
  isPassword?: boolean;
}

export default function GlassInput({
  label,
  iconName,
  isPassword = false,
  value = '',
  onChangeText,
  onFocus,
  onBlur,
  placeholder,
  ...rest
}: GlassInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!isPassword);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const showCustomPlaceholder = !!placeholder && value.length === 0;

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, isFocused && styles.labelFocused]}>{label}</Text>
      
      <View
        style={[
          styles.container,
          isFocused && styles.containerFocused,
        ]}
      >
        {iconName && (
          <View style={styles.iconContainer}>
            <MaterialIcon
              name={iconName}
              size={18}
              color={isFocused ? BrandColors.primary : BrandColors.outline}
            />
          </View>
        )}

        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={isPassword && !showPassword}
          placeholder=""
          {...rest}
        />

        {showCustomPlaceholder && (
          <Text
            style={[
              styles.customPlaceholder,
              {
                pointerEvents: 'none',
                left: iconName ? 38 : 12,
                right: isPassword ? 38 : 12,
              }
            ]}
          >
            {placeholder}
          </Text>
        )}

        {isPassword && (
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={0.6}
          >
            <MaterialIcon
              name={showPassword ? 'visibility_off' : 'visibility'}
              size={18}
              color={BrandColors.outline}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
    width: '100%',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: BrandColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 6,
    paddingLeft: 2,
  },
  labelFocused: {
    color: BrandColors.primary,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(141, 155, 145, 0.3)',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    ...Platform.select({
      web: {
        outlineStyle: 'none' as any,
      },
    }),
  },
  containerFocused: {
    borderColor: BrandColors.primary,
    backgroundColor: '#f9fbf9',
    ...Platform.select({
      web: {
        boxShadow: '0 0 0 3px rgba(46, 125, 50, 0.1)',
      },
      default: {
        elevation: 1,
      }
    }),
  },
  iconContainer: {
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontSize: 14,
    color: BrandColors.text,
    paddingVertical: 8,
    ...Platform.select({
      web: {
        outlineStyle: 'none' as any,
      },
    }),
  },
  customPlaceholder: {
    position: 'absolute',
    textAlign: 'center',
    color: '#8d9b91',
    opacity: 0.6,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  toggleButton: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
