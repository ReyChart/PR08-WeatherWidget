import { FunctionComponent, useContext } from 'react';
import { WeatherContext } from '../../provider/weatherProvider';
import WeatherTodayInfo from '../WeatherTodayInfo/WeatherTodayInfo';
import SkeletonLoader from '../SkeletonLoader/SkeletonLoader';
import { formatDateTimezone } from '../../utils/formatDate';

import style from './WeatherToday.module.scss';

const WeatherToday: FunctionComponent = () => {
  const { weatherData, isLoading } = useContext(WeatherContext);

  if (!weatherData || isLoading) {
    return (
      <section className={style.current_day}>
        <SkeletonLoader width={400} height={296} />
        <WeatherTodayInfo />
      </section>
    );
  }

  const iconUrl = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;

  return (
    <section className={style.current_day}>
      <div className={style.wrapper}>
        <div className={style.wrapper_top}>
          <div>
            <p>
              {Math.round(weatherData.main.temp)}
              <span>°C</span>
            </p>
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
      <WeatherTodayInfo />
    </section>
  );
};

export default WeatherToday;
