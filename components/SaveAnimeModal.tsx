import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    TouchableOpacity
} from 'react-native';

interface SaveAnimeModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (data: SaveAnimeData) => Promise<void>;
    animeTitle: string;
    totalEpisodes?: number;
    mode?: 'save' | 'edit';
    initialData?: Partial<SaveAnimeData & { started_watching_date: string | null; finished_watching_date: string | null }>;
}

export interface SaveAnimeData {
    status: 'Watching' | 'Completed' | 'Dropped' | 'Watch later';
    current_episode: number;
    score?: number;
    started_watching_date?: string;
    finished_watching_date?: string;
}

const STATUS_OPTIONS = ['Watching', 'Completed', 'Dropped', 'Watch later'] as const;

export default function SaveAnimeModal({
    visible,
    onClose,
    onSave,
    animeTitle,
    totalEpisodes,
    mode = 'save',
    initialData,
}: SaveAnimeModalProps) {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    const [status, setStatus] = useState<SaveAnimeData['status']>(initialData?.status || 'Watch later');
    const [currentEpisode, setCurrentEpisode] = useState(initialData?.current_episode?.toString() || '0');
    const [score, setScore] = useState<number | undefined>(initialData?.score);
    const [startDate, setStartDate] = useState(
        initialData?.started_watching_date && initialData.started_watching_date !== '0001-01-01'
            ? initialData.started_watching_date
            : mode === 'save' ? today : ''
    );
    const [finishDate, setFinishDate] = useState(
        initialData?.finished_watching_date && initialData.finished_watching_date !== '0001-01-01'
            ? initialData.finished_watching_date
            : ''
    );
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        // Validate inputs
        const episodeNum = parseInt(currentEpisode);
        if (isNaN(episodeNum) || episodeNum < 0) {
            Alert.alert('Invalid Input', 'Please enter a valid episode number');
            return;
        }

        if (totalEpisodes && episodeNum > totalEpisodes) {
            Alert.alert(
                'Invalid Input',
                `Episode cannot exceed ${totalEpisodes} (total episodes)`
            );
            return;
        }

        if (score !== undefined && (score < 1 || score > 10)) {
            Alert.alert('Invalid Input', 'Score must be between 1 and 10');
            return;
        }

        setIsSaving(true);
        try {
            await onSave({
                status,
                current_episode: episodeNum,
                score,
                started_watching_date: startDate || undefined,
                finished_watching_date: finishDate || undefined,
            });
            onClose();
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to save anime');
        } finally {
            setIsSaving(false);
        }
    };

    const handleScoreChange = (value: string) => {
        if (value === '') {
            setScore(undefined);
            return;
        }
        const num = parseInt(value);
        if (!isNaN(num) && num >= 1 && num <= 10) {
            setScore(num);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <Box className="items-center justify-center flex-1 bg-black/80">
                <Box className="w-11/12 max-w-lg p-6 rounded-lg" style={{ backgroundColor: '#1a1a1a' }}>
                    <Heading className="mb-6 text-2xl font-bold text-white">
                        {mode === 'edit' ? 'Edit' : 'Save'} "{animeTitle}"
                    </Heading>

                    <ScrollView className="max-h-96">
                        {/* Status Selection */}
                        <Box className="mb-6">
                            <Text className="mb-3 text-sm font-semibold text-white">
                                Status *
                            </Text>
                            <Box className="flex-row flex-wrap gap-2">
                                {STATUS_OPTIONS.map((option) => (
                                    <TouchableOpacity
                                        key={option}
                                        onPress={() => setStatus(option)}
                                        className="px-4 py-2 rounded-full"
                                        style={status === option
                                            ? { backgroundColor: '#38e07b' }
                                            : { backgroundColor: '#2a2a2a', borderWidth: 1, borderColor: '#404040' }
                                        }
                                    >
                                        <Text
                                            className={`${status === option
                                                ? 'text-black font-bold'
                                                : 'text-gray-400'
                                                }`}
                                        >
                                            {option}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </Box>
                        </Box>

                        {/* Current Episode */}
                        <Box className="mb-6">
                            <Text className="mb-3 text-sm font-semibold text-white">
                                Current Episode {totalEpisodes ? `(of ${totalEpisodes})` : ''}
                            </Text>
                            <Input className="bg-[#2a2a2a] border-[#404040]" style={{ borderWidth: 1 }}>
                                <InputField
                                    placeholder="0"
                                    value={currentEpisode}
                                    onChangeText={setCurrentEpisode}
                                    keyboardType="numeric"
                                    className="text-white"
                                    placeholderTextColor="#9ca3af"
                                />
                            </Input>
                        </Box>

                        {/* Score */}
                        <Box className="mb-6">
                            <Text className="mb-3 text-sm font-semibold text-white">
                                Your Score (1-10)
                            </Text>
                            <Input className="bg-[#2a2a2a] border-[#404040]" style={{ borderWidth: 1 }}>
                                <InputField
                                    placeholder="Optional"
                                    value={score?.toString() || ''}
                                    onChangeText={handleScoreChange}
                                    keyboardType="numeric"
                                    className="text-white"
                                    placeholderTextColor="#9ca3af"
                                />
                            </Input>
                        </Box>

                        {/* Start Date */}
                        <Box className="mb-6">
                            <Text className="mb-3 text-sm font-semibold text-white">
                                Started Watching (YYYY-MM-DD)
                            </Text>
                            <Input className="bg-[#2a2a2a] border-[#404040]" style={{ borderWidth: 1 }}>
                                <InputField
                                    placeholder="Optional (e.g., 2025-11-26)"
                                    value={startDate}
                                    onChangeText={setStartDate}
                                    className="text-white"
                                    placeholderTextColor="#9ca3af"
                                />
                            </Input>
                        </Box>

                        {/* Finish Date */}
                        <Box className="mb-6">
                            <Text className="mb-3 text-sm font-semibold text-white">
                                Finished Watching (YYYY-MM-DD)
                            </Text>
                            <Input className="bg-[#2a2a2a] border-[#404040]" style={{ borderWidth: 1 }}>
                                <InputField
                                    placeholder="Optional (e.g., 2025-11-26)"
                                    value={finishDate}
                                    onChangeText={setFinishDate}
                                    className="text-white"
                                    placeholderTextColor="#9ca3af"
                                />
                            </Input>
                        </Box>
                    </ScrollView>

                    {/* Buttons */}
                    <Box className="flex-row gap-3 mt-6">
                        <TouchableOpacity
                            onPress={onClose}
                            disabled={isSaving}
                            className="flex-1 p-4 rounded-lg"
                            style={{ backgroundColor: '#2a2a2a', borderWidth: 1, borderColor: '#404040' }}
                        >
                            <Text className="font-semibold text-center text-white">
                                Cancel
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleSave}
                            disabled={isSaving}
                            className="flex-1 p-4 rounded-lg"
                            style={{ backgroundColor: '#38e07b', borderWidth: 2, borderColor: '#38e07b' }}
                        >
                            {isSaving ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text className="font-bold text-center text-black">
                                    {mode === 'edit' ? 'Update' : 'Save to List'}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}
