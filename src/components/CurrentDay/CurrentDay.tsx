import { FunctionComponent, useContext } from 'react';
import { WeatherContext } from '../Provider/WeatherProvider';
import CurrentDayInfo from '../CurrentDayInfo/CurrentDayInfo';
import SkeletonLoader from '../SkeletonLoader/SkeletonLoader';
import { formatDateTimezone } from '../utils/formatDate';

import style from './CurrentDay.module.scss';

const CurrentDay: FunctionComponent = () => {
  const { weatherData, isLoading } = useContext(WeatherContext);

  if (!weatherData || isLoading) {
    return (
      <section className={style.current_day}>
        <SkeletonLoader width={400} height={278} />
        <CurrentDayInfo />
      </section>
    );
  }

  const iconUrl = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`;

  return (
    <section className={style.current_day}>
      <div className={style.wrapper}>
        <div className={style.wrapper_top}>
          <div>
            <p>{`${Math.round(weatherData.main.temp)}°C`}</p>
            <p>{formatDateTimezone(weatherData.timezone, 'day')}</p>
          </div>
          <img src={iconUrl} alt="Weather icon" />
        </div>
        <div className={style.wrapper_bottom}>
          <p>
            Время: <span>{formatDateTimezone(weatherData.timezone, 'time')}</span>
          </p>
          <p>
            Город: <span>{weatherData.name}</span>
          </p>
        </div>
      </div>
      <CurrentDayInfo />
    </section>
  );
};

export default CurrentDay;
