export const home = {
  unknown: '?',
  phase: (n) => `${['1st', '2nd', '3rd'][n - 1]} cycle phase`,
}

export const shared = {
  cancel: 'Cancel',
  save: 'Erledigt',
  today: 'Heute',
  dataSaved: 'Symptom data was saved',
  dataDeleted: 'Symptom data was deleted',
  errorTitle: 'Error',
  errorMessage: 'An error ocurred. Please try again.',
  successTitle: 'Success',
  warning: 'Warning',
  incorrectPassword: 'Password incorrect',
  incorrectPasswordMessage: 'That password is incorrect.',
  incorrectLogin: 'Login failed',
  incorrectLoginMessage: 'The login credentials are incorrect.',
  serverError: '',
  checkEmail: 'Check your email for further instructions.',
  tryAgain: 'Try again',
  ok: 'OK',
  confirmToProceed: 'Confirm to proceed',
  date: 'Datum',
  loading: 'Loading ...',
  noDataWarning: "You haven't entered any data yet.",
  noTemperatureWarning: "You haven't entered any temperature data yet.",
  noDataButtonText: 'Start entering data now',
  enter: 'Enter',
  remove: 'Entfernen',
  learnMore: 'Lerne mehr',
}

export const stats = {
  cycleLengthExplainer: 'Basic statistics about the length of your cycles.',
  emptyStats: 'At least one completed cycle is needed to display stats.',
  daysLabel: 'days',
  basisOfStatsEnd: 'completed\ncycles',
  averageLabel: 'Average cycle',
  minLabel: `Shortest`,
  maxLabel: `Longest`,
  stdLabel: `Standard\ndeviation`,
}

//export const bleedingPrediction = {
//  predictionInFuture: (startDays, endDays) =>
//    `Your next period is likely to start in ${startDays} to ${endDays} days.`,
//  predictionStartedXDaysLeft: (numberOfDays) =>
//    `Your period is likely to start today or within the next ${numberOfDays} days.`,
//  predictionStarted1DayLeft:
//    'Your period is likely to start today or tomorrow.',
//  predictionStartedNoDaysLeft: 'Your period is likely to start today.',
//  predictionInPast: (startDate, endDate) =>
//    `Based on your documented data, your period was likely to start between ${startDate} and ${endDate}.`,
//}
export const bleedingPrediction = {
  predictionInFuture: (startDays, endDays) =>
    `Deine nächste Periode wird voraussichtlich in ${startDays} bis ${endDays} Tagen beginnen.`,
  predictionStartedXDaysLeft: (numberOfDays) =>
    `Deine Periode wird voraussichtlich heute oder innerhalb der nächsten ${numberOfDays} Tage beginnen.`,
  predictionStarted1DayLeft:
    'Deine Periode wird voraussichtlich heute oder morgen beginnen.',
  predictionStartedNoDaysLeft: 'Deine Periode wird voraussichtlich heute beginnen.',
  predictionInPast: (startDate, endDate) =>
    `Auf Basis Deiner Dokumentation, wird deine Blutung höchstwahrscheinlich zwischen ${startDate} und ${endDate} gestartet sein.`,
}


export const passwordPrompt = {
  title: 'Anmelden',
  enterEmailAddress: 'Email',
  enterPassword: 'Passwort',
  deleteDatabaseExplainer:
    "If you've forgotten your password, unfortunately, there is nothing we can do to recover your data, because it is encrypted with the password only you know. You can, however, delete all your encrypted data and start fresh. Once all data has been erased, you can set a new password in the settings, if you like.",
  forgotPassword: 'Forgot your password?',
  deleteDatabaseTitle: 'Forgot your password?',
  deleteData: 'Yes, delete all my data',
  areYouSureTitle: 'Are you sure?',
  areYouSure:
    'Are you absolutely sure you want to permanently delete all your data?',
  reallyDeleteData: 'Yes, I am sure',
}

export const fertilityStatus = {
  fertile: 'fertile',
  infertile: 'infertile',
  fertileUntilEvening: 'Fertile phase ends in the evening',
  unknown:
    'Wir können keine Zyklusinformationen anzeigen, da keine Periodendaten hinzugefügt wurden.',
  preOvuText:
    "With NFP rules, you may assume 5 days of infertility at the beginning of your cycle.",
  periOvuText:
    'Wir konnten keine Veränderung in deiner Temperatur feststellen',
  periOvuUntilEveningText: (tempRule) => {
    return (
      'We detected a temperature shift (' +
      ['regular', '1st exception', '2nd exception'][tempRule] +
      ' temperature rule). In the evening today you may assume infertility, but ' +
      'always remember to double-check for yourself. Make sure the data makes sense to you.'
    )
  },
  postOvuText: (tempRule) => {
    return (
      'We detected a temperature shift (' +
      ['regular', '1st exception', '2nd exception'][tempRule] +
      ' temperature rule). You may assume infertility, but always remember to ' +
      'double-check for yourself. Make sure the data makes sense to you.'
    )
  },
}
