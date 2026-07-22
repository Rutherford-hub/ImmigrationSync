export const BrandColors = {
  primary: '#0a2342',           // Clean Deep Navy Blue
  primaryContainer: '#0a2342',  // Deep Navy Blue container
  onPrimary: '#ffffff',
  background: '#ffffff',
  surface: '#ffffff',
  surfaceContainer: '#f3f4f6',  // Clean light gray
  surfaceContainerHigh: '#e5e7eb', // Clean medium gray
  surfaceContainerLowest: '#ffffff',
  text: '#111827',              // Clean charcoal dark text
  textSecondary: '#4b5563',     // Clean slate secondary text
  outline: '#9ca3af',           // Clean gray outline
  outlineVariant: '#e5e7eb',    // Clean border gray
  success: '#10b981',           // Vibrant clean green
  error: '#ef4444',             // Vibrant clean red
  accent: '#0a2342',
  accentBlue: '#0056D2',        // Restored clean royal blue
  submitted: '#0056D2',         // Clean Blue color for Submitted cards
  underReview: '#d97706',       // Clean Gold/Yellow color for Under Review cards
  approved: '#10b981',          // Clean Green color for Approved cards
  rejected: '#ef4444',          // Clean Red color for Rejected cards
  
  // Glassmorphism properties
  glassBg: 'rgba(255, 255, 255, 0.85)',
  glassBorder: 'rgba(156, 163, 175, 0.2)',
  glassShadow: 'rgba(10, 35, 66, 0.04)',
};

export const Colors = {
  light: {
    ...BrandColors,
    text: '#111827',
    background: '#ffffff',
    tabIconDefault: '#9ca3af',
    tabIconSelected: '#0a2342',
  },
  dark: {
    ...BrandColors,
    text: '#111827',
    background: '#ffffff',
    surface: '#ffffff',
    glassBg: 'rgba(255, 255, 255, 0.85)',
    glassBorder: 'rgba(156, 163, 175, 0.2)',
    tabIconDefault: '#9ca3af',
    tabIconSelected: '#0a2342',
  }
};
