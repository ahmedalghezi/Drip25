const LocalDate = require("js-joda").LocalDate
const moment = require('moment')

describe('Date', () => {
  beforeEach(async () => {
    await device.reloadReactNative()
    moment.locale('de')
  })

  it('should have same date when navigating between cycle day and symptom view', async () => {

    await element(by.text('add data for today')).tap()
    await expect(
      element(by.id('headerTitle').and(by.text('today')))
    ).toBeVisible()
    await element(by.id('backButton')).tap()
    await element(by.id('drip-icon-bleeding')).tap()

    const today = LocalDate.now()
    const yesterday = today.minusDays(1)
    // Format yesterday's date in German style
        const yesterdayFormatted = moment(yesterday.toString()).format('D. MMM YYYY')
      .toLowerCase()

    await expect(
      element(by.id('headerSubtitle').and(by.text(yesterdayFormatted)))
    ).toBeVisible()
  })

})
