import { FunctionComponent } from 'react';
import SearchBar from '../SearchBar/SearchBar';

import style from './Header.module.scss';

const Header: FunctionComponent = () => {
  return (
    <header className={style.header}>
      <div className={style.wrapper}>
        <img className={style.header_img} src="./headerLogo.png" alt="Weather logo" />
        <h1>Weather Widget</h1>
      </div>
      <div className={style.wrapper}>
        <SearchBar />
      </div>
    </header>
  );
};

export default Header;
