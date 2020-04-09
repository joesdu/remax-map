import { Button, Image } from 'remax/wechat';

import React from 'react';
import styles from './index.module.less';

export interface CircleButtonProps {
  icon: string;
  onClick?: any;
  style?: React.CSSProperties;
}
const CircleButton: React.FC<CircleButtonProps> = ({ icon, onClick, style }) => {
  return (
    <Button style={style} className={styles.buttonStyle} onClick={onClick}>
      <Image className={styles.img} mode="aspectFit" src={icon}></Image>
    </Button>
  );
};

export default CircleButton;
