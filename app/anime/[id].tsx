import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Image } from '@/components/ui/image';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

const { width, height } = Dimensions.get('window');

interface Anime {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
      large_image_url: string;
    };
  };
  synopsis: string;
  trailer: {
    youtube_id: string | null;
    embed_url: string | null;
  };
  genres: {
    name: string;
  }[];
  score: number;
  scored_by: number;
}

const AnimeDetails = () => {
  const { id } = useLocalSearchParams();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
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

    fetchAnimeDetails();
  }, [id]);

  const getVideoId = (trailer: Anime['trailer']) => {
    if (trailer.youtube_id) return trailer.youtube_id;
    if (trailer.embed_url) {
      const match = trailer.embed_url.match(/\/embed\/([^?]+)/);
      return match ? match[1] : null;
    }
    return null;
  };

  if (loading) {
    return (
      <Box className="items-center justify-center flex-1 bg-background-0">
        <ActivityIndicator size="large" color="#ffffff" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="items-center justify-center flex-1 p-4 bg-background-0">
        <Text className="text-center text-white">Error: {error.message}</Text>
      </Box>
    );
  }

  const videoId = anime?.trailer ? getVideoId(anime.trailer) : null;

  return (
    <ScrollView className="flex-1 bg-[#0b0b0b]" contentContainerStyle={{ paddingBottom: 40 }}>
      <Stack.Screen options={{ headerShown: false }} />
      {anime && (
        <>
          <Box className="relative w-full h-[450px]">
            <Image
              source={{ uri: anime.images.jpg.large_image_url || anime.images.jpg.image_url }}
              alt={anime.title}
              className="w-full h-full"
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', '#0b0b0b']}
              style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300 }}
            />
            <Box className="absolute bottom-0 w-full px-4 pb-4">
              <Heading className="mb-2 text-4xl font-bold text-white shadow-lg">{anime.title}</Heading>
              <Box className="flex-row flex-wrap gap-2 mt-2">
                {anime.genres.map((genre, index) => (
                  <Box key={index} className="px-3 py-1 rounded-full bg-background-800/80">
                    <Text className="text-xs font-medium text-black">{genre.name}</Text>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          <Box className="px-4 mt-4">
            <Text className="text-base leading-6 text-gray-300">
              {isExpanded ? anime.synopsis : `${anime.synopsis?.slice(0, 150)}...`}
            </Text>
            <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} className="mt-2">
              <Text className="font-bold text-primary-500">{isExpanded ? 'Read Less' : 'Read More'}</Text>
            </TouchableOpacity>

            <Box className="mt-6">
              <Heading className="mb-4 text-2xl text-white">User Ratings</Heading>
              <Box className="flex-row items-end">
                <Text className="text-6xl font-bold text-white">{anime.score}</Text>
                <Box className="mb-2 ml-4">
                  <Text className="text-gray-400">{anime.scored_by?.toLocaleString()} reviews</Text>
                </Box>
              </Box>
            </Box>

            {videoId && (
              <Box className="mt-8">
                <Heading className="mb-4 text-xl text-white">Trailer</Heading>
                <Box className="overflow-hidden rounded-xl">
                  <YoutubePlayer
                    height={220}
                    play={false}
                    videoId={videoId}
                  />
                </Box>
              </Box>
            )}
          </Box>
        </>
      )}
    </ScrollView>
  );
};

export default AnimeDetails;
