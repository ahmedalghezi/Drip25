import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'
import moment from 'moment'

import AppText from './common/app-text'
import Asterisk from './common/Asterisk'
import Button from './common/button'
import Footnote from './common/Footnote'

import cycleModule from '../lib/cycle'
import { getFertilityStatusForDay } from '../lib/sympto-adapter'
import {
  determinePredictionText,
  formatWithOrdinalSuffix,
} from './helpers/home'

import { Colors, Fonts, Sizes, Spacing } from '../styles'
import { LocalDate } from '@js-joda/core'
import { useTranslation } from 'react-i18next'


const Home = ({ navigate, setDate }) => {
  const { t } = useTranslation()

  function navigateToCycleDayView() {
    setDate(todayDateString)
    navigate('CycleDay')
  }

  const todayDateString = LocalDate.now().toString()
  const { getCycleDayNumber, getPredictedMenses } = cycleModule()
  const cycleDayNumber = getCycleDayNumber(todayDateString)
  const { status, phase, statusText } =
    getFertilityStatusForDay(todayDateString)
  const prediction = determinePredictionText(getPredictedMenses(), t)

  const cycleDayText = cycleDayNumber
    ? formatWithOrdinalSuffix(cycleDayNumber)
    : ''

//  return (
//    <ScrollView
//      style={styles.container}
//      contentContainerStyle={styles.contentContainer}
//    >
//      <AppText style={styles.title}>{moment().format('MMM Do YYYY')}</AppText>
//
//      {cycleDayNumber && (
//        <View style={styles.line}>
//          <AppText style={styles.redSubtitle}>{cycleDayText}</AppText>
//          <AppText style={styles.turquoiseText}>
//            {t('labels.home.cycleDay')}
//          </AppText>
//        </View>
//      )}
////      {phase && (
////        <View style={styles.line}>
////          <AppText style={styles.redSubtitle}>
////            {formatWithOrdinalSuffix(phase)}
////          </AppText>
////          <AppText style={styles.turquoiseText}>
////            {t('labels.home.cyclePhase')}
////          </AppText>
//////          <AppText style={styles.turquoiseText}>{status}</AppText>
////          <Asterisk />
////        </View>
////      )}
////      <View style={styles.line}>
////        <AppText style={styles.turquoiseText}>{prediction}</AppText>
////      </View>
//      <Button isCTA isSmall={false} onPress={navigateToCycleDayView}>
//        {t('labels.home.addDataForToday')}
//       </Button>
////      {phase && <Footnote colorLabel="black">{statusText}</Footnote>}
//    </ScrollView>
//  )
//}
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Title with current date */}
      <AppText style={styles.title}>{moment().format('MMM Do YYYY')}</AppText>

      {/* Cycle Day Display */}
      {cycleDayNumber && (
        <View style={styles.line}>
          <AppText style={styles.redSubtitle}>{cycleDayText}</AppText>
          <AppText style={styles.turquoiseText}>
            {t('labels.home.cycleDay')}
          </AppText>
        </View>
      )}

      {/* Button to Add Data for Today */}
      <Button isCTA isSmall={false} onPress={navigateToCycleDayView}>
        {t('labels.home.addDataForToday')}
      </Button>

      {/* Footnote */}
      <Footnote colorLabel="black">{statusText}</Footnote>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#E9F2ED',
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.base,
    paddingTop: 0,
  },
  line: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
    marginBottom: Spacing.tiny,
    marginTop: Spacing.small,
  },
  title: {
    color: '#4B0082',
    fontFamily: Fonts.bold,
    fontSize: Sizes.huge,
    marginVertical: Spacing.small,
  },
  turquoiseText: {
    color: '#004d4d',
    fontSize: Sizes.subtitle,
  },
  redSubtitle: {
    color: '#ED1C24',
    fontSize: Sizes.subtitle,
  },
})

Home.propTypes = {
  navigate: PropTypes.func,
  setDate: PropTypes.func,
}

export default Home
