import { FunctionComponent } from 'react';
import Header from '../Header/Header';
import WeatherToday from '../WeatherToday/WeatherToday';
import WeatherFiveDay from '../WeatherFiveDay/WeatherFiveDay';

import style from './Layout.module.scss';

const Layout: FunctionComponent = () => {
  return (
    <main>
      <div className={style.container}>
        <Header />
        <WeatherToday />
        <WeatherFiveDay />
      </div>
    </main>
  );
};

export default Layout;
