import React, { createContext, useState, useEffect, useCallback, FunctionComponent } from 'react';
import axios from 'axios';

export interface IWeatherData {
  main: {
    temp: number;
  };
  name: string;
  sys: {
    country: string;
  };
  timezone: number;
  weather: [
    {
      description: string;
      icon: string;
    }
  ];
}

interface IWeatherContextProps {
  weatherData: IWeatherData | null;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  searchCity: (city: string) => void;
  searchByGeo: (latitude: number, longitude: number) => void;
  GeoSearchActive: boolean;
  setGeoSearchActive: (GeoSearchActive: boolean) => void;
}

export const WeatherContext = createContext<IWeatherContextProps>({
  weatherData: null,
  isLoading: false,
  setIsLoading: () => {},
  searchCity: () => {},
  searchByGeo: () => {},
  GeoSearchActive: false,
  setGeoSearchActive: () => {},
});

interface IWeatherProviderProps {
  children: React.ReactNode;
}

export const WeatherProvider: FunctionComponent<IWeatherProviderProps> = ({ children }) => {
  const [weatherData, setWeatherData] = useState<IWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [GeoSearchActive, setGeoSearchActive] = useState<boolean>(false);

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

  const searchCity = useCallback(async (city: string) => {
    setGeoSearchActive(false);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=a09dde67358647287aa51f21c343ffac&lang=ru&units=metric`;
    await fetchWeather(url);
  }, []);

  const searchByGeo = useCallback(async (latitude: number, longitude: number) => {
    setGeoSearchActive(true);
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
      }
    );
  }, [searchByGeo]);

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        isLoading,
        setIsLoading,
        searchCity,
        searchByGeo,
        GeoSearchActive,
        setGeoSearchActive,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};
