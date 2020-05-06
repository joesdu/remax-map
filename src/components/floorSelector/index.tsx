import { Button, Image, Text } from 'remax/wechat';
import { LaminatedIcon, UpIcon } from '@/assets/icons';

import React from 'react';
import styles from './index.less';

export interface FloorSelectorProps {
  text: string;
  onClick: any;
  style?: React.CSSProperties;
}
const FloorSelector: React.FC<FloorSelectorProps> = ({ text, onClick, style }) => {
  return (
    <Button style={style} className={styles.buttonStyle} onClick={onClick}>
      <Image className={styles.img} mode="aspectFit" style={{ marginLeft: 10 }} src={LaminatedIcon}></Image>
      <Text className={styles.txt}>{text}</Text>
      <Image className={styles.img} mode="aspectFit" style={{ marginRight: 10 }} src={UpIcon}></Image>
    </Button>
  );
};

export default FloorSelector;
