import { Button, Image, Text, vibrateShort } from 'remax/wechat';
import { LaminatedIcon, UpIcon } from '@/assets';

import React from 'react';
import styles from './index.less';

export interface FloorSelectorProps {
  text: string;
  onClick: any;
  style?: React.CSSProperties;
}
const FloorSelector: React.FC<FloorSelectorProps> = ({ text, onClick, style }) => {
  const myClick = () => {
    vibrateShort();
    onClick();
  };
  return (
    <Button style={style} className={styles.buttonStyle} onClick={myClick}>
      <Image className={styles.img} mode="aspectFit" style={{ marginLeft: 10 }} src={LaminatedIcon}></Image>
      <Text className={styles.txt}>{text}</Text>
      <Image className={styles.img} mode="aspectFit" style={{ marginRight: 10 }} src={UpIcon}></Image>
    </Button>
  );
};

export default FloorSelector;
