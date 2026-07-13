import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { BrandColors } from '@/constants/Colors';
import MaterialIcon from '@/components/MaterialIcon';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
        }}
      />
      <Tabs.Screen
        name="cases"
        options={{
          title: 'Cases',
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: 'Appointments',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}

function CustomTabBar({ state, descriptors, navigation }: any) {
  if (!state || !state.routes) return null;
  const isWeb = Platform.OS === 'web';
  const tabIcons: Record<string, string> = {
    index: 'home',
    cases: 'folder_shared',
    appointments: 'calendar_month',
    profile: 'account_circle',
  };

  const getLabelText = (name: string, title?: string) => {
    if (title) return title;
    if (name === 'index') return 'Dashboard';
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <View style={styles.floatingContainer} pointerEvents="box-none">
      {isWeb ? (
        <View style={styles.tabBarWeb}>
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;
            const label = getLabelText(route.name, options.title);
            const iconName = tabIcons[route.name] || 'home';

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={[
                  styles.tabButton,
                  isFocused && styles.tabButtonActive,
                ]}
                activeOpacity={0.8}
              >
                <MaterialIcon
                  name={iconName}
                  size={22}
                  color={isFocused ? BrandColors.accentBlue : BrandColors.textSecondary}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    isFocused && styles.tabLabelActive,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <BlurView intensity={70} tint="light" style={styles.tabBar}>
          <View style={styles.tabBarInner}>
            {state.routes.map((route: any, index: number) => {
              const { options } = descriptors[route.key];
              const isFocused = state.index === index;
              const label = getLabelText(route.name, options.title);
              const iconName = tabIcons[route.name] || 'home';

              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };

              return (
                <TouchableOpacity
                  key={route.key}
                  onPress={onPress}
                  style={[
                    styles.tabButton,
                    isFocused && styles.tabButtonActive,
                  ]}
                  activeOpacity={0.8}
                >
                  <MaterialIcon
                    name={iconName}
                    size={22}
                    color={isFocused ? BrandColors.accentBlue : BrandColors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.tabLabel,
                      isFocused && styles.tabLabelActive,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </BlurView>
      )}
    </View>
  );
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    zIndex: 1000,
  },
  tabBar: {
    width: '100%',
    maxWidth: 500,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: BrandColors.glassBorder,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    overflow: 'hidden',
    shadowColor: '#0a2342',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  tabBarInner: {
    flexDirection: 'row',
    height: 64,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tabBarWeb: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 500,
    height: 64,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: BrandColors.glassBorder,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    shadowColor: '#0a2342',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  } as any,
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 24,
    gap: 2,
    marginHorizontal: 2,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(0, 86, 210, 0.06)',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: BrandColors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  tabLabelActive: {
    fontWeight: '700',
    color: BrandColors.accentBlue,
  },
});
