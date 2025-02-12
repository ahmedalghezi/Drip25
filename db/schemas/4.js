const TemperatureSchema = {
  name: 'Temperature',
  properties: {
    value: 'double',
    exclude: 'bool',
    time: {
      type: 'string',
      optional: true
    },
    note: {
      type: 'string',
      optional: true
    }
  }
}

const BleedingSchema = {
  name: 'Bleeding',
  properties: {
    value: 'int',
    exclude: 'bool'
  }
}

const MucusSchema = {
  name: 'Mucus',
  properties: {
    feeling: { type: 'int', optional: true },
    texture: { type: 'int', optional: true },
    value: { type: 'int', optional: true },
    exclude: 'bool'
  }
}

const CervixSchema = {
  name: 'Cervix',
  properties: {
    opening: { type: 'int', optional: true },
    firmness: { type: 'int', optional: true },
    position: {type: 'int', optional: true },
    exclude: 'bool'
  }
}

const NoteSchema = {
  name: 'Note',
  properties: {
    value: 'string'
  }
}

const DesireSchema = {
  name: 'Desire',
  properties: {
    value: 'int'
  }
}

const SexSchema = {
  name: 'Sex',
  properties: {
    solo: { type: 'bool', optional: true },
    partner: { type: 'bool', optional: true },
    condom: { type: 'bool', optional: true },
    pill: { type: 'bool', optional: true },
    iud: { type: 'bool', optional: true },
    patch: { type: 'bool', optional: true },
    ring: { type: 'bool', optional: true },
    implant: { type: 'bool', optional: true },
    diaphragm: { type: 'bool', optional: true },
    none: { type: 'bool', optional: true },
    other: { type: 'bool', optional: true },
    note: { type: 'string', optional: true }
  }
}

const PainSchema = {
  name: 'Pain',
  properties: {
    abdominalPain: {type: 'bool', optional: true},
    bloating:{type: 'bool', optional: true},
    constipation:{type: 'bool', optional: true},
    diarrhea:{type: 'bool', optional: true},
    hungerCravings:{type: 'bool', optional: true},
    sleepProblems:{type: 'bool', optional: true},
    breathingProblems:{type: 'bool', optional: true},
    badSkin:{type: 'bool', optional: true},
    dizziness:{type: 'bool', optional: true},
    concentrationProblems:{type: 'bool', optional: true},
    /*cramps: { type: 'bool', optional: true },*/
    /*ovulationPain: { type: 'bool', optional: true },*/
    headache: { type: 'bool', optional: true },
    backache: { type: 'bool', optional: true },
    nausea: { type: 'bool', optional: true },
    tenderBreasts: { type: 'bool', optional: true },
    incontinence: {type: 'bool', optional: true},
   /* migraine: { type: 'bool', optional: true },*/
    other: { type: 'bool', optional: true },
    note: { type: 'string', optional: true }
  }
}




/*
categories: {
  abdominalPain: 'unterleibschmerzen',
      nausea: 'übelkeit',
      backache: 'rückenschmerzen',
      bloating: 'blähungen',
      constipation: 'verstopfung',
      diarrhea: 'durchfall',
      hungerCravings: 'hunger-cravings',
      sleepProblems: 'schlafprobleme',
      breathingProblems: 'atemprobleme',
      headache: 'kopfschmerzen',
      badSkin: 'schlechteHaut',
      dizziness: 'schwindel',
      concentrationProblems: 'konzentrationsprobleme',
      other: 'andere',
}
*/




const MoodSchema = {
  name: 'Mood',
  properties: {
    irritated: { type: 'bool', optional: true },
    driveless: { type: 'bool', optional: true },
    motivated: { type: 'bool', optional: true },
    emotional: { type: 'bool', optional: true },
    happy: { type: 'bool', optional: true },
    sad: { type: 'bool', optional: true },
    stressed: { type: 'bool', optional: true },
    balanced: { type: 'bool', optional: true },
    /*fine: { type: 'bool', optional: true },*/
    anxious: { type: 'bool', optional: true },
    energetic: { type: 'bool', optional: true },
    fatigue: { type: 'bool', optional: true },
    angry: { type: 'bool', optional: true },
    other: { type: 'bool', optional: true },
    note: { type: 'string', optional: true }
  }
}


const CycleDaySchema = {
  name: 'CycleDay',
  primaryKey: 'date',
  properties: {
    date: 'string',
    temperature: {
      type: 'object', objectType: 'Temperature',
      optional: true
    },
    isCycleStart: 'bool',
    bleeding: {
      type: 'object', objectType: 'Bleeding',
      optional: true
    },
    mucus: {
      type: 'object', objectType: 'Mucus',
      optional: true
    },
    cervix: {
      type: 'object', objectType: 'Cervix',
      optional: true
    },
    note: {
      type: 'object', objectType: 'Note',
      optional: true
    },
    desire: {
      type: 'object', objectType: 'Desire',
      optional: true
    },
    sex: {
      type: 'object', objectType: 'Sex',
      optional: true
    },
    pain: {
      type: 'object', objectType: 'Pain',
      optional: true
    },
    mood: {
      type: 'object', objectType: 'Mood',
      optional: true
    }
  }
}

export default {
  schema: [
    CycleDaySchema,
    TemperatureSchema,
    BleedingSchema,
    MucusSchema,
    CervixSchema,
    NoteSchema,
    DesireSchema,
    SexSchema,
    PainSchema,
    MoodSchema
  ],
  schemaVersion: 4,
  migration: (oldRealm) => {
    if (oldRealm.schemaVersion >= 4) return
  }
}
