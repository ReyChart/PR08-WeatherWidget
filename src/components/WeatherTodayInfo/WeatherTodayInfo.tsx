import { FunctionComponent, useContext } from 'react';
import { WeatherContext } from '../../provider/weatherProvider';
import { formatDateUnix } from '../../utils/formatDate';
import { convertKilometers } from '../../utils/convertKilometres';
import { convertPressure } from '../../utils/convertPressure';
import { FaCloud, FaWind, FaEye, FaThermometerEmpty } from 'react-icons/fa';
import { FiSunrise, FiSunset } from 'react-icons/fi';
import { FaDroplet } from 'react-icons/fa6';
import SkeletonLoader from '../SkeletonLoader/SkeletonLoader';

import style from './WeatherTodayInfo.module.scss';

const WeatherTodayInfo: FunctionComponent = () => {
  const { weatherData, isLoading } = useContext(WeatherContext);

  if (!weatherData || isLoading) {
    return (
      <div className={style.wrapper}>
        {[...Array(6)].map((_, index) => (
          <SkeletonLoader key={index} className={style.weather_info_skeleton} />
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
          <h3>Облачность</h3>
        </div>
        <p>{clouds.all}%</p>
      </div>
      <div className={style.weather_item}>
        <div>
          <FaWind />
          <h3>Скорость ветра</h3>
        </div>
        <p>{wind.speed}м/с</p>
      </div>
      <div className={style.weather_item}>
        <div>
          <FiSunrise />
          <p>
            Восход: <span>{formatDateUnix(sys.sunrise, timezone)}</span>
          </p>
        </div>
        <div>
          <FiSunset />
          <p>
            Закат: <span>{formatDateUnix(sys.sunset, timezone)}</span>
          </p>
        </div>
      </div>
      <div className={style.weather_item}>
        <div>
          <FaDroplet />
          <h3>Влажность</h3>
        </div>
        <p>{main.humidity}%</p>
      </div>
      <div className={style.weather_item}>
        <div>
          <FaEye />
          <h3>Видимость</h3>
        </div>
        <p>{convertKilometers(visibility)}км</p>
      </div>
      <div className={style.weather_item}>
        <div>
          <FaThermometerEmpty />
          <h3>Давление</h3>
        </div>
        <p>{convertPressure(main.pressure)}мм</p>
      </div>
    </div>
  );
};

export default WeatherTodayInfo;
