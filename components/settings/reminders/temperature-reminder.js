// temperature-reminder.js
import React, { useState } from 'react'
import { Alert } from 'react-native'
import DatePicker from 'react-native-date-picker'

import AppSwitch from '../../common/app-switch'

import {
  saveTempReminder,
  tempReminderObservable,
} from '../../../local-storage'
import padWithZeros from '../../helpers/pad-time-with-zeros'

import labels from '../../../i18n/en/settings'

const TemperatureReminder = () => {
  // Read observable defensively – if something is wrong, fall back to defaults
  const initialReminder =
    (tempReminderObservable && tempReminderObservable.value) || {
      enabled: false,
      time: null,
    }

  const [isEnabled, setIsEnabled] = useState(!!initialReminder.enabled)
  const [time, setTime] = useState(initialReminder.time)
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false)
  const [date, setDate] = useState(new Date())

  const showErrorAlert = (message) => {
    Alert.alert(
      'Temperatur-Erinnerung',
      message || 'Es ist ein Fehler aufgetreten. Die App läuft weiter.'
    )
  }

  const temperatureReminderToggle = (value) => {
    try {
      if (value) {
        // Only open picker – no storage write yet
        setIsTimePickerVisible(true)
      } else {
        // Disable reminder safely
        saveTempReminder({ enabled: false })
        setIsEnabled(false)
      }
    } catch (error) {
      console.error('Error in temperatureReminderToggle:', error)
      showErrorAlert(
        'Die Erinnerung konnte nicht geändert werden. Bitte versuche es später erneut.'
      )
    }
  }

  const onPickDate = (selectedDate) => {
    try {
      if (!(selectedDate instanceof Date) || isNaN(selectedDate)) {
        throw new Error('Invalid date from DatePicker')
      }

      const formattedTime = padWithZeros(selectedDate)

      setIsEnabled(true)
      setIsTimePickerVisible(false)
      setTime(formattedTime)
      setDate(selectedDate)

      // Any error in saving will be caught
      saveTempReminder({ time: formattedTime, enabled: true })
    } catch (error) {
      console.error('Error when setting temperature reminder time:', error)
      setIsTimePickerVisible(false)
      showErrorAlert(
        'Beim Speichern der Uhrzeit ist ein Fehler aufgetreten. Bitte versuche es später erneut.'
      )
    }
  }

  const onPickDateCancel = () => {
    try {
      setIsTimePickerVisible(false)

      // Optionally ensure a partially enabled state is cleaned up
      if (!isEnabled) {
        saveTempReminder({ enabled: false })
      }
    } catch (error) {
      console.error('Error when cancelling time picker:', error)
      // Here we keep it quiet – app should just continue
    }
  }

  const tempReminderText =
    time && isEnabled
      ? labels.tempReminder.timeSet(time)
      : labels.tempReminder.noTimeSet

  return (
    <>
      <AppSwitch
        onToggle={temperatureReminderToggle}
        text={tempReminderText}
        value={isEnabled}
      />
      <DatePicker
        modal
        open={isTimePickerVisible}
        date={date}
        mode="time"
        onConfirm={onPickDate}
        onCancel={onPickDateCancel}
      />
    </>
  )
}

export default TemperatureReminder
