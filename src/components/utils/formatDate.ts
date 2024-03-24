import moment from 'moment';
import 'moment/dist/locale/ru';

moment.locale('ru');

export const formatDateTimezone = (timezone: number, variant: string) => {
  const formattedDate = moment
    .utc(new Date(Date.now() + timezone * 1000))
    .format(variant === 'day' ? 'dddd' : 'HH:mm');

  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
};

export const formatDateUnix = (unix: number, timezone: number) =>
  moment.utc(new Date(+moment.unix(unix) + timezone * 1000)).format('HH:mm');
