import { Tabs } from "expo-router";

import '@/global.css';

export default function TabsLayout() {
  return (
  <Tabs>
    <Tabs.Screen name="index" options={{ title: "Home"}} />
    <Tabs.Screen name="Saved" options={{ title: "Saved"}} />
  </Tabs>
)
}
