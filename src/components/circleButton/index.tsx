import { Button, Image, vibrateShort } from 'remax/wechat';

import React from 'react';
import styles from './index.less';

export interface CircleButtonProps {
  icon: string;
  onClick?: any;
  style?: React.CSSProperties;
  imageStyle?: React.CSSProperties;
  openType?: 'contact' | 'share' | 'getPhoneNumber' | 'getUserInfo' | 'launchApp' | 'openSetting' | 'feedback';
}
const CircleButton: React.FC<CircleButtonProps> = ({ icon, onClick, style, openType, imageStyle }) => {
  const myClick = () => {
    vibrateShort();
    onClick();
  };
  return (
    <Button style={style} className={styles.buttonStyle} openType={openType} onClick={myClick}>
      <Image className={styles.img} style={imageStyle} mode="aspectFit" src={icon}></Image>
    </Button>
  );
};

export default CircleButton;
