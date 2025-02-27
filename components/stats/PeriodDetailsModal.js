import React from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import AppModal from '../common/app-modal'
import AppText from '../common/app-text'

import cycleModule from '../../lib/cycle'
import { Spacing, Typography, Colors } from '../../styles'
import { humanizeDate } from '../helpers/format-date'

const Item = ({ data }) => {
  const { t } = useTranslation(null, { keyPrefix: 'plurals' })

  if (!data) return false

  const { date, cycleLength, bleedingLength } = data

  return (
    <View style={styles.row}>
      <View style={styles.accentCell}>
        <AppText>{humanizeDate(date)}</AppText>
      </View>
      <View style={styles.cell}>
        <AppText>{t('day', { count: cycleLength })}</AppText>
      </View>
      <View style={styles.cell}>
        <AppText>{t('day', { count: bleedingLength })}</AppText>
      </View>
    </View>
  )
}

Item.propTypes = {
  data: PropTypes.object.isRequired,
}

const PeriodDetailsModal = ({ onClose }) => {
  const renderItem = ({ item }) => <Item data={item} />
  const data = cycleModule().getStats()

  if (!data || data.length === 0) return false

  return (
    <AppModal onClose={onClose}>
      <View>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.date}
          ItemSeparatorComponent={ItemDivider}
          ListHeaderComponent={FlatListHeader}
          ListHeaderComponentStyle={styles.headerDivider}
          stickyHeaderIndices={[0]}
          contentContainerStyle={styles.container}
        />
      </View>
    </AppModal>
  )
}

PeriodDetailsModal.propTypes = {
  onClose: PropTypes.func,
}

const ItemDivider = () => <View style={styles.divider} />

const FlatListHeader = () => (
  <View style={styles.row}>
    <View style={styles.accentCell}>
      <AppText style={styles.header}>{'Zyklusstart'}</AppText>
    </View>
    <View style={styles.cell}>
      <AppText style={styles.header}>{'Zykllänge'}</AppText>
    </View>
    <View style={styles.cell}>
      <AppText style={styles.header}>{'Blutung'}</AppText>
    </View>
  </View>
)

const styles = StyleSheet.create({
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.grey,
  },
  header: {
    ...Typography.accentOrange,
    paddingVertical: Spacing.small,
      fontSize: 12,
      justifyContent: 'center'
  },
  headerDivider: {
    borderBottomColor: Colors.purple,
    borderBottomWidth: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.tiny,
    backgroundColor: 'white',
  },
  cell: {
    flex: 2,
    justifyContent: 'center',
  },
  accentCell: {
    flex: 3,
    justifyContent: 'center',
  },
  container: {
    minHeight: '40%',
    minWidth: '95%',
    paddingHorizontal: Spacing.base,
  },
})

export default PeriodDetailsModal
