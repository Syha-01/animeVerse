import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Image } from '@/components/ui/image';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import React, { useEffect, useState } from 'react';
// Import Linking to open external URLs and TouchableOpacity for a pressable component
import { ActivityIndicator, Linking, TouchableOpacity } from 'react-native';

import EvilIcons from '@expo/vector-icons/EvilIcons';
import Feather from '@expo/vector-icons/Feather';

// Defines the TypeScript interface for an Anime object based on the Jikan API response.
// This interface is updated to include the trailer information.
interface Anime {
    mal_id: number;
    title: string;
    images: {
        jpg: {
            image_url: string;
        };
    };
    // Add the trailer property to the interface
    trailer: {
        url: string | null; // The trailer URL can sometimes be null
    };
    score: number;
}

export default function Index() {
    // State variables with TypeScript types
    const [anime, setAnime] = useState<Anime[]>([]);
    const [randomAnime, setRandomAnime] = useState<Anime[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [randomAnimeLoading, setRandomAnimeLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    // Function to fetch the top 10 anime
    const fetchAnime = async () => {
        try {
            // Add the &limit=10 parameter to the URL
            const response = await fetch('https://api.jikan.moe/v4/top/anime?filter=bypopularity');
            if (!response.ok) {
                throw new Error('Failed to fetch data from the API');
            }
            const data = await response.json();
            setAnime(data.data);
        } catch (error: any) {
            setError(error);
        }
    };

    // Function to fetch 10 random anime
    const fetchRandomAnime = async () => {
        setRandomAnimeLoading(true);
        try {
            const animePromises = Array.from({ length: 10 }, () =>
                fetch('https://api.jikan.moe/v4/random/anime').then(res => res.json())
            );
            const randomAnimeData = await Promise.all(animePromises);
            setRandomAnime(randomAnimeData.map((item: any) => item.data));
        } catch (error: any) {
            setError(error);
        } finally {
            setRandomAnimeLoading(false);
        }
    };

    // useEffect to fetch data when the component mounts
    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            await Promise.all([fetchAnime(), fetchRandomAnime()]);
            setLoading(false);
        };
        fetchAllData();
    }, []);

    // Display a loading indicator while fetching data
    if (loading) {
        return (
            <Box className="items-center justify-center flex-1 bg-background-0">
                <ActivityIndicator size="large" color="#ffffff" />
            </Box>
        );
    }

    // Display an error message if the fetch fails
    if (error) {
        return (
            <Box className="items-center justify-center flex-1 p-4 bg-background-0">
                <Text className="text-center text-white">Error: {error.message}</Text>
            </Box>
        );
    }

    // Render the horizontal list of anime cards
    return (
        <ScrollView className="flex-1 bg-background-0">
            <Box className="py-6">
                <Heading className="px-4 mb-4 text-2xl text-white">Top Anime</Heading>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} className="pl-4">
                    {anime.map((item) => (
                        <Box key={item.mal_id} className="items-center w-40 mr-4">
                            <Image
                                source={{ uri: item.images.jpg.image_url }}
                                alt={item.title}
                                className="w-40 h-56 rounded-lg"
                            />
                            <Text className="h-10 mt-2 text-center text-white" numberOfLines={2}>
                                {item.title}
                            </Text>

                            {/* Check if a trailer URL exists before rendering the link */}
                            {item.trailer?.url && (
                                <TouchableOpacity onPress={() => Linking.openURL(item.trailer.url!)}>
                                    <Text className="mt-1 text-center text-blue-400 underline">
                                        View Trailer
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </Box>
                    ))}
                </ScrollView>
            </Box>
            <Box className="py-6">
                <Box className="flex-row items-center justify-between px-4 mb-4">
                    <Heading className="text-2xl text-white">Random Anime</Heading>
                    <TouchableOpacity onPress={fetchRandomAnime}>
                        <EvilIcons name="refresh" size={30} color="white" />
                    </TouchableOpacity>
                </Box>
                {randomAnimeLoading ? (
                    <Box className="items-center justify-center flex-1 bg-background-0">
                <ActivityIndicator size="large" color="#ffffff" />
            </Box>
                ) : (
                    <Box className="px-4">
                        {randomAnime.map((item) => (
                            <Box key={item.mal_id} className="flex-row items-center mb-4">
                                <Image
                                    source={{ uri: item.images.jpg.image_url }}
                                    alt={item.title}
                                    className="w-20 rounded-lg h-28"
                                />
                                <Text className="flex-1 ml-4 text-white" numberOfLines={2}>
                                    {item.title}
                                </Text>
                                <Box className="flex-row items-center mr-4">
                                    {item.score ? (
                                        <>
                                            <Feather name="star" size={16} color="yellow" />
                                            <Text className="ml-1 text-white">{item.score}</Text>
                                        </>
                                    ) : (
                                        <Text className="text-white">N/A</Text>
                                    )}
                                </Box>
                            </Box>
                        ))}
                        <Box className='h-24' />
                    </Box>
                )}
            </Box>
        </ScrollView>
    );
}
