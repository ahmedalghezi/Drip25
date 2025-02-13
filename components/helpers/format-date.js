import { LocalDate } from '@js-joda/core'
import moment from 'moment'
import 'moment/locale/de'
moment.locale('de'); // Set the moment locale to German
import { general as labels } from '../../i18n/en/cycle-day'


export default function (date) {
  const today = LocalDate.now()
  const dateToDisplay = LocalDate.parse(date)
  return today.equals(dateToDisplay)
    ? labels.today
    : moment(date).format('LL')// 'LL' is the German long date format (e.g., 12. Februar 2025)
}

export function formatDateForShortText(date) {
 // Using the German date format 'dddd, D. MMMM YYYY' (e.g., Montag, 12. Februar 2025)
   return moment(date.toString()).format('dddd, D. MMMM YYYY');
}

export function dateToTitle(dateString) {
  const today = LocalDate.now()
  const dateToDisplay = LocalDate.parse(dateString)
  return today.equals(dateToDisplay)
    ? labels.today
    : moment(dateString).format('ddd, D. MMM YY');  // 'ddd, D. MMM YY' will display: "Mi, 12. Feb 25"
    }

export function humanizeDate(dateString) {
  if (!dateString) return ''

  const today = LocalDate.now()

  try {
    const dateToDisplay = LocalDate.parse(dateString)
    return today.equals(dateToDisplay)
      ? labels.today
       : moment(dateString).format('D. MMM YY');  // Short date format: 12. Feb 25
  } catch (e) {
    return ''
  }
}
