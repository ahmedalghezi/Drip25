import React, { useState, useEffect } from 'react'
import { BackHandler, StyleSheet, View } from 'react-native'
import {setupGuestSessionMonitor, clearGuestSessionIfNeeded,isGuestSession} from './password-prompt.js'
import PasswordPrompt from './password-prompt.js'
import { LocalDate } from '@js-joda/core'
import Header from './header'
import Menu from './menu'
import { viewsList } from './views'
import { pages } from './pages'
import { closeDb } from '../db'
const App = ({ restartApp }) => {
const [date, setDate] = useState(LocalDate.now().toString())
const [currentPage, setCurrentPage] = useState('Home')
const [isLoggedIn, setIsLoggedIn] = useState(false);

//  useEffect(() => {
//    const checkLoginSession = async () => {
//      const loginCode = await getCode();
//      const isGuest = await isGuestSession();
//      const isCredentialLogin = await AsyncStorage.getItem('isCredentialLogin') === 'true';
//
//      if (loginCode && isCredentialLogin) {
//        setIsLoggedIn(true); // User is already logged in, skip login screen
//      }
//    };
//
//    checkLoginSession();
//  }, []);


const goBack = () => {
if (currentPage === 'Home') {
closeDb()
BackHandler.exitApp()
} else {
const { parent } = pages.find((p) => p.component === currentPage)
setCurrentPage(parent)
}
return true
}
useEffect(() => {
const backHandler = BackHandler.addEventListener(
'hardwareBackPress',
goBack
)
//const monitorFunction = setupGuestSessionMonitor();
return () => {
backHandler.remove();
}
}, [])

useEffect(() => {
return () => {
// This runs when component unmounts (app closes)
clearGuestSessionIfNeeded();
}
}, []);

//if (!isLoggedIn) {
//    // Show the login screen if the user is not logged in
//    return (
//      <PasswordPrompt enableShowApp={() => setIsLoggedIn(true)} />
//    );
//  }


/// useEffect(() => setupNotifications(setCurrentPage, setDate), [])
const Page = viewsList[currentPage]
const isTemperatureEditView = currentPage === 'TemperatureEditView'
const headerProps = { navigate: setCurrentPage }
const pageProps = {
date,
setDate,
isTemperatureEditView,
navigate: setCurrentPage,
}
return (
<View style={styles.container}>
<Header {...headerProps} />
<Page {...pageProps} restartApp={restartApp} />
<Menu currentPage={currentPage} navigate={setCurrentPage} />
</View>
)
}
const styles = StyleSheet.create({
container: {
flex: 1,
},
})
export default App
