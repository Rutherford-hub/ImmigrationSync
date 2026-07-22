import React from 'react';
import { Redirect } from 'expo-router';
import { useApp } from '@/context/AppContext';

export default function EntryIndex() {
  const { user } = useApp();

  // If user session is active, route to Dashboard tabs. Otherwise, go to login.
  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
