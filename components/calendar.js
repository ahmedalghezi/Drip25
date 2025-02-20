import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'
import { CalendarList, LocaleConfig } from 'react-native-calendars'
import moment from 'moment';
import 'moment/locale/de';
import { getBleedingDaysSortedByDate } from '../db'
import cycleModule from '../lib/cycle'
import {
  calendarTheme,
  //predictionToCalFormat,
  toCalFormat,
  todayToCalFormat,
} from './helpers/calendar'




LocaleConfig.locales['de'] = {
  monthNames: [
    'Januar',
    'Februar',
    'März',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Dezember'
  ],
  monthNamesShort: [
    'Jan.',
    'Feb.',
    'Mär.',
    'Apr.',
    'Mai',
    'Jun.',
    'Jul.',
    'Aug.',
    'Sep.',
    'Okt.',
    'Nov.',
    'Dez.'
  ],
  dayNames: [
    'Sonntag',
    'Montag',
    'Dienstag',
    'Mittwoch',
    'Donnerstag',
    'Freitag',
    'Samstag'
  ],
  dayNamesShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
  today: 'Heute'
};

// Set German as the default locale
LocaleConfig.defaultLocale = 'de';




const CalendarView = ({ setDate, navigate }) => {
  const bleedingDays = getBleedingDaysSortedByDate()
  const predictedMenses = cycleModule().getPredictedMenses()

  const passDateToDayView = ({ dateString }) => {
    setDate(dateString)
    navigate('CycleDay')
  }

  const markedDates = Object.assign(
    {},
    todayToCalFormat(),
    toCalFormat(bleedingDays),
    //predictionToCalFormat(predictedMenses)
  )

  return (
    <View style={styles.container}>
        <CalendarList
            // Explicitly set German locale and customization
            locale="de"
            firstDay={1}
            // Add German month names
            monthNames={['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']}
            // Add German day names
            dayNames={['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']}
            // Add German short day names
            dayNamesShort={['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']}
            monthNamesShort={['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sept.', 'Okt.', 'Nov.', 'Dez.']}
            onDayPress={passDateToDayView}
            monthFormat={'MMMM yyyy'}
            markedDates={markedDates}
            markingType="custom"
            theme={{
                ...calendarTheme,

            }}
            pastScrollRange={120}
        />
    </View>


//      <CalendarList
//        // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
//        firstDay={1}
//        onDayPress={passDateToDayView}
//        markedDates={markedDates}
//        markingType="custom"
//        theme={calendarTheme}
//        // Max amount of months allowed to scroll to the past.
//        pastScrollRange={120}
//      />
//    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
})

CalendarView.propTypes = {
  setDate: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
}

export default CalendarView
