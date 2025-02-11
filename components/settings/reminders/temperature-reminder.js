import React, { useState } from 'react'
import DatePicker from 'react-native-date-picker'

import AppSwitch from '../../common/app-switch'

import {
  saveTempReminder,
  tempReminderObservable,
} from '../../../local-storage'
import padWithZeros from '../../helpers/pad-time-with-zeros'

import labels from '../../../i18n/en/settings'

const TemperatureReminder = () => {
  // Existing state for enabling/disabling the reminder and displaying the formatted time.
  const [isEnabled, setIsEnabled] = useState(
      tempReminderObservable.value.enabled
  )
  const [time, setTime] = useState(tempReminderObservable.value.time)

  // State to control the visibility of the DatePicker modal.
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false)
  // New state to hold the actual Date object for the date picker.
  const [date, setDate] = useState(new Date())

  const temperatureReminderToggle = (value) => {
    if (value) {
      setIsTimePickerVisible(true)
    } else {
      saveTempReminder({ enabled: false })
      setIsEnabled(false)
    }
  }

  const onPickDate = (selectedDate) => {
    // Format the selected date/time using your helper.
    const formattedTime = padWithZeros(selectedDate)
    setIsEnabled(true)
    setIsTimePickerVisible(false)
    setTime(formattedTime)
    setDate(selectedDate)
    saveTempReminder({ time: formattedTime, enabled: true })
  }

  const onPickDateCancel = () => {
    setIsTimePickerVisible(false)
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
