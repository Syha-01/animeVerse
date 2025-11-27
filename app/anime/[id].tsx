import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Image } from '@/components/ui/image';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/utils/api';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, TouchableOpacity } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import SaveAnimeModal from '../../components/SaveAnimeModal';

const { width, height } = Dimensions.get('window');

interface Anime {
  mal_id: number;
  title: string;
  title_english?: string;
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
    mal_id: number;
    name: string;
  }[];
  studios: {
    mal_id: number;
    name: string;
  }[];
  score: number;
  scored_by: number;
  episodes: number | null;
  status: string;
  aired: {
    from: string | null;
  };
  rating: string;
  broadcast: {
    string: string;
  } | null;
}

interface Episode {
  mal_id: number;
  title: string;
  url: string | null;
}

const AnimeDetails = () => {
  const { id } = useLocalSearchParams();
  const { isAuthenticated, token, user } = useAuth();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        const [animeResponse, episodesResponse] = await Promise.all([
          fetch(`https://api.jikan.moe/v4/anime/${id}`),
          fetch(`https://api.jikan.moe/v4/anime/${id}/episodes`),
        ]);

        if (!animeResponse.ok || !episodesResponse.ok) {
          throw new Error('Failed to fetch data from the API');
        }

        const animeData = await animeResponse.json();
        const episodesData = await episodesResponse.json();

        setAnime(animeData.data);
        setEpisodes(episodesData.data);
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

  const handleSaveAnime = () => {
    if (!isAuthenticated || !token || !user) {
      router.push({
        pathname: '/auth/login',
        params: { returning_to: `/anime/${id}` },
      });
      return;
    }
    setShowSaveModal(true);
  };

  const handleSaveToList = async (formData: any) => {
    if (!anime || !user || !token) return;

    setIsSaving(true);
    try {
      const animeData = {
        user_id: user.id,
        anime_id: anime.mal_id,
        status: formData.status,
        current_episode: formData.current_episode,
        score: formData.score,
        started_watching_date: formData.started_watching_date,
        finished_watching_date: formData.finished_watching_date,
        anime: {
          title: anime.title,
          synopsis: anime.synopsis || '',
          cover_image_url: anime.images.jpg.large_image_url || anime.images.jpg.image_url,
          total_episodes: anime.episodes || 0,
          status: anime.status || 'Unknown',
          release_date: anime.aired?.from ? anime.aired.from.split('T')[0] : new Date().toISOString().split('T')[0],
          rating: anime.rating || 'Not Rated',
          score: anime.score || 0,
          genres: anime.genres.map((g) => g.name),
          studios: anime.studios?.map((s) => s.name) || [],
          broadcast_information: anime.broadcast?.string || '',
        },
      };

      await apiClient.saveAnimeToList(token, user.id, animeData);
      Alert.alert('Success', 'Anime added to your list!');
      setShowSaveModal(false);
    } catch (err: any) {
      console.error('Save error:', err);
      Alert.alert('Error', err.message || 'Failed to save anime');
    } finally {
      setIsSaving(false);
    }
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
  const episodeBoxWidth = (width - 32 - 32) / 5; // Screen width - padding (16*2) - gaps (approx) / 5

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

          {/* Floating Save Button */}
          <Box className="absolute bottom-4 right-4">
            <TouchableOpacity
              onPress={handleSaveAnime}
              disabled={isSaving}
              className="flex-row items-center px-6 py-3 rounded-full shadow-lg"
              style={{
                backgroundColor: '#38e07b',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <MaterialIcons name="bookmark-add" size={24} color="white" />
                  <Text className="ml-2 font-bold text-white">
                    {isAuthenticated ? 'Save' : 'Login to Save'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </Box>

          <Box className="px-4 mt-4">
            <Text className="text-base leading-6 text-gray-300">
              {isExpanded ? anime.synopsis : `${anime.synopsis?.slice(0, 150)}...`}
            </Text>
            <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} className="mt-2">
              <Text className="font-bold" style={{ color: '#38e07b' }}>{isExpanded ? 'Read Less' : 'Read More'}</Text>
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

            {episodes.length > 0 && (
              <Box className="mt-8">
                <Heading className="mb-4 text-xl text-white">Episodes</Heading>
                <Box className="flex-row flex-wrap gap-2">
                  {episodes.map((episode) => (
                    <Box
                      key={episode.mal_id}
                      className="items-center justify-center bg-gray-800 rounded-lg aspect-square"
                      style={{ width: episodeBoxWidth }}
                    >
                      <Text className="font-bold text-white">{episode.mal_id}</Text>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </>
      )}

      {/* Save Anime Modal */}
      <SaveAnimeModal
        visible={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveToList}
        animeTitle={anime?.title || ''}
        totalEpisodes={anime?.episodes || undefined}
      />
    </ScrollView>
  );
};

export default AnimeDetails;
