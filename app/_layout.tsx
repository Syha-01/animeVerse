import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View } from 'react-native';

import '@/global.css';

export default function RootLayout() {
  return (
    <GluestackUIProvider>
      <SafeAreaProvider>
        <View style={{ paddingTop: 40, flex: 1, backgroundColor: 'rgb(18,18,18)' }}>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="(tabs)" />
          </Stack>
        </View>
      </SafeAreaProvider>
    </GluestackUIProvider>
  )
}
