import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';

export interface ImagePickerResult {
  uri: string;
  width: number;
  height: number;
}

export function useImagePicker() {
  const [isLoading, setIsLoading] = useState(false);

  const requestPermissions = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'web') return true;

    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'Camera and photo library access are needed to upload garbage photos.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  }, []);

  const pickFromCamera = useCallback(async (): Promise<ImagePickerResult | null> => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return null;

    setIsLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        return {
          uri: result.assets[0].uri,
          width: result.assets[0].width,
          height: result.assets[0].height,
        };
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [requestPermissions]);

  const pickFromGallery = useCallback(async (): Promise<ImagePickerResult | null> => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return null;

    setIsLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        return {
          uri: result.assets[0].uri,
          width: result.assets[0].width,
          height: result.assets[0].height,
        };
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [requestPermissions]);

  const showPickerOptions = useCallback((): Promise<ImagePickerResult | null> => {
    return new Promise((resolve) => {
      if (Platform.OS === 'web') {
        pickFromGallery().then(resolve);
        return;
      }

      Alert.alert('Select Photo', 'Choose how you want to add a photo', [
        {
          text: 'Camera',
          onPress: async () => {
            const result = await pickFromCamera();
            resolve(result);
          },
        },
        {
          text: 'Photo Library',
          onPress: async () => {
            const result = await pickFromGallery();
            resolve(result);
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => resolve(null),
        },
      ]);
    });
  }, [pickFromCamera, pickFromGallery]);

  return {
    pickFromCamera,
    pickFromGallery,
    showPickerOptions,
    isLoading,
  };
}
