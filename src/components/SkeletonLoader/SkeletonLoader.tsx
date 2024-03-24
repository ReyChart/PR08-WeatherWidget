import { FunctionComponent } from 'react';
import Skeleton, { SkeletonProps } from 'react-loading-skeleton';

import 'react-loading-skeleton/dist/skeleton.css';
import style from './SkeletonLoader.module.scss';

const SkeletonLoader: FunctionComponent<SkeletonProps> = ({ ...props }) => {
  return <Skeleton className={style.skeleton} {...props} />;
};

export default SkeletonLoader;
