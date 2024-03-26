import { FunctionComponent } from 'react';
import Header from '../Header/Header';
import WeatherToday from '../WeatherToday/WeatherToday';
import WeatherFiveDay from '../WeatherFiveDay/WeatherFiveDay';

import style from './Layout.module.scss';

const Layout: FunctionComponent = () => {
  return (
    <main className={style.layout}>
      <Header />
      <WeatherToday />
      <WeatherFiveDay />
    </main>
  );
};

export default Layout;
