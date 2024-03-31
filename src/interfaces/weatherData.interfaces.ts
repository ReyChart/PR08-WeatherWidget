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
