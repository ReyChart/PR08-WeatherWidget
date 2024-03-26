import { useContext } from 'react';
import { WeatherContext } from '../provider/weatherProvider';

export const useWeather = () => useContext(WeatherContext);
