import React, { useEffect, useState } from 'react'
import { View, Button, Text, Platform } from 'react-native'
import Notification from 'react-native-push-notification'
import { savePeriodReminder } from '../local-storage'
import cycleModule from '../lib/cycle'
import Moment from 'moment'

const TestNotificationsScreen = ({ navigate }) => {
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    // For Android, create the notification channel if not already created
    if (Platform.OS === 'android') {
      Notification.createChannel(
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
//  const triggerTestNotification = () => {
//    Notification.localNotification({
//      channelId: 'health-app-reminders',
//      id: '1',
//      userInfo: { id: '1' },
//      title: 'Test Temperature Notification',
//      message: 'Record your temperature now!',
//      vibrate: true,
//    })
//  }

  // Test Period Reminder Button (Direct Scheduling for Next 10 Minutes)
   // Method 1: Scheduled Notification (10 seconds delay)
   const scheduleTestPeriodNotification = () => {
     const now = new Date();
     // Schedule notification for 10 seconds from now
     const scheduledTime = new Date(now.getTime() + 10000);
     console.log(`Current time: ${now}`);
     console.log(`Scheduled period notification for: ${scheduledTime}`);

     Notification.localNotificationSchedule({
       channelId: 'health-app-reminders', // Must match channel created
       id: 'test_period',                 // Use a unique ID for testing
       userInfo: { id: 'test_period' },
       title: 'Test Period Notification',
       message: 'This is a test period reminder scheduled for 10 seconds in the future.',
       date: scheduledTime,
       vibrate: true,
       allowWhileIdle: true,
       importance: 'high',
       priority: 'high',
     });
   };

   // Method 2: Immediate Notification via setTimeout
   const triggerImmediateTestPeriodNotification = () => {
     console.log(`Trigger immediate test notification at: ${new Date()}`);
     // Wait 5 seconds then trigger the notification immediately
     setTimeout(() => {
       Notification.localNotification({
         channelId: 'health-app-reminders',
         id: 'test_period_immediate',
         userInfo: { id: 'test_period_immediate' },
         title: 'Immediate Test Period Notification',
         message: 'This is an immediate test period reminder triggered after a 5-second delay.',
         vibrate: true,
         allowWhileIdle: true,
         importance: 'high',
         priority: 'high',
       });
       console.log(`Immediate test period notification triggered at: ${new Date()}`);
     });
   };

//  return (
//    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//      <Text>Current Date Set: {currentDate}</Text>
//      <Button
//        title="Trigger Temperature Test Notification"
//        onPress={triggerTestNotification}
//      />
//      <Button title="Schedule Test Period Notification (10s delay)"
//               onPress={scheduleTestPeriodNotification}/>
//    <View style={{ marginVertical: 12 }} />
//             <Button
//               title="Trigger Immediate Test Period Notification (after 5s)"
//               onPress={triggerImmediateTestPeriodNotification}
//             />
//    </View>
//  )
//}
return (
     <View style={{ flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' }}>
       <Text style={{ marginBottom: 16, textAlign: 'center' }}>
         Use these buttons to test period notifications. For best results, background the app after scheduling.
       </Text>
       <Button
         title="Schedule Test Period Notification (10s delay)"
         onPress={scheduleTestPeriodNotification}
       />
       <View style={{ marginVertical: 12 }} />
       <Button
         title="Trigger Immediate Test Period Notification (after 5s)"
         onPress={triggerImmediateTestPeriodNotification}
       />
     </View>
   );
 };


export default TestNotificationsScreen
