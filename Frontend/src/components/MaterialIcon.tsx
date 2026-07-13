import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

type MaterialIconProps = {
  name: string;
  size?: number;
  color?: string;
  style?: any;
};

// Map Stitch Material Symbol names to Expo MaterialIcons names
const iconMap: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  'security': 'security',
  'notifications': 'notifications',
  'send': 'send',
  'search': 'search',
  'verified': 'verified',
  'cancel': 'cancel',
  'bolt': 'bolt',
  'password': 'vpn-key',
  'travel_explore': 'explore',
  'location_searching': 'location-searching',
  'cloud_upload': 'cloud-upload',
  'calendar_month': 'calendar-today',
  'check_circle': 'check-circle',
  'badge': 'badge',
  'lock': 'lock',
  'visibility': 'visibility',
  'visibility_off': 'visibility-off',
  'fingerprint': 'fingerprint',
  'face': 'face',
  'person': 'person',
  'person_add': 'person-add',
  'email': 'email',
  'phone': 'phone',
  'verified_user': 'verified-user',
  'logout': 'logout',
  'edit': 'edit',
  'upload_file': 'upload-file',
  'notifications_active': 'notifications-active',
  'language': 'language',
  'help_outline': 'help-outline',
  'home': 'home',
  'folder_shared': 'folder-shared',
  'add_circle': 'add-circle',
  'chat_bubble': 'chat-bubble',
  'account_circle': 'account-circle',
  'arrow_back': 'arrow-back',
  'location_on': 'location-on',
  'chevron_left': 'chevron-left',
  'chevron_right': 'chevron-right',
  'expand_more': 'expand-more',
  'schedule': 'schedule',
  'domain': 'business',
  'support_agent': 'support-agent',
  'calendar_today': 'calendar-today',
  'arrow_forward': 'arrow-forward',
  'assignment_turned_in': 'assignment-turned-in',
  'hourglass_top': 'hourglass-top',
  'info': 'info',
  'close': 'close',
};

export default function MaterialIcon({ name, size = 24, color = '#141d23', style }: MaterialIconProps) {
  // Fallback to name or check map
  const expoName = iconMap[name] || (name.replace(/_/g, '-') as keyof typeof MaterialIcons.glyphMap);
  
  return (
    <MaterialIcons
      name={expoName}
      size={size}
      color={color}
      style={style}
    />
  );
}
