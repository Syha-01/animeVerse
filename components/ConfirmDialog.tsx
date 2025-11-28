import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import React from 'react';
import { Modal, TouchableOpacity } from 'react-native';

interface ConfirmDialogProps {
    visible: boolean;
    title: string;
    message: string;
    onCancel: () => void;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
}

export default function ConfirmDialog({
    visible,
    title,
    message,
    onCancel,
    onConfirm,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
}: ConfirmDialogProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <Box className="items-center justify-center flex-1 bg-black/80">
                <Box className="w-11/12 max-w-md p-6 rounded-lg" style={{ backgroundColor: '#1a1a1a' }}>
                    <Heading className="mb-4 text-xl font-bold text-white">
                        {title}
                    </Heading>

                    <Text className="mb-6 text-gray-300">
                        {message}
                    </Text>

                    {/* Buttons */}
                    <Box className="flex-row gap-3">
                        <TouchableOpacity
                            onPress={onCancel}
                            className="flex-1 p-4 rounded-lg"
                            style={{ backgroundColor: '#2a2a2a', borderWidth: 1, borderColor: '#404040' }}
                        >
                            <Text className="font-semibold text-center text-white">
                                {cancelText}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={onConfirm}
                            className="flex-1 p-4 rounded-lg"
                            style={{ backgroundColor: '#ef4444', borderWidth: 2, borderColor: '#ef4444' }}
                        >
                            <Text className="font-bold text-center text-white">
                                {confirmText}
                            </Text>
                        </TouchableOpacity>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}
