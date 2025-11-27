import { Button, ButtonText } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { apiClient } from '@/utils/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function ActivateScreen() {
    const { token } = useLocalSearchParams<{ token: string }>();
    const router = useRouter();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Activating your account...');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Invalid activation link.');
            return;
        }

        const activate = async () => {
            try {
                await apiClient.activateUser(token);
                setStatus('success');
                setMessage('Account Activated Successfully!');
            } catch (err: any) {
                setStatus('error');
                setMessage(err.message || 'Failed to activate account.');
            }
        };

        activate();
    }, [token]);

    return (
        <View className="flex-1 bg-background-0 p-4">
            <Center className="flex-1">
                {status === 'loading' && (
                    <>
                        <ActivityIndicator size="large" color="#007bff" />
                        <Text className="mt-4 text-typography-500">{message}</Text>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <Heading className="text-typography-900 mb-2">Success!</Heading>
                        <Text className="text-typography-500 mb-6 text-center">{message}</Text>
                        <Button
                            size="md"
                            variant="solid"
                            action="primary"
                            onPress={() => router.replace('/auth/login')}
                        >
                            <ButtonText>Go to Login</ButtonText>
                        </Button>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <Heading className="text-error-500 mb-2">Error</Heading>
                        <Text className="text-typography-500 mb-6 text-center">{message}</Text>
                        <Button
                            size="md"
                            variant="outline"
                            action="secondary"
                            onPress={() => router.replace('/auth/login')}
                        >
                            <ButtonText>Go to Login</ButtonText>
                        </Button>
                    </>
                )}
            </Center>
        </View>
    );
}
