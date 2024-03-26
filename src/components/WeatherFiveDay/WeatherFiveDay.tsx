import { useContext, useState, FunctionComponent, useEffect } from 'react';
import { WeatherContext } from '../../provider/weatherProvider';
import { formatDate } from '../../utils/formatDate';
import SkeletonLoader from '../SkeletonLoader/SkeletonLoader';

import style from './WeatherFiveDay.module.scss';

const WeatherFiveDay: FunctionComponent = () => {
  const { weatherData, weatherFiveDayData, fetchWeatherFiveDay, isLoadingFiveDay } =
    useContext(WeatherContext);
  const [viewMode, setViewMode] = useState<'today' | '5days'>('today');

  useEffect(() => {
    if (viewMode === '5days' && weatherData) {
      fetchWeatherFiveDay(weatherData.name);
    }
  }, [viewMode, weatherData, fetchWeatherFiveDay]);

  return (
    <div className={style.wrapper}>
      <div className={style.btn_wrapper}>
        <button onClick={() => setViewMode('today')}>Сегодня</button>
        <button onClick={() => setViewMode('5days')}>На 5 дней</button>
      </div>
      <div className={style.item_wrapper}>
        {viewMode === '5days' && isLoadingFiveDay ? (
          [...Array(5)].map((_, index) => <SkeletonLoader key={index} height={100} width={166} />)
        ) : viewMode === '5days' && weatherFiveDayData ? (
          weatherFiveDayData.list.map((item) => (
            <div key={item.dt} className={style.weather_item}>
              <p>{formatDate(new Date(item.dt_txt), 'day')}</p>
              <img
                src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                alt="Weather icon"
              />
              <p>{Math.round(item.main.temp)}°C</p>
            </div>
          ))
        ) : (
          <p>Погода на сегодня</p>
        )}
      </div>
    </div>
  );
};

export default WeatherFiveDay;
