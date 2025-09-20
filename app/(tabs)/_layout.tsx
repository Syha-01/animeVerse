import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from "expo-router";

import '@/global.css';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: 'rgb(18, 18, 18)', // background-dark-950
          borderTopColor: 'rgb(65, 65, 65)', // outline-800
          borderTopWidth: 1,
          paddingTop: 8, // pt-2
          paddingBottom: 8, // pb-2
          height: 88, // Increased height for padding
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
