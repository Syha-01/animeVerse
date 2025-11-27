import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Image } from '@/components/ui/image';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/utils/api';
import { Link, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, TouchableOpacity } from 'react-native';

interface SavedAnime {
  id: string;
  anime_id: number;
  status: string;
  current_episode: number;
  score: number | null;
  started_watching_date: string | null;
  anime: {
    id: number;
    title: string;
    cover_image_url: string;
    total_episodes: number;
    score: number;
    genres: string[];
  };
}

export default function SavedScreen() {
  const { isAuthenticated, token, user } = useAuth();
  const [savedAnime, setSavedAnime] = useState<SavedAnime[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSavedAnime = async () => {
    if (!isAuthenticated || !token || !user) {
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.getUserAnimeList(token, user.id);
      setSavedAnime(response.user_anime_lists || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching saved anime:', err);
      setError(err.message || 'Failed to load saved anime');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSavedAnime();
  }, [isAuthenticated, token, user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSavedAnime();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Watching':
        return 'bg-green-600';
      case 'Completed':
        return 'bg-blue-600';
      case 'Dropped':
        return 'bg-red-600';
      case 'Watch later':
        return 'bg-yellow-600';
      default:
        return 'bg-gray-600';
    }
  };

  if (!isAuthenticated) {
    return (
      <Box className="items-center justify-center flex-1 px-6 bg-background-0">
        <Heading className="mb-4 text-2xl text-center text-white">
          Login to View Your List
        </Heading>
        <Text className="mb-6 text-center text-gray-400">
          Sign in to see your saved anime and track your progress
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/auth/login')}
          className="px-8 py-3 rounded-full bg-primary-500"
        >
          <Text className="font-bold text-white">Login</Text>
        </TouchableOpacity>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box className="items-center justify-center flex-1 bg-background-0">
        <ActivityIndicator size="large" color="#38e07b" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="items-center justify-center flex-1 px-6 bg-background-0">
        <Text className="mb-4 text-center text-red-400">{error}</Text>
        <TouchableOpacity onPress={fetchSavedAnime} className="px-6 py-3 rounded-lg bg-primary-500">
          <Text className="font-semibold text-white">Retry</Text>
        </TouchableOpacity>
      </Box>
    );
  }

  if (savedAnime.length === 0) {
    return (
      <ScrollView
        className="flex-1 bg-background-0"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#38e07b" />
        }
      >
        <Box className="items-center justify-center flex-1 px-6 py-20">
          <Heading className="mb-4 text-2xl text-center text-white">
            No Saved Anime Yet
          </Heading>
          <Text className="mb-6 text-center text-gray-400">
            Start adding anime to your list to track what you're watching
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)')}
            className="px-8 py-3 rounded-full bg-primary-500"
          >
            <Text className="font-bold text-white">Browse Anime</Text>
          </TouchableOpacity>
        </Box>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background-0"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#38e07b" />
      }
    >
      <Box className="px-4 py-6">
        <Heading className="mb-6 text-3xl text-white">My Anime List</Heading>

        <Box className="space-y-4">
          {savedAnime.map((item) => (
            <Link href={`/anime/${item.anime_id}`} asChild key={item.id}>
              <Pressable>
                <Box className="flex-row p-3 mb-4 rounded-lg bg-gray-900">
                  {/* Anime Cover */}
                  <Image
                    source={{ uri: item.anime.cover_image_url }}
                    alt={item.anime.title}
                    className="w-24 rounded-lg h-36"
                  />

                  {/* Anime Details */}
                  <Box className="flex-1 ml-4">
                    <Text className="mb-2 text-lg font-bold text-white" numberOfLines={2}>
                      {item.anime.title}
                    </Text>

                    {/* Status Badge */}
                    <Box className={`self-start px-3 py-1 mb-2 rounded-full ${getStatusColor(item.status)}`}>
                      <Text className="text-xs font-bold text-white">{item.status}</Text>
                    </Box>

                    {/* Progress */}
                    <Text className="mb-1 text-sm text-gray-400">
                      Episode: {item.current_episode}
                      {item.anime.total_episodes > 0 && ` / ${item.anime.total_episodes}`}
                    </Text>

                    {/* Score */}
                    {item.score && (
                      <Box className="flex-row items-center">
                        <Text className="text-sm text-gray-400">Your Score: </Text>
                        <Text className="text-sm font-bold text-yellow-400">
                          {item.score}/10
                        </Text>
                      </Box>
                    )}

                    {/* MAL Score */}
                    <Text className="text-xs text-gray-500">
                      MAL Score: {item.anime.score || 'N/A'}
                    </Text>
                  </Box>
                </Box>
              </Pressable>
            </Link>
          ))}
        </Box>

        <Box className="h-24" />
      </Box>
    </ScrollView>
  );
}