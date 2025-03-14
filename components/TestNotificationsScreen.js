import React, { useEffect, useState } from 'react'
import { View, Button, Text, Platform } from 'react-native'
import PushNotification from 'react-native-push-notification'
import { savePeriodReminder } from '../local-storage'
import cycleModule from '../lib/cycle'
import Moment from 'moment'

const TestNotificationsScreen = ({ navigate }) => {
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    // For Android, create the notification channel if not already created
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: 'health-app-reminders', // Must match the channelId used when scheduling notifications
          channelName: 'Health App Reminders',
          channelDescription: 'Reminders for temperature and period tracking',
          vibrate: true,
          importance: 4,
          soundName: 'default',
        },
        (created) => console.log(`Channel created: ${created}`)
      )
    }
  }, [])

  // Test Temperature Reminder Button
  const triggerTestNotification = () => {
    PushNotification.localNotification({
      channelId: 'health-app-reminders',
      id: '1',
      userInfo: { id: '1' },
      title: 'Test Temperature Notification',
      message: 'Record your temperature now!',
      vibrate: false,
    })
  }

  // Test Period Reminder Button (Direct Scheduling for Next 10 Minutes)
  const testPeriodReminderNow = () => {
    // Schedule the period reminder for 5 seconds from now
    const testReminderDate = new Date(Date.now() + 5000); // 5000 ms = 5 seconds
    PushNotification.localNotificationSchedule({
      channelId: 'health-app-reminders',
      id: '2',
      userInfo: { id: '2' },
      title: 'Test Period Reminder',
      message: 'Your period is predicted to start soon!',
      date: testReminderDate,
      vibrate: false,
      allowWhileIdle: true,
    });
    console.log(`Period reminder scheduled for: ${testReminderDate}`);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Current Date Set: {currentDate}</Text>
      <Button
        title="Trigger Temperature Test Notification"
        onPress={triggerTestNotification}
      />
      <Button title="Test Period Reminder Now (0.10 min)" onPress={testPeriodReminderNow} />
    </View>
  )
}

export default TestNotificationsScreen
