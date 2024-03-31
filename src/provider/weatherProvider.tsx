import React, { createContext, useState, useEffect, useCallback, FunctionComponent } from 'react';
import AutoModalError from '../components/AutoModalError/AutoModalError';
import { formatDateUnix } from '../utils/formatDate';
import axios from 'axios';

import {
  IWeatherData,
  IWeatherFiveDayItem,
  IWeatherFiveDayData,
} from '../interfaces/weatherData.interfaces';

const API_KEY = import.meta.env.VITE_API_KEY;

interface IWeatherContextProps {
  weatherData: IWeatherData | null;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  weatherFiveDayData: IWeatherFiveDayData | null;
  isLoadingFiveDay: boolean;
  setIsLoadingFiveDay: (isLoading: boolean) => void;
  fetchWeatherFiveDay: (city: string | null, latitude?: number, longitude?: number) => void;
  searchCity: (city: string) => void;
  searchByGeo: (latitude: number, longitude: number) => void;
  GeoSearchActive: boolean;
  setGeoSearchActive: (GeoSearchActive: boolean) => void;
  isGeoDenied: boolean;
  error404: string | null;
  setError404: (error: string | null) => void;
}

export const WeatherContext = createContext<IWeatherContextProps>({
  weatherData: null,
  isLoading: false,
  setIsLoading: () => {},
  weatherFiveDayData: null,
  isLoadingFiveDay: false,
  setIsLoadingFiveDay: () => {},
  fetchWeatherFiveDay: async () => {},
  searchCity: () => {},
  searchByGeo: () => {},
  GeoSearchActive: false,
  setGeoSearchActive: () => {},
  isGeoDenied: false,
  error404: null,
  setError404: () => {},
});

interface IWeatherProviderProps {
  children: React.ReactNode;
}

export const WeatherProvider: FunctionComponent<IWeatherProviderProps> = ({ children }) => {
  const [weatherData, setWeatherData] = useState<IWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [weatherFiveDayData, setWeatherFiveDayData] = useState<IWeatherFiveDayData | null>(null);
  const [isLoadingFiveDay, setIsLoadingFiveDay] = useState<boolean>(false);
  const [GeoSearchActive, setGeoSearchActive] = useState<boolean>(false);
  const [isGeoDenied, setIsGeoDenied] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [error404, setError404] = useState<string | null>(null);

  const fetchWeather = async (url: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get(url);
      setWeatherData(response.data);
    } catch (error) {
      console.error('Ошибка при запросе погоды:', error);
      setError404('Город введен некорректно');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWeatherFiveDay = useCallback(
    async (city: string | null, latitude?: number, longitude?: number) => {
      setIsLoadingFiveDay(true);
      try {
        let url = '';
        if (city) {
          url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&lang=ru&units=metric`;
        } else if (latitude && longitude) {
          url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&lang=ru&units=metric`;
        }

        const response = await axios.get(url);
        const timezone = response.data.city.timezone;

        const filterWeatherFiveDay = response.data.list.filter((item: IWeatherFiveDayItem) => {
          const timeDay = formatDateUnix(item.dt, timezone);
          return timeDay >= '11:00' && timeDay <= '13:00';
        });

        setWeatherFiveDayData({ list: filterWeatherFiveDay });
      } catch (error) {
        console.error('Ошибка при запросе прогноза погоды:', error);
        setError404('Город введен некорректно');
      } finally {
        setIsLoadingFiveDay(false);
      }
    },
    []
  );

  const searchCity = useCallback(async (city: string) => {
    setWeatherData(null);
    setWeatherFiveDayData(null);
    setGeoSearchActive(false);
    setIsLoadingFiveDay(true);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&lang=ru&units=metric`;
    await fetchWeather(url);
  }, []);

  const searchByGeo = useCallback(async (latitude: number, longitude: number) => {
    setWeatherData(null);
    setWeatherFiveDayData(null);
    setGeoSearchActive(true);
    setIsLoadingFiveDay(true);
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&lang=ru&units=metric`;
    await fetchWeather(url);
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        searchByGeo(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error(error);
        setIsGeoDenied(true);
        setShowModal(true);
      }
    );
  }, [searchByGeo]);

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        isLoading,
        setIsLoading,
        weatherFiveDayData,
        isLoadingFiveDay,
        setIsLoadingFiveDay,
        fetchWeatherFiveDay,
        searchCity,
        searchByGeo,
        GeoSearchActive,
        setGeoSearchActive,
        isGeoDenied,
        error404,
        setError404,
      }}
    >
      {children}
      {showModal && (
        <AutoModalError message="Геолокация отключена пользователем или не поддерживается вашим браузером!" />
      )}
    </WeatherContext.Provider>
  );
};
