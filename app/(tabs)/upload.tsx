import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { PhotoPicker } from '@/src/components/upload/PhotoPicker';
import { WarningBanner } from '@/src/components/upload/WarningBanner';
import { SuccessModal } from '@/src/components/upload/SuccessModal';
import { Input } from '@/src/components/common/Input';
import { Button } from '@/src/components/common/Button';
import { useImagePicker } from '@/src/hooks/useImagePicker';
import { useAppContext } from '@/src/context/AppContext';
import { createUpload } from '@/src/services/database/uploads';
import { COLORS } from '@/src/constants/colors';
import { SPACING, FONT_SIZES, getContentWidth } from '@/src/utils/responsive';

export default function UploadScreen() {
  const { userName: savedUserName } = useAppContext();
  const { showPickerOptions, isLoading: isPickerLoading } = useImagePicker();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [userName, setUserName] = useState(savedUserName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePickImage = async () => {
    const result = await showPickerOptions();
    if (result) {
      setImageUri(result.uri);
      setErrors((prev) => ({ ...prev, image: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!imageUri) {
      newErrors.image = 'Please select a photo';
    }
    if (!location.trim()) {
      newErrors.location = 'Please enter the location';
    }
    if (!description.trim()) {
      newErrors.description = 'Please describe the situation';
    }
    if (!userName.trim()) {
      newErrors.userName = 'Please enter your name';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createUpload({
        imageUri: imageUri!,
        location: location.trim(),
        description: description.trim(),
        userName: userName.trim(),
      });

      setShowSuccess(true);
    } catch (error) {
      console.error('Error submitting upload:', error);
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setImageUri(null);
    setLocation('');
    setDescription('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <PhotoPicker
            imageUri={imageUri}
            onPress={handlePickImage}
            isLoading={isPickerLoading}
          />
          {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}

          <View style={styles.form}>
            <Input
              label="Where was this photo taken?"
              placeholder="Enter location (e.g., Near City Park, MG Road)"
              value={location}
              onChangeText={setLocation}
              error={errors.location}
              multiline
              numberOfLines={2}
            />

            <Input
              label="Describe the situation"
              placeholder="Tell us what you observed..."
              value={description}
              onChangeText={setDescription}
              error={errors.description}
              multiline
              numberOfLines={4}
            />

            <Input
              label="Your name"
              placeholder="Enter your name"
              value={userName}
              onChangeText={setUserName}
              error={errors.userName}
            />

            <WarningBanner />

            <Button
              title="Submit Report"
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
              size="large"
              style={styles.submitButton}
            />
          </View>
        </View>
      </ScrollView>

      <SuccessModal visible={showSuccess} onClose={handleSuccessClose} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: SPACING.lg,
    maxWidth: getContentWidth(),
    alignSelf: 'center',
    width: '100%',
  },
  form: {
    marginTop: SPACING.lg,
  },
  errorText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
  submitButton: {
    marginTop: SPACING.lg,
  },
});
