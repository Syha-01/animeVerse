import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/contexts/AuthContext';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';

export default function LoginScreen() {
    const { login, error, clearError, loading } = useAuth();
    const params = useLocalSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            await login(email, password);
            // After successful login, go back to the previous page
            // This removes the login screen from history
            if (params.returning_to) {
                // Use back() to naturally return to where user came from
                router.back();
            } else {
                // If no return path, go to home
                router.replace('/(tabs)');
            }
        } catch (err: any) {
            Alert.alert('Login Failed', err.message || 'Invalid credentials');
        }
    };

    const goToRegister = () => {
        router.push({
            pathname: '/auth/register',
            params: { returning_to: params.returning_to },
        });
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <Box className="flex-1 px-6 pt-12 bg-background-0">
                <Box className="flex-1 justify-center">
                    <Heading className="mb-2 text-4xl font-bold text-center text-white">
                        Welcome Back
                    </Heading>
                    <Text className="mb-8 text-center text-gray-400">
                        Sign in to save your favorite anime
                    </Text>

                    <Box className="mb-4">
                        <Text className="mb-2 text-sm text-gray-300">Email</Text>
                        <Input className="border-gray-700 bg-gray-800" size="lg">
                            <InputField
                                placeholder="your@email.com"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                className="text-white"
                                placeholderTextColor="#9ca3af"
                            />
                        </Input>
                    </Box>

                    <Box className="mb-6">
                        <Text className="mb-2 text-sm text-gray-300">Password</Text>
                        <Input className="border-gray-700 bg-gray-800" size="lg">
                            <InputField
                                placeholder="Enter your password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                className="text-white"
                                placeholderTextColor="#9ca3af"
                            />
                        </Input>
                    </Box>

                    {error && (
                        <Box className="p-3 mb-4 rounded-lg bg-red-900/30">
                            <Text className="text-sm text-red-400">{error}</Text>
                        </Box>
                    )}

                    <TouchableOpacity
                        onPress={handleLogin}
                        disabled={loading}
                        className="p-4 mb-4 rounded-lg bg-primary-500"
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text className="font-semibold text-center text-white">Sign In</Text>
                        )}
                    </TouchableOpacity>

                    <Box className="flex-row items-center justify-center">
                        <Text className="text-gray-400">Don't have an account? </Text>
                        <TouchableOpacity onPress={goToRegister}>
                            <Text className="font-semibold text-primary-500">Sign Up</Text>
                        </TouchableOpacity>
                    </Box>
                </Box>
            </Box>
        </KeyboardAvoidingView>
    );
}
