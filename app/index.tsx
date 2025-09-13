import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Image } from '@/components/ui/image';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import React, { useEffect, useState } from 'react';
// Import Linking to open external URLs and TouchableOpacity for a pressable component
import { ActivityIndicator, Linking, TouchableOpacity } from 'react-native';

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
}

export default function Index() {
    // State variables with TypeScript types
    const [anime, setAnime] = useState<Anime[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    // Function to fetch the top 10 anime
    const fetchAnime = async () => {
        setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    // useEffect to fetch data when the component mounts
    useEffect(() => {
        fetchAnime();
    }, []);

    // Display a loading indicator while fetching data
    if (loading) {
        return (
            <Box className="flex-1 justify-center items-center bg-background-dark-950">
                <ActivityIndicator size="large" color="#ffffff" />
            </Box>
        );
    }

    // Display an error message if the fetch fails
    if (error) {
        return (
            <Box className="flex-1 justify-center items-center bg-background-dark-950 p-4">
                <Text className="text-black text-center">Error: {error.message}</Text>
            </Box>
        );
    }

    // Render the horizontal list of anime cards
    return (
        <Box className="flex-1 bg-background-dark-950 py-6">
            <Heading className="text-black text-2xl mb-4 px-4">Top Anime</Heading>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} className="pl-4">
                {anime.map((item) => (
                    <Box key={item.mal_id} className="w-40 mr-4 items-center">
                        <Image
                            source={{ uri: item.images.jpg.image_url }}
                            alt={item.title}
                            className="w-40 h-56 rounded-lg"
                        />
                        <Text className="text-black text-center mt-2 h-10" numberOfLines={2}>
                            {item.title}
                        </Text>

                        {/* Check if a trailer URL exists before rendering the link */}
                        {item.trailer?.url && (
                            <TouchableOpacity onPress={() => Linking.openURL(item.trailer.url!)}>
                                <Text className="text-blue-400 text-center mt-1 underline">
                                    View Trailer
                                </Text>
                            </TouchableOpacity>
                        )}
                    </Box>
                ))}
            </ScrollView>
        </Box>
    );
}