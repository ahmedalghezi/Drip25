import React, { useEffect, useState } from 'react'
import { Platform, StyleSheet, View, Keyboard } from 'react-native'
import PropTypes from 'prop-types'
import moment from 'moment'
import { useTranslation } from 'react-i18next'

import AppText from '../common/app-text'
import AppTextInput from '../common/app-text-input'
import Segment from '../common/segment'

import {
  getTemperatureOutOfRangeMessage,
  getPreviousTemperature,
  formatTemperature,
} from '../helpers/cycle-day'

import { temperature as labels } from '../../i18n/en/cycle-day'

import { Colors, Containers, Sizes, Spacing } from '../../styles'

// Import the new date picker library
import DatePicker from 'react-native-date-picker'

const Temperature = ({ data, date, save }) => {
  const { t } = useTranslation()
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false)
  const [temperature, setTemperature] = useState(
      formatTemperature(data.value) || getPreviousTemperature(date)
  )

  const [intialTimeT, setIntialTimeT] = useState(
      moment(data.time, 'HH:mm').toDate() || new Date()
  )

  // Pre-fill temperature value on mount
  useEffect(() => {
    if (temperature) {
      save(temperature, 'value')
    }
   //if(intialTimeT)
     //save(intialTimeT, 'time');
  }, [])

  function onChangeTemperature(value) {
    /*const formattedValue = value.replace(',', '.').trim()
    if (!Number(formattedValue) && value !== '') return false
    setTemperature(formattedValue.toString())*/

    const formattedValue = value.replace(',', '.').trim()
    // Prevent invalid numbers from being processed.
    if (formattedValue !== '' && isNaN(Number(formattedValue))) return
    const newTemp = formattedValue.toString()
    setTemperature(newTemp)
    save(newTemp, 'value')


  }

  function onShowTimePicker() {
    Keyboard.dismiss()
    setTimeout(() => {
      setIsTimePickerVisible(true)
    }, 100) // Small delay to prevent UI glitches
  }

  function setTime(jsDate) {
    const formattedTime = moment(jsDate).format('HH:mm')
    save(formattedTime, 'time')
    setIsTimePickerVisible(false)
  }

  const { time } = data
  const inputStyle = { color: Colors.greyDark }
  const outOfRangeWarning = getTemperatureOutOfRangeMessage(temperature)

  return (
      <React.Fragment>
        <View>
          <Segment>
            <AppText style={styles.title}>{labels.temperature.explainer}</AppText>
            <View style={styles.container}>
              <AppTextInput
                  value={temperature}
                  onChangeText={onChangeTemperature}
                  onEndEditing={() => save(temperature, 'value')}
                  keyboardType="numeric"
                  maxLength={5}
                  style={inputStyle}
                  testID="temperatureInput"
                  underlineColorAndroid="transparent"
              />
              <AppText>°C</AppText>
            </View>
            {!!outOfRangeWarning && (
                <View style={styles.hintContainer}>
                  <AppText style={styles.hint}>{outOfRangeWarning}</AppText>
                </View>
            )}
          </Segment>
          <Segment>
            <AppText style={styles.title}>{labels.time}</AppText>
            <AppTextInput
                onFocus={onShowTimePicker}
                testID="timeInput"
                value={time}
            />
            {/* Use react-native-date-picker in modal mode */}
            <DatePicker
                modal
                open={isTimePickerVisible}
                date={time ? moment(time, 'HH:mm').toDate() : new Date()}
                mode="time"
                onConfirm={(date) => {
                  setTime(date)
                }}
                onCancel={() => setIsTimePickerVisible(false)}
                // Optional: customize text color and other props if needed
            />
          </Segment>
        </View>
      </React.Fragment>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Containers.rowContainer,
  },
  hint: {
    fontStyle: 'italic',
    fontSize: Sizes.small,
  },
  hintContainer: {
    marginVertical: Spacing.tiny,
  },
  title: {
    fontSize: Sizes.subtitle,
  },
})

Temperature.propTypes = {
  data: PropTypes.object.isRequired,
  date: PropTypes.string.isRequired,
  save: PropTypes.func.isRequired,
}

export default Temperature
