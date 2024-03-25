import { FunctionComponent, useContext } from 'react';
import { WeatherContext } from '../Provider/WeatherProvider';
import { formatDateUnix } from '../utils/formatDate';
import { convertKilometers } from '../utils/convertKilometres';
import { convertPressure } from '../utils/convertPressure';
import { FaCloud, FaWind, FaEye, FaThermometerEmpty } from 'react-icons/fa';
import { FiSunrise, FiSunset } from 'react-icons/fi';
import { FaDroplet } from 'react-icons/fa6';
import SkeletonLoader from '../SkeletonLoader/SkeletonLoader';

import style from './CurrentDayInfo.module.scss';

const CurrentDayInfo: FunctionComponent = () => {
  const { weatherData, isLoading } = useContext(WeatherContext);

  if (!weatherData || isLoading) {
    return (
      <div className={style.wrapper}>
        {[...Array(6)].map((_, index) => (
          <SkeletonLoader key={index} width={226} height={138} />
        ))}
      </div>
    );
  }

  const { clouds, wind, sys, main, visibility, timezone } = weatherData;

  return (
    <div className={style.wrapper}>
      <div className={style.weather_item}>
        <div>
          <FaCloud />
          <h2>Облачность</h2>
        </div>
        <span>{clouds.all}%</span>
      </div>
      <div className={style.weather_item}>
        <div>
          <FaWind />
          <h2>Скорость ветра</h2>
        </div>
        <span>{wind.speed} м/с</span>
      </div>
      <div className={style.weather_item}>
        <div>
          <FiSunrise />
          <h2>
            Восход: <span>{formatDateUnix(sys.sunrise, timezone)}</span>
          </h2>
        </div>
        <div>
          <FiSunset />
          <h2>
            Закат: <span>{formatDateUnix(sys.sunset, timezone)}</span>
          </h2>
        </div>
      </div>
      <div className={style.weather_item}>
        <div>
          <FaDroplet />
          <h2>Влажность</h2>
        </div>
        <span>{main.humidity}%</span>
      </div>
      <div className={style.weather_item}>
        <div>
          <FaEye />
          <h2>Видимость</h2>
        </div>
        <span>{convertKilometers(visibility)} км</span>
      </div>
      <div className={style.weather_item}>
        <div>
          <FaThermometerEmpty />
          <h2>Давление</h2>
        </div>
        <span>{convertPressure(main.pressure)} мм</span>
      </div>
    </div>
  );
};

export default CurrentDayInfo;
