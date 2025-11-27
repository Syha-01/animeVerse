import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/contexts/AuthContext';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { Alert, Platform, Pressable, ScrollView } from 'react-native';

export default function SettingsScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    // On web, Alert.alert doesn't work properly with async onPress
    // So we handle logout directly without the confirmation dialog
    if (Platform.OS === 'web') {
      try {
        console.log('Logout button pressed (web), calling logout...');
        await logout();
        console.log('Logout completed (web), navigating to home...');
        router.replace('/(tabs)');
        console.log('Navigation called (web)');
      } catch (error) {
        console.error('Logout error (web):', error);
        Alert.alert('Error', 'Failed to logout. Please try again.');
      }
    } else {
      // On native platforms, show confirmation dialog
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Logout',
            style: 'destructive',
            onPress: async () => {
              try {
                console.log('Logout button pressed, calling logout...');
                await logout();
                console.log('Logout completed, navigating to home...');
                router.replace('/(tabs)');
                console.log('Navigation called');
              } catch (error) {
                console.error('Logout error:', error);
                Alert.alert('Error', 'Failed to logout. Please try again.');
              }
            },
          },
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <ScrollView className="flex-1 bg-background-0">
      <Box className="px-4 py-6">
        {/* Header */}
        <Heading className="mb-6 text-3xl text-white">Settings</Heading>

        {/* User Profile Section */}
        <Box className="p-4 mb-6 rounded-lg bg-gray-800">
          <Box className="flex-row items-center mb-4">
            <Box className="items-center justify-center w-16 h-16 mr-4 rounded-full bg-blue-500">
              <Feather name="user" size={32} color="white" />
            </Box>
            <Box className="flex-1">
              <Text className="text-xl font-bold text-white">{user?.username}</Text>
              <Text className="text-sm text-gray-400">{user?.email}</Text>
            </Box>
          </Box>

          {/* User Details */}
          <Box className="pt-4 mt-4 border-t border-gray-700">
            <Box className="flex-row items-center mb-3">
              <MaterialIcons name="verified" size={20} color={user?.activated ? '#10b981' : '#6b7280'} />
              <Text className="ml-2 text-white">
                Account Status:{' '}
                <Text className={user?.activated ? 'text-green-500' : 'text-gray-400'}>
                  {user?.activated ? 'Activated' : 'Pending Activation'}
                </Text>
              </Text>
            </Box>
            <Box className="flex-row items-center">
              <Feather name="calendar" size={20} color="#9ca3af" />
              <Text className="ml-2 text-gray-400">
                Joined: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </Text>
            </Box>
          </Box>
        </Box>

        {/* Logout Button */}
        <Pressable
          onPress={handleLogout}
          className="flex-row items-center justify-center p-4 rounded-lg bg-red-600 active:bg-red-700"
        >
          <MaterialIcons name="logout" size={24} color="white" />
          <Text className="ml-2 text-lg font-semibold text-white">Logout</Text>
        </Pressable>

        {/* App Info Section */}
        <Box className="p-4 mt-6 rounded-lg bg-gray-800">
          <Text className="mb-2 text-sm font-semibold text-gray-400">APP INFORMATION</Text>
          <Box className="pt-2 border-t border-gray-700">
            <Text className="text-white">AnimeVerse</Text>
            <Text className="text-sm text-gray-400">Version 1.0.0</Text>
          </Box>
        </Box>
      </Box>
    </ScrollView>
  );
}