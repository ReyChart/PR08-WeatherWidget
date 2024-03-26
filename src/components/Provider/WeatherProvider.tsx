import React, { createContext, useState, useEffect, useCallback, FunctionComponent } from 'react';
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
  setIsLoading: (isLoading: boolean) => void;
  searchCity: (city: string) => void;
  searchByGeo: (latitude: number, longitude: number) => void;
  GeoSearchActive: boolean;
  setGeoSearchActive: (GeoSearchActive: boolean) => void;
  fetchWeatherFiveDay: (city: string | null, latitude?: number, longitude?: number) => void;
}

export const WeatherContext = createContext<IWeatherContextProps>({
  weatherData: null,
  weatherFiveDayData: null,
  isLoading: false,
  setIsLoading: () => {},
  searchCity: () => {},
  searchByGeo: () => {},
  GeoSearchActive: false,
  setGeoSearchActive: () => {},
  fetchWeatherFiveDay: async () => {},
});

interface IWeatherProviderProps {
  children: React.ReactNode;
}

export const WeatherProvider: FunctionComponent<IWeatherProviderProps> = ({ children }) => {
  const [weatherData, setWeatherData] = useState<IWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [GeoSearchActive, setGeoSearchActive] = useState<boolean>(false);
  const [weatherFiveDayData, setWeatherFiveDayData] = useState<IWeatherFiveDayData | null>(null);

  const fetchWeather = async (url: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get(url);
      setWeatherData(response.data);
    } catch (error) {
      console.error('Ошибка при запросе погоды:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWeatherFiveDay = useCallback(
    async (city: string | null, latitude?: number, longitude?: number) => {
      setIsLoading(true);
      try {
        let url = '';
        if (city) {
          url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=a09dde67358647287aa51f21c343ffac&lang=ru&units=metric`;
        } else if (latitude && longitude) {
          url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=a09dde67358647287aa51f21c343ffac&lang=ru&units=metric`;
        }

        const response = await axios.get(url);
        const filterWeatherFiveDay = response.data.list.filter((item: IWeatherFiveDayItem) =>
          item.dt_txt.includes('12:00:00')
        );
        setWeatherFiveDayData({ list: filterWeatherFiveDay });
      } catch (error) {
        console.error('Ошибка при запросе прогноза погоды:', error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const searchCity = useCallback(
    async (city: string) => {
      setGeoSearchActive(false);
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=a09dde67358647287aa51f21c343ffac&lang=ru&units=metric`;
      await fetchWeather(url);
      await fetchWeatherFiveDay(city);
    },
    [fetchWeatherFiveDay]
  );

  const searchByGeo = useCallback(
    async (latitude: number, longitude: number) => {
      setGeoSearchActive(true);
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=a09dde67358647287aa51f21c343ffac&lang=ru&units=metric`;
      await fetchWeather(url);
      await fetchWeatherFiveDay(null, latitude, longitude);
    },
    [fetchWeatherFiveDay]
  );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        searchByGeo(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error(error);
      }
    );
  }, [searchByGeo]);

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        weatherFiveDayData,
        isLoading,
        setIsLoading,
        searchCity,
        searchByGeo,
        GeoSearchActive,
        setGeoSearchActive,
        fetchWeatherFiveDay,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};
