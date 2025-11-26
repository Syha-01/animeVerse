import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/contexts/AuthContext';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';

export default function RegisterScreen() {
    const { register, error, loading } = useAuth();
    const params = useLocalSearchParams();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        if (!username || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password.length < 8) {
            Alert.alert('Error', 'Password must be at least 8 characters');
            return;
        }

        try {
            await register(username, email, password);
            Alert.alert(
                'Registration Successful',
                'Please check your email to activate your account. After activation, you can log in.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            router.push({
                                pathname: '/auth/login',
                                params: { returning_to: params.returning_to },
                            });
                        },
                    },
                ]
            );
        } catch (err: any) {
            Alert.alert('Registration Failed', err.message || 'An error occurred');
        }
    };

    const goToLogin = () => {
        router.push({
            pathname: '/auth/login',
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
                        Create Account
                    </Heading>
                    <Text className="mb-8 text-center text-gray-400">
                        Join to start tracking your anime
                    </Text>

                    <Box className="mb-4">
                        <Text className="mb-2 text-sm text-gray-300">Username</Text>
                        <Input className="border-gray-700 bg-gray-800" size="lg">
                            <InputField
                                placeholder="Your username"
                                value={username}
                                onChangeText={setUsername}
                                autoCapitalize="none"
                                className="text-white"
                                placeholderTextColor="#9ca3af"
                            />
                        </Input>
                    </Box>

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
                                placeholder="At least 8 characters"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                className="text-white"
                                placeholderTextColor="#9ca3af"
                            />
                        </Input>
                        <Text className="mt-1 text-xs text-gray-500">
                            Minimum 8 characters
                        </Text>
                    </Box>

                    {error && (
                        <Box className="p-3 mb-4 rounded-lg bg-red-900/30">
                            <Text className="text-sm text-red-400">{error}</Text>
                        </Box>
                    )}

                    <TouchableOpacity
                        onPress={handleRegister}
                        disabled={loading}
                        className="p-4 mb-4 rounded-lg bg-primary-500"
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text className="font-semibold text-center text-white">Create Account</Text>
                        )}
                    </TouchableOpacity>

                    <Box className="flex-row items-center justify-center">
                        <Text className="text-gray-400">Already have an account? </Text>
                        <TouchableOpacity onPress={goToLogin}>
                            <Text className="font-semibold text-primary-500">Sign In</Text>
                        </TouchableOpacity>
                    </Box>
                </Box>
            </Box>
        </KeyboardAvoidingView>
    );
}
