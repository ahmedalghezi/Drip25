import React, { useState, useEffect } from 'react'
import { View, Alert } from 'react-native'
import CheckBox from 'react-native-check-box'
import AppLoadingView from '../../common/app-loading'
import AppPage from '../../common/app-page'
import AppText from '../../common/app-text'
import Button from '../../common/button'
import Segment from '../../common/segment'

import { getCode, logout } from '../../password-prompt'

import openShareDialogAndExport from './export-dialog'
import configureDataExport from './exportAutomatic-dialog'
import DeleteData from './delete-data'

import labels from '../../../i18n/en/settings'
import ImportData from './ImportData'

const DataManagement = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    // The checkbox state also reflects whether the user is logged in
    const [AutomaticExportCheckBox, setAutomaticExportCheckBox] = useState(false)
    const [isDeletingData, setIsDeletingData] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkLoginStatus = async () => {
            const code = await getCode()
            const loggedIn = code !== null
            setIsLoggedIn(loggedIn)
            setAutomaticExportCheckBox(loggedIn)
            setIsLoading(false)
        }
        checkLoginStatus()
    }, [])

    const startExport = () => {
        setIsDeletingData(false)
        openShareDialogAndExport()
    }

    // Simulate automatic data sending to a database
    const sendAutomaticExport = () => {

        console.log('inside sendAutomaticExport')
        setIsDeletingData(false)
        configureDataExport()
    }

    // Logout function: calls the logout function and shows an alert message in German.
    const logOut = () => {
        logout()
        setIsLoggedIn(false)
        Alert.alert(
            "Abmeldung",
            "Du wurdest abgemeldet, es werden keine Daten von deinem Telefon gesendet."
        )
    }

    // Handle checkbox toggle with confirmation if the user is logged in
    const handleCheckBoxToggle = () => {
        if (AutomaticExportCheckBox) {
            // If user is trying to uncheck, warn that they will be logged out.
            Alert.alert(
                "Abmeldung bestätigen",
                "Wenn du fortfährst, wirst du abgemeldet. Möchtest du fortfahren?",
                [
                    { text: "Abbrechen", style: "cancel" },
                    {
                        text: "Fortfahren",
                        onPress: () => {
                            logOut()
                            setAutomaticExportCheckBox(false)
                        }
                    }
                ]
            )
        } else {
            // If unchecked, simply check the box.
            setAutomaticExportCheckBox(true)
        }
    }

    if (isLoading) {
        return <AppLoadingView />
    }

    return (
        <AppPage>
            {isLoggedIn &&<Segment title={labels.export.button}>
                <AppText>{labels.export.segmentExplainer}</AppText>
                (
                    <Button isCTA onPress={logOut}>
                        {"Abmelden"}
                    </Button>
                )
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckBox
                        disabled={false}
                        isChecked={AutomaticExportCheckBox}
                        onClick={handleCheckBoxToggle}
                        style={{
                            transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
                            marginBottom: -20,
                        }}
                    />
                    <Button onPress={sendAutomaticExport} disabled={!AutomaticExportCheckBox}>
                        {labels.exportAutomatic.button}
                    </Button>
                </View>
            </Segment>}
            <Segment title={labels.deleteSegment.title} last>
                <AppText>{labels.deleteSegment.explainer}</AppText>
                <DeleteData
                    isDeletingData={isDeletingData}
                    onStartDeletion={() => setIsDeletingData(true)}
                />
            </Segment>
        </AppPage>
    )
}

const styles = {
    fadeButton: {
        opacity: 0.6,
    },
};

export default DataManagement
