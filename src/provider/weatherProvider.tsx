import React, { createContext, useState, useEffect, useCallback, FunctionComponent } from 'react';
import AutoModalError from '../components/AutoModalError/AutoModalError';
import { formatDateUnix } from '../utils/formatDate';
import axios from 'axios';

export interface IWeatherData {
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  name: string;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  weather: [
    {
      description: string;
      icon: string;
    }
  ];
  wind: {
    speed: number;
  };
  clouds: {
    all: number;
  };
  visibility: number;
}

export interface IWeatherFiveDayItem {
  dt_txt: string;
  dt: number;
  main: { temp: number };
  weather: [{ icon: string }];
}

export interface IWeatherFiveDayData {
  list: IWeatherFiveDayItem[];
}

interface IWeatherContextProps {
  weatherData: IWeatherData | null;
  weatherFiveDayData: IWeatherFiveDayData | null;
  isLoading: boolean;
  isLoadingFiveDay: boolean;
  isGeoDenied: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setIsLoadingFiveDay: (isLoading: boolean) => void;
  searchCity: (city: string) => void;
  searchByGeo: (latitude: number, longitude: number) => void;
  GeoSearchActive: boolean;
  setGeoSearchActive: (GeoSearchActive: boolean) => void;
  fetchWeatherFiveDay: (city: string | null, latitude?: number, longitude?: number) => void;
  error404: string | null;
  setError404: (error: string | null) => void;
}

export const WeatherContext = createContext<IWeatherContextProps>({
  weatherData: null,
  weatherFiveDayData: null,
  isLoading: false,
  isLoadingFiveDay: false,
  setIsLoadingFiveDay: () => {},
  isGeoDenied: false,
  setIsLoading: () => {},
  searchCity: () => {},
  searchByGeo: () => {},
  GeoSearchActive: false,
  setGeoSearchActive: () => {},
  fetchWeatherFiveDay: async () => {},
  error404: null,
  setError404: () => {},
});

interface IWeatherProviderProps {
  children: React.ReactNode;
}

export const WeatherProvider: FunctionComponent<IWeatherProviderProps> = ({ children }) => {
  const [weatherData, setWeatherData] = useState<IWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [GeoSearchActive, setGeoSearchActive] = useState<boolean>(false);
  const [weatherFiveDayData, setWeatherFiveDayData] = useState<IWeatherFiveDayData | null>(null);
  const [isGeoDenied, setIsGeoDenied] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoadingFiveDay, setIsLoadingFiveDay] = useState<boolean>(false);
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
          url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=a09dde67358647287aa51f21c343ffac&lang=ru&units=metric`;
        } else if (latitude && longitude) {
          url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=a09dde67358647287aa51f21c343ffac&lang=ru&units=metric`;
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
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=a09dde67358647287aa51f21c343ffac&lang=ru&units=metric`;
    await fetchWeather(url);
  }, []);

  const searchByGeo = useCallback(async (latitude: number, longitude: number) => {
    setWeatherData(null);
    setWeatherFiveDayData(null);
    setGeoSearchActive(true);
    setIsLoadingFiveDay(true);
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=a09dde67358647287aa51f21c343ffac&lang=ru&units=metric`;
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
        weatherFiveDayData,
        isLoading,
        isLoadingFiveDay,
        isGeoDenied,
        setIsLoading,
        setIsLoadingFiveDay,
        searchCity,
        searchByGeo,
        GeoSearchActive,
        setGeoSearchActive,
        fetchWeatherFiveDay,
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
