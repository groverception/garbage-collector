import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Input } from '@/src/components/common/Input';
import { Button } from '@/src/components/common/Button';
import { useAppContext } from '@/src/context/AppContext';
import { useOnboarding } from '@/src/hooks/useOnboarding';
import { useUploads } from '@/src/hooks/useUploads';
import { COLORS } from '@/src/constants/colors';
import { SPACING, FONT_SIZES, normalize, getContentWidth } from '@/src/utils/responsive';

function showAlert(title: string, message: string, onConfirm?: () => void) {
  if (Platform.OS === 'web') {
    if (onConfirm) {
      if (window.confirm(`${title}\n\n${message}`)) {
        onConfirm();
      }
    } else {
      window.alert(`${title}\n\n${message}`);
    }
  } else {
    if (onConfirm) {
      Alert.alert(title, message, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: onConfirm },
      ]);
    } else {
      Alert.alert(title, message);
    }
  }
}

export default function SettingsScreen() {
  const { userName, setUserName, isLoading } = useAppContext();
  const { resetOnboarding } = useOnboarding();
  const { deleteAllUploads } = useUploads();
  const [localName, setLocalName] = useState(userName);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveName = async () => {
    if (localName.trim() === userName) return;

    setIsSaving(true);
    try {
      await setUserName(localName.trim());
      showAlert('Success', 'Name updated successfully');
    } catch (error) {
      console.error('Error saving name:', error);
      showAlert('Error', 'Failed to save name');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearHistory = () => {
    showAlert(
      'Clear History',
      'Are you sure you want to delete all your reports? This action cannot be undone.',
      async () => {
        try {
          await deleteAllUploads();
          showAlert('Success', 'All reports have been deleted');
        } catch (error) {
          console.error('Error clearing history:', error);
          showAlert('Error', 'Failed to clear history');
        }
      }
    );
  };

  const handleResetOnboarding = () => {
    showAlert(
      'Reset Onboarding',
      'This will show the onboarding screens again next time you open the app.',
      async () => {
        await resetOnboarding();
        showAlert('Success', 'Onboarding has been reset. Refresh the page to see onboarding.');
      }
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>
        <View style={styles.card}>
          <Input
            label="Your Name"
            placeholder="Enter your name"
            value={localName}
            onChangeText={setLocalName}
            onBlur={handleSaveName}
          />
          <Button
            title="Save Name"
            onPress={handleSaveName}
            loading={isSaving}
            disabled={isSaving || localName.trim() === userName}
            variant="outline"
            size="medium"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        <View style={styles.card}>
          <SettingItem
            icon="trash"
            title="Clear History"
            subtitle="Delete all your reports"
            onPress={handleClearHistory}
            destructive
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App</Text>
        <View style={styles.card}>
          <SettingItem
            icon="refresh"
            title="Reset Onboarding"
            subtitle="Show onboarding screens again"
            onPress={handleResetOnboarding}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.appName}>Garbage Collector</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

interface SettingItemProps {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  destructive?: boolean;
}

function SettingItem({
  icon,
  title,
  subtitle,
  onPress,
  destructive,
}: SettingItemProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.settingItem,
        pressed && styles.settingItemPressed,
        Platform.OS === 'web' && ({ cursor: 'pointer' } as any),
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.iconContainer,
          destructive && styles.destructiveIconContainer,
        ]}
      >
        <FontAwesome
          name={icon as any}
          size={18}
          color={destructive ? COLORS.error : COLORS.primary}
        />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, destructive && styles.destructiveText]}>
          {title}
        </Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
      <FontAwesome name="chevron-right" size={14} color={COLORS.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
  },
  content: {
    padding: SPACING.lg,
    maxWidth: getContentWidth(),
    alignSelf: 'center',
    width: '100%',
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
    marginLeft: SPACING.xs,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: normalize(12),
    padding: SPACING.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  settingItemPressed: {
    opacity: 0.7,
  },
  iconContainer: {
    width: normalize(36),
    height: normalize(36),
    borderRadius: normalize(8),
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  destructiveIconContainer: {
    backgroundColor: '#FFEBEE',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 2,
  },
  destructiveText: {
    color: COLORS.error,
  },
  settingSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  appName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  version: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
});
