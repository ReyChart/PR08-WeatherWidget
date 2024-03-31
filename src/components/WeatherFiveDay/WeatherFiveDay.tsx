import { useEffect, useState, FunctionComponent } from 'react';
import { useWeather } from '../../hooks/useWeather';
import { formatDate } from '../../utils/formatDate';
import SkeletonLoader from '../SkeletonLoader/SkeletonLoader';
import { urlIcon } from '../../constants/urlIcon';
import cn from 'classnames';

import style from './WeatherFiveDay.module.scss';

const WeatherFiveDay: FunctionComponent = () => {
  const { weatherData, weatherFiveDayData, fetchWeatherFiveDay, isLoadingFiveDay } = useWeather();
  const [viewMode, setViewMode] = useState<'today' | '5days'>('today');

  useEffect(() => {
    if (viewMode === '5days' && weatherData && !weatherFiveDayData) {
      fetchWeatherFiveDay(weatherData.name);
    }
  }, [viewMode, weatherData, weatherFiveDayData, fetchWeatherFiveDay]);

  return (
    <section className={style.weather_fiveday}>
      <div className={style.btn_wrapper}>
        <button
          className={cn({ [style.active]: viewMode === 'today' })}
          onClick={() => setViewMode('today')}
        >
          Сегодня
        </button>
        <button
          className={cn({ [style.active]: viewMode === '5days' })}
          onClick={() => setViewMode('5days')}
        >
          На 5 дней
        </button>
      </div>
      <div className={style.item_wrapper}>
        {viewMode === '5days' && isLoadingFiveDay ? (
          [...Array(5)].map((_, index) => (
            <SkeletonLoader key={index} className={style.weather_fiveday_skeleton} />
          ))
        ) : viewMode === '5days' && weatherFiveDayData ? (
          weatherFiveDayData.list.map((item) => (
            <div key={item.dt} className={style.weather_item}>
              <p>{formatDate(new Date(item.dt_txt), 'day')}</p>
              <img src={`${urlIcon}${item.weather[0].icon}@2x.png`} alt="Weather icon" />
              <p>{Math.round(item.main.temp)}°C</p>
            </div>
          ))
        ) : (
          <p className={style.item_text}>Погода на сегодня</p>
        )}
      </div>
    </section>
  );
};

export default WeatherFiveDay;
