import { FunctionComponent } from 'react';
import Header from '../Header/Header';
import CurrentDay from '../CurrentDay/CurrentDay';

import style from './Layout.module.scss';

const Layout: FunctionComponent = () => {
  return (
    <main className={style.layout}>
      <Header />
      <CurrentDay />
    </main>
  );
};

export default Layout;
