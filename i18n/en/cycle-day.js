export const mucusNFP = ['t', 'Ø', 'f', 'S', 'S+']
export const intensity = ['low', 'medium', 'high']

export const bleeding = {
  labels: ['Schmierblutung', 'Leicht', 'Mittel', 'Stark'],
  heaviness: {
    header: "Heaviness",
    explainer: "Wie stark ist deine Blutung / Periode heute?",
  },
  exclude: {
    header: "Exclude",
    explainer: ""
  }
}

export const cervix = {
  subcategories: {
    opening: 'opening',
    firmness: 'firmness',
    position: 'position'
  },
  opening: {
    categories: ['closed', 'medium', 'open'],
    explainer: 'Is your cervix open or closed?'
  },
  firmness: {
    categories: ['hard', 'soft'],
    explainer: "When it's hard, it might feel like the tip of your nose"
  },
  position: {
    categories: ['low', 'medium', 'high'],
    explainer: 'How high up in the vagina is the cervix?'
  },
  excludeExplainer: "You can exclude this value if you don't want to use it for fertility detection.",
  actionHint: 'Choose values for at least "Opening" and "Firmness" to save.'
}

export const mucus = {
  subcategories: {
    feeling: 'feeling',
    texture: 'texture'
  },
  feeling: {
    categories: ['dry', 'nothing', 'wet', 'slippery'],
    explainer: 'What does your vaginal entrance feel like?'
  },
  texture: {
    categories: ['nothing', 'creamy', 'egg white'],
    explainer: "Looking at and touching your cervical mucus, which describes it best?"
  },
  excludeExplainer: "You can exclude this value if you don't want to use it for fertility detection",
  actionHint: 'Choose values for both "Feeling" and "Texture" to save.'
}

export const desire = {
  header: 'Intensity',
  explainer: 'How would you rate your sexual desire?'
}

export const sex = {
  categories:{
    solo: 'solo',
    partner: 'partner',
  },
  header: "Activity",
  explainer: 'Were you sexually active today?',
}

export const contraceptives = {
  categories:{
    condom: 'condom',
    pill: 'pill',
    iud: 'iud',
    patch: 'patch',
    ring: 'ring',
    implant: 'implant',
    diaphragm: 'diaphragm',
    none: 'none',
    other: 'other',
  },
  header: "Contraceptives",
  explainer: 'Did you use contraceptives?'
}

export const pain = {
  categories: {
abdominalPain: 'Unterleibsschmerzen',
    nausea: 'Übelkeit',
    backache: 'Rückenschmerzen',
    bloating: 'Blähungen',
    constipation: 'Verstopfung',
    diarrhea: 'Durchfall',
    hungerCravings: 'Heißhunger',
    sleepProblems: 'Schlafprobleme',
    breathingProblems: 'Atemprobleme',
    headache: 'Kopfschmerzen',
    badSkin: 'Unreine Haut',
    dizziness: 'Schwindel',
    concentrationProblems: 'Konzentrationsprobleme',
    incontinence:'Inkontinenz',
    other: 'Sonstige',
  },
  explainer: 'Welche Symptome hattest Du heute?'
}

export const mood = {
  categories: {
                  happy: "Glücklich",
                  sad: "Traurig",
                  stressed: "Gestresst",
                  balanced: "Ausgeglichen",
                  anxious: "Ängstlich",
                  energetic: "Energiegeladen",
                  fatigue: "Müde",
                  irritated: "Gereizt",
                  angry: "Wütend",
                  driveless: "Antriebslos",
                  motivated: "Motiviert",
                  emotional: "Emotional",
                  other: "Anderes"
              }
,
  explainer: 'Wie hast du dich heute gefühlt?'
}

export const temperature = {
  // disabled temporarily, TODO https://gitlab.com/bloodyhealth/drip/-/issues/545 */}
  // outOfRangeWarning: 'This temperature value is out of the current range for the temperature chart. You can change the range in the settings.',
  outOfRangeWarning: 'This temperature value is too high or low to be shown on the temperature chart.',
  outOfAbsoluteRangeWarning: 'This temperature value is too high or low to be shown on the temperature chart.',
  saveAnyway: 'Save anyway',
  temperature: {
    header: "Temperature",
    explainer: 'Bitte messe deine Temperatur direkt nach dem Aufwachen und dokumentiere sie hier'
  },
  time: "Uhrzeit",
  note: {
    header: "Note",
    explainer: 'Gibt es irgendwas, was diesen Wert beeinflusst haben könnte (z.B schlecht geschlafen, Alkoholkonsum, Infektion etc.)? '
  },
  exclude: {
    header: "Exclude",
    explainer: ""
  }
}

export const noteExplainer = "Hier ist ein Fenster für dich, wo du uns alles mitteilen kannst, was deine Werte beeinflusst haben könnte am heutigen Tag (z.B. Erkrankung, Verletzung, Ereignisse, Schlaf etc.)"

export const general = {
  cycleDayNumber: "Cycle Datum ",
  today: "Heute"
}

export const sharedDialogs = {
  cancel: 'Cancel',
  areYouSureTitle: 'Are you sure?',
  areYouSureToDelete: 'Are you sure you want to delete this entry?',
  reallyDeleteData: 'Yes, I am sure',
  save: 'Save',
  delete: 'Delete',
  disabledInfo: 'There is some data missing'
}
