import links from './links'

export default {
  export: {
    errors: {
      noData: 'There is no data to export',
      problemSendingData: 'Could not send the data to inprov',
      problemSharing: 'There was a problem sharing the data export',
      notSignedIn: 'User not signed in',
    },
    success:{
        message: 'Data succesfully sent to in:prove',
    },
    title: 'My drip. data export',
    subject: 'My drip. data export',
    //button: 'Export Data',
    button: 'Daten senden', // New main export button
   // manual: 'Export Data manually',
    segmentExplainer:
      'Exportiere deine Daten in die in:prove Datenbank'
      //'Export data in CSV format for backup or so you can use it elsewhere',
  },
  exportAutomatic: {
      errors: {
        noData: 'There is no data to export',
        couldNotConvert: 'Could not convert data to CSV',
        problemSharing: 'There was a problem sharing the data export',
      },
      title: 'My drip. data export',
      subject: 'My drip. data export',
      //button: 'Export Data',
      button: 'Daten automatisch senden', // New main export button
      segmentExplainer:
        'Export data to inprov database'
    },
  deleteSegment: {
    title: 'Lösche die App-Daten',
    explainer: 'Lösche die App-Daten von diesem Handy. Wenn du irgendwelche an in:prove gesendeten Daten löschen möchtest, kontaktiere bitte admin@inprove-sport.info.',
    question: 'Möchtest du die App-Daten von diesem Telefon löschen?',
    "message": "Bitte beachte, dass das Löschen der App-Daten dauerhaft und unwiderruflich ist. Wir empfehlen, die vorhandenen Daten vor dem Löschen zu exportieren.",
    "confirmation": "App-Daten dauerhaft löschen",
    "errors": {
      "couldNotDeleteFile": "Daten konnten nicht gelöscht werden",
      "postFix": "Keine Daten wurden gelöscht oder verändert",
      "noData": "Es gibt keine Daten zum Löschen"
    },
    success: {
      message: "App-Daten erfolgreich gelöscht",
    },
  },
  tempScale: {
    segmentTitle: 'Temperature scale',
    segmentExplainer:
      'Change the minimum and maximum value for the temperature chart',
    min: 'Min',
    max: 'Max',
    loadError: 'Could not load saved temperature scale settings',
    saveError: 'Could not save temperature scale settings',
  },
  tempReminder: {
    title: 'Erinnerung zur Temperaturmessung',
    noTimeSet: 'Bestimme eine Zeit für eine tägliche Erinnerung zur Temperaturmessung',
    timeSet: (time) => `Daily reminder set for ${time}`,
    notification: 'Record your morning temperature',
  },
  periodReminder: {
    title: 'Erinnerung für Deine nächste Blutung',
    reminderText:
      'Erhalte 3 Tage vor Beginn Deiner nächsten Periode eine Nachricht als Erinnerung',
    notification: (daysToEndOfPrediction) =>
      `Your next period is likely to start in 3 to ${daysToEndOfPrediction} days.`,
  },
  useCervix: {
    title: 'Secondary symptom',
    cervixModeOn:
      'Cervix values are being used for symptothermal fertility detection. You can switch here to use cervical mucus values for symptothermal fertility detection',
    cervixModeOff:
      'By default, cervical mucus values are being used for symptothermal fertility detection. You can switch here to use cervix values for symptothermal fertility detection',
  },
  passwordSettings: {
    title: 'Passwort',
    explainerDisabled:
      "Hier kannst du dein Passwort ändern. Bitte beachte, dass die App mit der in:prove-Datenbank verknüpft ist. Änderst du hier das Passwort, ändert es sich automatisch auch auf der Datenbank.",
    explainerEnabled:
      'Password protection and database encryption is currently enabled',
    setPassword: 'Set password',
    savePassword: 'Save password',
    changePassword: 'Ändere das Passwort',
    "deletePassword": "Passwort löschen",
    "forgotPassword": "Hast du dein Passwort vergessen?",
    "enterCurrent": "Bitte gib dein aktuelles Passwort ein",
    "enterEmail": "Bitte gib deine E-Mail-Adresse ein",
    "enterNew": "Bitte gib ein neues Passwort ein",
    "confirmPassword": "Bitte bestätige dein Passwort",
    "passwordsDontMatch": "Passwort und Bestätigung stimmen nicht überein",
    backupReminder: {
      title: 'Read this before making changes to your password',
      message: `
Just to be safe, please backup your data using the export function before making any changes to your password.\n
Longer passwords are better! Consider using a passphrase.\n
Please also make sure you do not lose your password. There is no way to recover your data if you do.\n
Making any changes to your password setting will keep your data as it was before.\n`,
    },
    deleteBackupReminder: {
      title: 'Read this before deleting your password',
      message: `
Deleting your password means your data will no longer be encrypted.\n
Just to be safe, please backup your data using the export function before deleting your password.\n
Making any changes to your password setting will keep your data as it was before and restart the app.\n    
    `,
    },
    backupReminderAppendix: {
      android:
        'After the password is updated the app will automatically restart.',
      ios: 'After the password is updated the app will automatically close. Please reopen it manually.',
    },
  },
  website: {
    title: 'Website',
  },
  preOvu: {
    title: 'Infertile days at cycle start',
    note: `drip. applies NFP's rules for calculating infertile days at the start of the cycle (see ${links.wiki.url} for more info). However, drip. does not currently apply the so called 20-day-rule, which determines infertile days at the cycle start from past cycle lengths in case no past symptothermal info is available.`,
  },
}
