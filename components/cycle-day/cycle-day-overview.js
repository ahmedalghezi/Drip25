import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'

import AppPage from '../common/app-page'
import SymptomBox from './symptom-box'
import SymptomPageTitle from './symptom-page-title'

import { getCycleDay } from '../../db'
import { getData, nextDate, prevDate } from '../helpers/cycle-day'

import { Spacing } from '../../styles'
import { SYMPTOMS } from '../../config'

const CycleDayOverView = ({ date, setDate, isTemperatureEditView }) => {

  const [cycleDay, setCycleDay] = useState(() => getCycleDay(date))

//  const cycleDay = getCycleDay(date)
    useEffect(() => {
      setCycleDay(getCycleDay(date))
    }, [date])

  const [editedSymptom, setEditedSymptom] = useState(
    isTemperatureEditView ? 'temperature' : ''
  )

    const handleSymptomSaved = (symptom, newData) => {
        // update preview immediately
        setCycleDay((prev) => ({
          ...(prev || {}),
          [symptom]: newData,
        }))
      }

  const showNextCycleDay = () => {
    setDate(nextDate(date))
  }

  const showPrevCycleDay = () => {
    setDate(prevDate(date))
  }

  return (
    <AppPage>
      <SymptomPageTitle
        date={date}
        onNextCycleDay={showNextCycleDay}
        onPrevCycleDay={showPrevCycleDay}
      />
      <View style={styles.container}>
        {SYMPTOMS.map((symptom) => {
          const symptomData =
            cycleDay && cycleDay[symptom] ? cycleDay[symptom] : null

          return (
            <SymptomBox
              date={date}
              key={symptom}
              symptom={symptom}
              symptomData={symptomData}
              symptomDataToDisplay={getData(symptom, symptomData)}
              editedSymptom={editedSymptom}
              setEditedSymptom={setEditedSymptom}
              onSymptomSaved={handleSymptomSaved}

            />
          )
        })}
      </View>
    </AppPage>
  )
}

CycleDayOverView.propTypes = {
  cycleDay: PropTypes.object,
  date: PropTypes.string,
  setDate: PropTypes.func,
  isTemperatureEditView: PropTypes.bool,
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: Spacing.base,
  },
})

export default CycleDayOverView
