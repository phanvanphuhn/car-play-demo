import React, { useEffect, useState } from 'react';
import { Alert, Button, Text, View } from 'react-native';
import { CarPlay } from 'react-native-carplay';
import { menuTemplate } from './templates/menu.template';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [networkInfo, setNetworkInfo] = useState<boolean | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // selectImage from library
  const selectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setSelectedImage(response.assets[0].uri as string);
        console.log('Selected Image URI: ', response.assets[0].uri);
      }
    });
  };

  // upload image
  const onUploadImage = async (res?: string) => {
    if (res) {
      console.log('onUploadImage: ', res);
    } else {
      console.log('selectedImage: ', selectedImage);
    }
  };

  // fake case network connected after 5s
  const connectNetwork = () => {
    const timeout = setTimeout(() => {
      clearTimeout(timeout);
      setNetworkInfo(true);
    }, 5000);
  };

  // fake case network disconnected after 5s
  const disconnectNetwork = () => {
    const timeout = setTimeout(() => {
      clearTimeout(timeout);
      setNetworkInfo(false);
    }, 5000);
  };

  // action when network re-connected
  const onNetworkConnected = async () => {
    // get image from local storage
    const res = await AsyncStorage.getItem('storedImage');
    // re upload image when network re-connected
    if (res) {
      await onUploadImage(res);
    }
  };

  // action when losing network connection
  const onNetworkDisconnected = async () => {
    // store image to local storage
    if (selectedImage) {
      try {
        await AsyncStorage.setItem('storedImage', selectedImage);
        console.log('Image stored locally');
      } catch (error) {
        console.log('Error storing image: ', error);
      }
    }
  };

  useEffect(() => {
    disconnectNetwork();
  }, []);

  // check network status
  useEffect(() => {
    if (networkInfo !== null) {
      if (networkInfo) {
        Alert.alert('Network connected!', 'Okay', [
          {
            text: 'Okay',
            onPress: () => {
              onNetworkConnected();
            },
          },
        ]);
      } else {
        Alert.alert('Network disconnected!', 'Okay', [
          {
            text: 'Okay',
            onPress: () => {
              onNetworkDisconnected();
              connectNetwork();
            },
          },
        ]);
      }
    }
  }, [networkInfo]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ fontWeight: 'bold', fontSize: 25, color: 'black' }}>Hello Android Auto</Text>
      <Button title="Select Image" onPress={selectImage} />
      {selectedImage && <Text>Selected Image: {selectedImage}</Text>}
    </View>
  );
}
