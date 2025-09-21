import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from "expo-router";
import { BlurView } from 'expo-blur';

import '@/global.css';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarBackground: () => (
          <BlurView
            tint="dark"
            intensity={100}
            style={{
              flex: 1,
              backgroundColor: 'rgba(18, 18, 18, 0.8)',
            }}
          />
        ),
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopColor: 'rgba(255, 255, 255, 0.1)',
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 24,
          height: 88,
          position: 'absolute',
        },
        tabBarActiveTintColor: '#38e07b', // primary-500
        tabBarInactiveTintColor: 'rgb(140, 140, 140)', // typography-400
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <MaterialIcons name="movie" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ color }) => <MaterialIcons name="bookmark" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Updates"
        options={{
          title: "Updates",
          tabBarIcon: ({ color }) => <MaterialIcons name="notifications" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <MaterialIcons name="settings" size={24} color={color} />,
        }}
      />
    </Tabs>
  )
}
