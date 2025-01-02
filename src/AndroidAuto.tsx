import React, { useCallback, useEffect, useState } from 'react';
import { Button, View, Alert, Text } from 'react-native';
import { CarPlay } from 'react-native-carplay';
import { menuTemplate } from './templates/menu.template';
import YoutubePlayer from 'react-native-youtube-iframe';

// Lắng nghe sự kiên từ Android Car system
export function AndroidAutoModule() {
  CarPlay.emitter.addListener('didConnect', () => {
    CarPlay.setRootTemplate(menuTemplate);
  });
  CarPlay.emitter.addListener('backButtonPressed', () => {
    CarPlay.popTemplate();
  });
  return;
}

export function AndroidAuto() {
  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback(state => {
    if (state === 'ended') {
      setPlaying(false);
      Alert.alert('video has finished playing!');
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying(prev => !prev);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ fontWeight: 'bold', fontSize: 25, color: 'black' }}>Hello Android Auto</Text>
      <View style={{ flex: 1, width: '100%', height: '100%' }}>
        <YoutubePlayer
          height={550}
          play={playing}
          videoId={'8AsnR75ZNw0'}
          onChangeState={onStateChange}
        />
        <Button title={playing ? 'pause' : 'play'} onPress={togglePlaying} />
      </View>
    </View>
  );
}
