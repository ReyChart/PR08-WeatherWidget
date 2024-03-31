import React, { useEffect, useState, FunctionComponent } from 'react';
import { useWeather } from '../../hooks/useWeather';
import { MdMyLocation } from 'react-icons/md';
import cn from 'classnames';

import style from './SearchBar.module.scss';

const SearchBar: FunctionComponent = () => {
  const [city, setCity] = useState('');
  const [showError, setShowError] = useState(false);
  const {
    searchCity,
    searchByGeo,
    GeoSearchActive,
    error404,
    setError404,
    setIsLoading,
    setIsLoadingFiveDay,
  } = useWeather();

  useEffect(() => {
    if (error404) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
        setError404(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error404, setError404]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && city.trim() !== '') {
      setIsLoading(true);
      searchCity(city.trim());
      setCity('');
    }
  };

  const handleGeoSearch = () => {
    setCity('');
    setIsLoading(true);
    setError404(null);
    setIsLoadingFiveDay(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        searchByGeo(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error(error);
        setIsLoading(false);
      }
    );
  };

  return (
    <>
      <button className={style.geo_btn} onClick={handleGeoSearch}>
        <MdMyLocation className={cn(style.geo_icon, { [style.active]: GeoSearchActive })} />
      </button>
      <div className={style.input_wrapper}>
        <input
          className={style.search_input}
          type="text"
          value={city}
          onChange={(event) => {
            setError404(null);
            handleInputChange(event);
          }}
          onKeyDown={handleKeyPress}
          placeholder="Введите город"
        />
        {showError && error404 && <div className={style.error_message}>{error404}</div>}
      </div>
      <button
        className={style.find_btn}
        onClick={() => {
          setIsLoading(true);
          setError404(null);
          searchCity(city.trim());
        }}
      >
        Поиск
      </button>
    </>
  );
};

export default SearchBar;
