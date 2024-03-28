import { FunctionComponent, useContext } from 'react';
import { WeatherContext } from '../../provider/weatherProvider';
import WeatherTodayInfo from '../WeatherTodayInfo/WeatherTodayInfo';
import SkeletonLoader from '../SkeletonLoader/SkeletonLoader';
import { formatDateTimezone } from '../../utils/formatDate';
import { urlIcon } from '../../constants/urlIcon';

import style from './WeatherToday.module.scss';

const WeatherToday: FunctionComponent = () => {
  const { weatherData, isLoading } = useContext(WeatherContext);

  if (!weatherData || isLoading) {
    return (
      <section className={style.weather_today}>
        <SkeletonLoader className={style.weather_today_skeleton} />
        <WeatherTodayInfo />
      </section>
    );
  }

  return (
    <section className={style.weather_today}>
      <div className={style.wrapper}>
        <div className={style.wrapper_top}>
          <div>
            <p>
              {Math.round(weatherData.main.temp)}
              <span>°C</span>
            </p>
            <p>{formatDateTimezone(weatherData.timezone, 'day')}</p>
          </div>
          <img src={`${urlIcon}${weatherData.weather[0].icon}@2x.png`} alt="Weather icon" />
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
      <WeatherTodayInfo />
    </section>
  );
};

export default WeatherToday;
