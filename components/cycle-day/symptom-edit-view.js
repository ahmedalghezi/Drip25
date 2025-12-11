import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native'
import Slider from '@react-native-community/slider'

import AppModal from '../common/app-modal'
import AppText from '../common/app-text'
import AppTextInput from '../common/app-text-input'
import Button from '../common/button'
import Segment from '../common/segment'
import SelectTabGroup from './select-tab-group'
import Temperature from './temperature'

import { blank, save, shouldShow, symtomPage } from '../helpers/cycle-day'
import { showToast } from '../helpers/general'

import { shared as sharedLabels } from '../../i18n/en/labels'
import info from '../../i18n/en/symptom-info'
import { Colors, Containers, Sizes, Spacing } from '../../styles'

const SymptomEditView = ({ date, onClose, symptom, symptomData, onSaved  }) => {
  const symptomConfig = symtomPage[symptom]
  const [data, setData] = useState(symptomData ? symptomData : { ...blank[symptom], intensity: {} })
  const [shouldShowInfo, setShouldShowInfo] = useState(false)

  const getParsedData = () => JSON.parse(JSON.stringify(data))
  const onPressLearnMore = () => setShouldShowInfo(!shouldShowInfo)

  const onEditNote = (note) => {
    const parsedData = getParsedData()

    if (symptom === 'note') {
      Object.assign(parsedData, { value: note })
    } else {
      parsedData['note'] = note
    }

    setData(parsedData)
  }

  const onRemove = () => {
    save[symptom](data, date, true)
    showToast(sharedLabels.dataDeleted)
    onClose()
  }

  const onSave = () => {
    const hasDataChanged = () => {
      const initialData = symptomData ? symptomData : blank[symptom]
      return JSON.stringify(data) !== JSON.stringify(initialData)
    }

    if (hasDataChanged()) {
      save[symptom](data, date, false)
      if (onSaved) {
              onSaved(symptom, data)
            }
      showToast(sharedLabels.dataSaved)
    }

    onClose()
  }

  const onSaveTemperature = (value, field) => {
    const parsedData = getParsedData()
    const dataToSave =
      field === 'value' ? { [field]: Number(value) } : { [field]: value }

    Object.assign(parsedData, { ...dataToSave })

    setData(parsedData)
  }

//  const onSelectBox = (key) => {
//    const parsedData = { ...getParsedData() }
//    if (key === 'other') {
//      parsedData.note = null
//      parsedData[key] = !data[key]
//    } else {
//      parsedData[key] = !data[key]
//      if (parsedData[key]) {
//        parsedData.intensity = { ...parsedData.intensity, [key]: 0 }
//      } else {
//        if (parsedData.intensity) {
//          delete parsedData.intensity[key]
//        }
//      }
//    }
//    setData(parsedData)
//  }
  const onSelectBox = (key) => {
    const parsedData = { ...getParsedData() }

    if (key === 'other') {

      parsedData[key] = !data[key]
      if (parsedData[key]) {

        parsedData.note = null
      }
    } else {

      parsedData[key] = !data[key]

      if (parsedData[key]) {

        parsedData.intensity = {
          ...parsedData.intensity || {},
          [key]: 0
        }
      } else {

        if (parsedData.intensity && key in parsedData.intensity) {
          const { [key]: removedIntensity, ...remainingIntensities } = parsedData.intensity

          parsedData.intensity = Object.keys(remainingIntensities).length > 0
            ? remainingIntensities
            : {}
        }
      }
    }

    setData(parsedData)
  }



  const onSelectBoxNote = (value) => {
    const parsedData = getParsedData()
    Object.assign(parsedData, { note: value !== '' ? value : null })
    setData(parsedData)
  }

  const handleIntensityChange = (key, value) => {

    const roundedValue = Math.round(value)

    setData((prevData) => ({
      ...prevData,
      intensity: {
        ...prevData.intensity,
        [key]: roundedValue,
      },
    }))
  }


  const onSelectTab = (group, value) => {
    const parsedData = getParsedData()


    if (parsedData[group.key] === value) {

      parsedData[group.key] = null


      if (parsedData.intensity) {
        const { [group.key]: _, ...remainingIntensities } = parsedData.intensity
        parsedData.intensity = remainingIntensities
      }
    } else {

      parsedData[group.key] = value


      parsedData.intensity = { ...parsedData.intensity, [group.key]: 0 }
    }

    setData(parsedData)
  }

  const iconName = shouldShowInfo ? 'chevron-up' : 'chevron-down'
  const noteText = symptom === 'note' ? data.value : data.note
  const inputProps = {
    multiline: true,
    numberOfLines: 3,
    scrollEnabled: false,
    style: styles.input,
    textAlignVertical: 'top',
  }


  const renderBleedingStyleLabel = (key, label, isSelected) => {
    const showsSlider = isSelected && key !== 'other'

    return (
      <TouchableOpacity
        style={[
          styles.pillLabel,
          isSelected && styles.pillLabelSelected,
          // Apply condensed style when selected with slider
          showsSlider && styles.pillLabelCondensed
        ]}
        onPress={() => onSelectBox(key)}
      >
        <AppText
          style={[
            styles.pillLabelText,
            isSelected && styles.pillLabelTextSelected,
            // Apply smaller font when selected with slider
            showsSlider && styles.pillLabelTextCondensed,
            // Apply ellipsis style to truncate text if needed
            showsSlider && styles.truncateText
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {label}
        </AppText>
      </TouchableOpacity>
    )
  }

  const renderIntensitySlider = (key) => {
    const intensity = data.intensity?.[key] || 0

    return (
      <View style={styles.sliderContainer}>
        <AppText style={styles.sliderLabel}>Wie stark?</AppText>
        <AppText style={styles.intensityValue}>{intensity}</AppText>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={4}
          step={1}
          value={intensity}
          onValueChange={(value) => handleIntensityChange(key, value)}
          minimumTrackTintColor={Colors.orange}
          maximumTrackTintColor="#E0E0E0"
          thumbTintColor={Colors.orange}
          trackStyle={{ height: 10, borderRadius: 8  }}
          thumbStyle={{ width: 25, height: 25, borderRadius: 15  }}
        />

      </View>
    )
  }

  const renderModifiedSelectBoxGroup = (group) => {
    return (
      <View style={styles.selectBoxGroupContainer}>
        {Object.entries(group.options).map(([key, label]) => (
          <View key={key} style={styles.optionContainer}>

            <View style={styles.optionRow}>
              <View style={styles.labelContainer}>
                {renderBleedingStyleLabel(key, label, data[key] || false)}
              </View>


              <View style={styles.sliderWrapper}>
                {data[key] && key !== 'other' && renderIntensitySlider(key)}
              </View>
            </View>
          </View>
        ))}


        {data['other'] && Object.keys(group.options).includes('other') && (
          <AppTextInput
            {...inputProps}
            placeholder={sharedLabels.enter}
            value={data.note}
            onChangeText={(value) => onSelectBoxNote(value)}
          />
        )}
      </View>
    )
  }

  return (
    <AppModal onClose={onSave}>
      <ScrollView
        contentContainerStyle={styles.modalContainer}
        keyboardDismissMode="on-drag"
      >
        {symptom === 'temperature' && (
          <Temperature
            date={date}
            data={data}
            save={(value, field) => onSaveTemperature(value, field)}
          />
        )}


        {shouldShow(symptomConfig?.selectTabGroups) &&
          Array.isArray(symptomConfig?.selectTabGroups) &&
          symptomConfig.selectTabGroups.map((group) => {
            return (
              <Segment key={group.key} style={styles.segmentBorder}>
                <AppText style={styles.title}>{group.title}</AppText>
                <SelectTabGroup
                  activeButton={data[group.key]}
                  buttons={group.options}
                  onSelect={(value) => onSelectTab(group, value)}
                />
              </Segment>
            )
          })}


        {shouldShow(symptomConfig.selectBoxGroups) &&
          symtomPage[symptom].selectBoxGroups.map((group) => {
            return (
              <Segment key={group.key} style={styles.segmentBorder}>
                <AppText style={styles.title}>{group.title}</AppText>
                {renderModifiedSelectBoxGroup(group)}
              </Segment>
            )
          })}

        {shouldShow(symptomConfig.note) && (
          <Segment style={styles.segmentBorder}>
            <AppText>{symtomPage[symptom].note}</AppText>
            <AppTextInput
              {...inputProps}
              onChangeText={onEditNote}
              placeholder={sharedLabels.enter}
              testID="noteInput"
              value={noteText !== null ? noteText : ''}
            />
          </Segment>
        )}
        <View style={styles.buttonsContainer}>
          <Button iconName={iconName} isSmall onPress={onPressLearnMore}>
            {sharedLabels.learnMore}
          </Button>
          <Button isSmall onPress={onRemove}>
            {sharedLabels.remove}
          </Button>
          <Button isCTA isSmall onPress={onSave}>
            {sharedLabels.save}
          </Button>
        </View>
        {shouldShowInfo && (
          <Segment last style={styles.segmentBorder}>
            <AppText>{info[symptom].text}</AppText>
          </Segment>
        )}
      </ScrollView>
    </AppModal>
  )
}

SymptomEditView.propTypes = {
  date: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  symptom: PropTypes.string.isRequired,
  symptomData: PropTypes.object,
  onSaved: PropTypes.func,
}

const styles = StyleSheet.create({
  buttonsContainer: {
    ...Containers.rowContainer,
    paddingBottom: Spacing.base,
    width: '100%'
  },
  input: {
    height: Sizes.base * 5,
  },
  modalContainer: {
    paddingHorizontal: Spacing.base,
  },
  segmentBorder: {
    borderBottomColor: Colors.greyLight,
  },
  title: {
    fontSize: Sizes.subtitle,
    marginBottom: 10,
  },
  selectBoxGroupContainer: {
    width: '100%',
  },
  sliderLabel: {
    position: 'absolute',
    left: '40%',
    right: '20%',
    top: 5,
    fontSize: Sizes.tiny,
//    fontWeight: 'bold',
    color: Colors.orange,
//    marginBottom: 5,
    textAlign: 'center',
  },

  optionContainer: {
    marginBottom: 15,
  },
  // Horizontal layout
  optionRow: {
    position: 'relative',
//    alignItems: 'center',
//    justifyContent: 'space-between',
    width: '100%',
    minHeight: 40,
    marginBottom: 8,
//    flexWrap: 'nowrap',
  },
  labelContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    maxWidth: '70%',
    zIndex: 1,
  },

  sliderWrapper: {
    position: 'absolute',
    left: '45%',
    right: 0,
    top: 0,
    height: '100%',

  },

  pillLabel: {
      ...Containers.box,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginVertical: 5,
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  pillLabelSelected: {
      ...Containers.boxActive,

  },
  pillLabelCondensed: {

    paddingVertical: 6,
    paddingHorizontal: 8,
    maxWidth: '100%',
    flexShrink: 1,
  },
  pillLabelText: {
    color: Colors.orange,
  },
  pillLabelTextSelected: {
    color: 'white',
  },
  pillLabelTextCondensed: {
    fontSize: Sizes.footnote,


  },
  truncateText: {
    flexShrink: 1,
  },

  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
//    paddingLeft: 0,
//    paddingRight: 0,
    height: '100%',
    width: '100%',
  },
  intensityValue: {
    fontSize: Sizes.footnote,
    fontWeight: 'bold',
    width: 20,
    textAlign: 'center',
//    marginRight: 2,
    marginLeft: 2,
    color: Colors.orange,
  },
  slider: {
    flex: 1,
//    width:320,
//    transform: [{ scaleY: 2}] ,
    height: 40,

  }
})

export default SymptomEditView