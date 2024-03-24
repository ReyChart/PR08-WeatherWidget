import { useContext } from 'react';
import { WeatherContext } from '../Provider/WeatherProvider';

export const useWeather = () => useContext(WeatherContext);
