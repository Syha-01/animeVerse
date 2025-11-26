import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { AuthProvider } from '@/contexts/AuthContext';
import { Stack } from "expo-router";
import { View } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";

import '@/global.css';

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="dark">
      <AuthProvider>
        <SafeAreaProvider>
          <View style={{ paddingTop: 40, flex: 1, backgroundColor: 'rgb(18,18,18)' }}>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="auth" />
            </Stack>
          </View>
        </SafeAreaProvider>
      </AuthProvider>
    </GluestackUIProvider>
  )
}
