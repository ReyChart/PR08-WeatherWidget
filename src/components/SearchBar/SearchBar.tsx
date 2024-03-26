import React, { useState, FunctionComponent } from 'react';
import { useWeather } from '../../hooks/useWeather';
import { MdMyLocation } from 'react-icons/md';
import cn from 'classnames';

import style from './SearchBar.module.scss';

const SearchBar: FunctionComponent = () => {
  const [city, setCity] = useState('');
  const { searchCity, searchByGeo, setIsLoading, GeoSearchActive } = useWeather();

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
    setIsLoading(true);
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
      <input
        className={style.search_input}
        type="text"
        value={city}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="Введите город"
      />
      <button
        className={style.find_btn}
        onClick={() => {
          setIsLoading(true);
          searchCity(city.trim());
        }}
      >
        Поиск
      </button>
    </>
  );
};

export default SearchBar;
