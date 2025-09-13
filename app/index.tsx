import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Image } from '@/components/ui/image';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl } from 'react-native';

// The Card is a custom component you can build for reusability
const AnimeCard = ({ title, imageUri }: { title: string; imageUri: string }) => {
    return (
        <Box className="w-40 m-2 rounded-lg">
            <Box className="overflow-hidden rounded-lg">
                <Image
                    className="w-full h-48"
                    alt={title}
                    source={{ uri: imageUri }}
                />
                <Box className="p-3 rounded-b-lg bg-primary-500">
                    <Text className="font-bold text-white text-md">
                        {title}
                    </Text>
                </Box>
            </Box>
        </Box>
    );
};

const WaifuList = () => {
    const [waifus, setWaifus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<{ message: string } | null>(null);

    const fetchWaifus = useCallback(() => {
        fetch('https://placewaifu.com/images')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Shuffle the array to get a new random order on refresh
                const shuffledData = data.sort(() => 0.5 - Math.random()).slice(0, 10);
                setWaifus(shuffledData);
            })
            .catch(error => {
                setError(error);
            })
            .finally(() => {
                setLoading(false);
                setRefreshing(false);
            });
    }, []);

    useEffect(() => {
        fetchWaifus();
    }, [fetchWaifus]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchWaifus();
    }, [fetchWaifus]);

    if (loading) {
        return <Text className="py-4 text-center text-white">Loading...</Text>;
    }

    if (error) {
        return <Text className="py-4 text-center text-white">Error: {error.message}</Text>;
    }

    return (
        <Box className="flex-1 py-4 bg-background-dark-950">
            <Heading className="px-4 mb-4 text-2xl text-black">
                Waifus
            </Heading>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
                }
            >
                <HStack space="md" reversed={false}>
                    <Box className="flex-row flex-wrap justify-center">
                        {waifus.map((waifu: any) => (
                            <AnimeCard
                                key={waifu.name}
                                title={waifu.name}
                                imageUri={`data:image/${waifu.format};base64,${waifu.data}`}
                            />
                        ))}
                    </Box>
                </HStack>
            </ScrollView>
        </Box>
    );
};

export default function Index() {
    return (
        <Box className="flex-1 bg-background-dark-950">
            <WaifuList />
        </Box>
    );
}
