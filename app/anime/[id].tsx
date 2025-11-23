import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Image } from '@/components/ui/image';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

interface Anime {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  synopsis: string;
  trailer: {
    youtube_id: string | null;
    embed_url: string | null;
  };
}

const AnimeDetails = () => {
  const { id } = useLocalSearchParams();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

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
    <ScrollView className="flex-1 bg-background-0">
      <Stack.Screen options={{ title: anime?.title }} />
      {anime && (
        <Box className="p-4">
          <Heading className="mb-4 text-2xl text-white">{anime.title}</Heading>
          <Image
            source={{ uri: anime.images.jpg.image_url }}
            alt={anime.title}
            className="w-full mt-4 rounded-lg aspect-[2/3]"
          />
          <Text className="mt-4 text-white">{anime.synopsis}</Text>
          {videoId && (
            <Box className="mt-4">
              <Heading className="mb-2 text-xl text-white">Trailer</Heading>
              <YoutubePlayer
                height={220}
                play={false}
                videoId={videoId}
              />
            </Box>
          )}
        </Box>
      )}
    </ScrollView>
  );
};

export default AnimeDetails;
