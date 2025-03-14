import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  Alert
} from 'react-native';
import Notification from 'react-native-push-notification';
import { tempReminderObservable, periodReminderObservable } from './local-storage';

const NotificationTester = () => {
  const [currentSettings, setCurrentSettings] = useState({
    tempEnabled: false,
    tempTime: '',
    periodEnabled: false
  });

  // Load current notification settings when component mounts
  useEffect(() => {
    const tempSettings = tempReminderObservable.value;
    const periodSettings = periodReminderObservable.value;

    setCurrentSettings({
      tempEnabled: tempSettings.enabled,
      tempTime: tempSettings.time || 'Not set',
      periodEnabled: periodSettings.enabled
    });

    // Subscribe to changes in settings
    const tempListener = tempReminderObservable((settings) => {
      setCurrentSettings(prev => ({
        ...prev,
        tempEnabled: settings.enabled,
        tempTime: settings.time || 'Not set'
      }));
    });

    const periodListener = periodReminderObservable((settings) => {
      setCurrentSettings(prev => ({
        ...prev,
        periodEnabled: settings.enabled
      }));
    });

    return () => {
      // Clean up listeners if needed
    };
  }, []);

  // Test immediate notification
  const testImmediateNotification = () => {
    Notification.localNotification({
      id: '999',
      title: "Test Notification",
      message: "This is a test notification that appears immediately",
      channelId: 'health-app-reminders',
      playSound: true,
      vibrate: true,
    });

    Alert.alert("Notification Sent", "An immediate test notification was sent");
  };

  // Test temperature reminder (10 seconds delay)
  const testTemperatureReminder = () => {
    const futureTime = new Date(Date.now() + 10000);

    Notification.localNotificationSchedule({
      id: '1',
      userInfo: { id: '1' },
      title: "Temperature Reminder Test",
      message: "Time to record your temperature (TEST)",
      channelId: 'health-app-reminders',
      date: futureTime,
      playSound: true,
      vibrate: true,
    });

    Alert.alert(
      "Temperature Notification Scheduled",
      "A test temperature notification will appear in 10 seconds"
    );
  };

  // Test period reminder (10 seconds delay)
  const testPeriodReminder = () => {
    const futureTime = new Date(Date.now() + 10000);

    Notification.localNotificationSchedule({
      id: '2',
      userInfo: { id: '2' },
      title: "Period Reminder Test",
      message: "Your period is likely to start in 3 days (TEST)",
      channelId: 'health-app-reminders',
      date: futureTime,
      playSound: true,
      vibrate: true,
    });

    Alert.alert(
      "Period Notification Scheduled",
      "A test period notification will appear in 10 seconds"
    );
  };

  // Check scheduled notifications
  const checkScheduledNotifications = () => {
    Notification.getScheduledLocalNotifications(notifications => {
      if (notifications.length === 0) {
        Alert.alert(
          "No Scheduled Notifications",
          "There are currently no scheduled notifications"
        );
        return;
      }

      const notificationDetails = notifications.map(n =>
        `ID: ${n.id}\nTitle: ${n.title}\nTime: ${new Date(n.date).toLocaleString()}`
      ).join('\n\n');

      Alert.alert(
        `${notifications.length} Scheduled Notification(s)`,
        notificationDetails,
        [{ text: "OK" }]
      );
    });
  };

  // Cancel all notifications
  const cancelAllNotifications = () => {
    Notification.cancelAllLocalNotifications();
    Alert.alert("Notifications Cleared", "All scheduled notifications have been cancelled");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Notification Test Center</Text>

      <View style={styles.settingsCard}>
        <Text style={styles.cardTitle}>Current Notification Settings</Text>
        <Text style={styles.settingItem}>
          Temperature Reminders: <Text style={styles.settingValue}>
            {currentSettings.tempEnabled ? 'Enabled' : 'Disabled'}
          </Text>
        </Text>
        {currentSettings.tempEnabled && (
          <Text style={styles.settingItem}>
            Reminder Time: <Text style={styles.settingValue}>
              {currentSettings.tempTime}
            </Text>
          </Text>
        )}
        <Text style={styles.settingItem}>
          Period Reminders: <Text style={styles.settingValue}>
            {currentSettings.periodEnabled ? 'Enabled' : 'Disabled'}
          </Text>
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Tests</Text>
        <View style={styles.buttonContainer}>
          <Button
            title="Send Immediate Test Notification"
            onPress={testImmediateNotification}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reminder Tests</Text>
        <View style={styles.buttonContainer}>
          <Button
            title="Test Temperature Reminder (10s)"
            onPress={testTemperatureReminder}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Test Period Reminder (10s)"
            onPress={testPeriodReminder}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Management</Text>
        <View style={styles.buttonContainer}>
          <Button
            title="Check Scheduled Notifications"
            onPress={checkScheduledNotifications}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Cancel All Notifications"
            onPress={cancelAllNotifications}
            color="#ff3b30"
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  settingsCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  settingItem: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  settingValue: {
    fontWeight: '600',
    color: '#000',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  buttonContainer: {
    marginBottom: 12,
  },
});

export default NotificationTester;