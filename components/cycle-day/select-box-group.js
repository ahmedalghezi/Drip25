import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import AppSwitch from '../common/app-switch'
import AppText from '../common/app-text'

import { Colors, Containers, Spacing } from '../../styles'

const SelectBoxGroup = ({ labels, onSelect, optionsState }) => {
  const renderOptions = () => {
    return Object.keys(labels).map((key) => {
      const isChecked = optionsState[key]
      const onToggle = () => onSelect(key)
      const boxStyle = [styles.box, isActive && styles.boxActive]
      const textStyle = [styles.text, isActive && styles.textActive]

      return (
        <View key={key} style={styles.container}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onToggle}
            style={boxStyle}
          >
            <AppText
              style={textStyle}
            >
              {labels[key]}
            </AppText>
          </TouchableOpacity>
          <AppSwitch value={isChecked} onValueChange={onToggle} />
        </View>
      )
    })
  }

  return <View style={styles.groupContainer}>{renderOptions()}</View>
}

SelectBoxGroup.propTypes = {
  labels: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
  optionsState: PropTypes.object,
}

SelectBoxGroup.defaultProps = {
  optionsState: {},
}

const styles = StyleSheet.create({
  container: {
    ...Containers.box,
//    borderBottomColor: Colors.greyLight,
//    borderBottomWidth: StyleSheet.hairlineWidth,
//    marginBottom: Spacing.tiny,
//    paddingVertical: Spacing.small,
  },
  groupContainer: {
    ...Containers.selectGroupContainer,
//    marginBottom: Spacing.small,
  },
  textActive: {
    color: 'white',
  },
  touchable: {
    flex: 1,
  },
  text: {
    color: Colors.orange,
  },
  boxActive: {
      ...Containers.boxActive,
    },
})

export default SelectBoxGroup