import { useEffect, useState, FunctionComponent } from 'react';
import style from './AutoModalError.module.scss';

interface AutoModalErrorProps {
  message: string;
  duration?: number;
}

const AutoModalError: FunctionComponent<AutoModalErrorProps> = ({ message, duration = 4000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  return (
    <div className={style.modal}>
      <div className={style.content}>{message}</div>
    </div>
  );
};

export default AutoModalError;
