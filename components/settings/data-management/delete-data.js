import React, { useState } from 'react'
import RNFS from 'react-native-fs'
import { Alert } from 'react-native'
import PropTypes from 'prop-types'

import Button from '../../common/button'

import ConfirmWithPassword from '../common/confirm-with-password'
import alertError from '../common/alert-error'

import { clearDb, isDbEmpty } from '../../../db'
import { showToast } from '../../helpers/general'
import { hasEncryptionObservable } from '../../../local-storage'
import settings from '../../../i18n/en/settings'
import { shared as sharedLabels } from '../../../i18n/en/labels'
import { EXPORT_FILE_NAME } from './constants'

// Import getCode from password-prompt.js (adjust the path as needed)
import { getCode } from '../../password-prompt'

const exportedFilePath = `${RNFS.DocumentDirectoryPath}/${EXPORT_FILE_NAME}`

const DeleteData = ({ onStartDeletion, isDeletingData }) => {
  const isPasswordSet = hasEncryptionObservable.value
  const [isConfirmingWithPassword, setIsConfirmingWithPassword] = useState(false)

  const onAlertConfirmation = () => {
    onStartDeletion()
    if (isPasswordSet) {
      setIsConfirmingWithPassword(true)
    } else {
      deleteAppData()
    }
  }

  const alertBeforeDeletion = async () => {
    const { question, message, confirmation, errors } = settings.deleteSegment
    if (isDbEmpty() && !(await RNFS.exists(exportedFilePath))) {
      alertError(errors.noData)
    } else {
      Alert.alert(question, message, [
        {
          text: confirmation,
          onPress: onAlertConfirmation,
        },
        {
          text: sharedLabels.cancel,
          style: 'cancel',
          onPress: cancelConfirmationWithPassword,
        },
      ])
    }
  }

  // New function: warn the user before deleting data on in:prove.
  const alertBeforeInproveDeletion = () => {
    Alert.alert(
        'Daten bei in:prove löschen',
        'Bist du sicher, dass du deine App-Daten bei in:prove löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.',
        [
          { text: sharedLabels.cancel, style: 'cancel' },
          { text: 'Löschen', onPress: deleteMyAppDataOnInprove },
        ]
    )
  }


  const deleteExportedFile = async () => {
    if (await RNFS.exists(exportedFilePath)) {
      await RNFS.unlink(exportedFilePath)
    }
  }

  const deleteAppData = async () => {
    const { errors, success } = settings.deleteSegment

    try {
      if (!isDbEmpty()) {
        clearDb()
      }
      await deleteExportedFile()
      showToast(success.message)
    } catch (err) {
      alertError(errors.couldNotDeleteFile)
    }
    cancelConfirmationWithPassword()
  }

  const deleteMyAppDataOnInprove = async () => {
    try {
      const response = await fetch(
          'https://inprove-sport.info/csv/cycle/delete_my_data',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: getCode() }),
          }
      )

      const result = await response.json()

      if (result.res === 'ok') {
        showToast('Die Löschanfrage wurde erfolgreich bei in:prove ausgeführt')
      } else {
        alertError('Das Löschen der App-Daten bei in:prove ist fehlgeschlagen')
      }
    } catch (err) {

      alertError(err.message || 'Beim Löschen der Daten bei in:prove ist ein Fehler aufgetreten')
    }
  }


  const cancelConfirmationWithPassword = () => {
    setIsConfirmingWithPassword(false)
  }

  if (isConfirmingWithPassword && isDeletingData) {
    return (
        <ConfirmWithPassword
            onSuccess={deleteAppData}
            onCancel={cancelConfirmationWithPassword}
        />
    )
  }

  // Only show the "in:prove" deletion button if getCode() returns a non-null value.
  const code = getCode()

  return (
      <>
        <Button isCTA onPress={alertBeforeDeletion}>
          {settings.deleteSegment.title}
        </Button>
        {code !== null && (
            <Button isCTA onPress={alertBeforeInproveDeletion}>
              Lösche meine App-Daten auf in:prove
            </Button>
        )}
      </>
  )
}

DeleteData.propTypes = {
  isDeletingData: PropTypes.bool,
  onStartDeletion: PropTypes.func.isRequired,
}

export default DeleteData
