
import { Text, View } from 'react-native';

import React from 'react';
import YoutubePlayer from 'react-native-youtube-iframe';

export default function SavedScreen() {
  return (
    <View>
      <Text>This is the saved screen</Text>
      <View>
      <YoutubePlayer
        height={300}
        play={true}
        videoId={'84WIaK3bl_s'}
      />
    </View>
    </View>
  )
}