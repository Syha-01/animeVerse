import { Box } from '@/components/ui/box';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { Link } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';

const Anime = ({ item }: { item: any }) => {
  return (
    <Link href={`/anime/${item.mal_id}`} asChild>
      <Pressable>
        <Box className="items-center w-40 mr-4">
          <Image
            source={{ uri: item.images.jpg.image_url }}
            alt={item.title}
            className="w-40 h-56 rounded-lg"
          />
          <Text className="h-10 mt-2 text-center text-white" numberOfLines={2}>
            {item.title}
          </Text>
        </Box>
      </Pressable>
    </Link>
  );
};

export default Anime;
