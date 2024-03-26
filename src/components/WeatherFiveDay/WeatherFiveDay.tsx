import { useContext, useState, FunctionComponent } from 'react';
import { WeatherContext } from '../Provider/WeatherProvider';
import { formatDate } from '../utils/formatDate';

import style from './WeatherFiveDay.module.scss';

const WeatherFiveDay: FunctionComponent = () => {
  const { weatherFiveDayData } = useContext(WeatherContext);
  const [viewMode, setViewMode] = useState<'today' | '5days'>('today');

  return (
    <div className={style.wrapper}>
      <div className={style.btn_wrapper}>
        <button onClick={() => setViewMode('today')}>Сегодня</button>
        <button onClick={() => setViewMode('5days')}>На 5 дней</button>
      </div>
      <div className={style.item_wrapper}>
        {viewMode === '5days' && weatherFiveDayData ? (
          (console.log(weatherFiveDayData),
          weatherFiveDayData.list.map((item) => (
            <div key={item.dt} className={style.weather_item}>
              <p>{formatDate(new Date(item.dt_txt), 'day')}</p>
              <img
                src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                alt="Weather icon"
              />
              <p>{Math.round(item.main.temp)}°C</p>
            </div>
          )))
        ) : (
          <p>Погода на сегодня</p>
        )}
      </div>
    </div>
  );
};

export default WeatherFiveDay;
