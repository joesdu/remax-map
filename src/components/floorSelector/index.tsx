import { Button, Image, Text } from 'remax/wechat';

import React from 'react';
import laminated from '@/assets/laminated.svg';
import styles from './index.module.less';
import up from '@/assets/up.svg';

export interface FloorSelectorProps {
  text: string;
  onClick: any;
  style?: React.CSSProperties;
}
const FloorSelector: React.FC<FloorSelectorProps> = ({ text, onClick, style }) => {
  return (
    <Button style={style} className={styles.buttonStyle} onClick={onClick}>
      <Image className={styles.img} mode="aspectFit" style={{ marginLeft: 10 }} src={laminated}></Image>
      <Text className={styles.txt}>{text}</Text>
      <Image className={styles.img} mode="aspectFit" style={{ marginRight: 10 }} src={up}></Image>
    </Button>
  );
};

export default FloorSelector;
