import moment from 'moment'

export function useDate() {
  const formatDate = (date, format = "MM/DD/YY h:mm a") => {
    return moment(date).format(format)
  }
  return { formatDate }
}