import { Image, View } from 'remax/wechat';

import React from 'react';
import styles from '../index.less';

export interface FacilityItemProps {
  itemUrl?: string;
  data: any;
  onItemClick: any;
}

const FacilityItem: React.FC<FacilityItemProps> = ({ itemUrl, data, onItemClick }) => {
  const { point, avatar, name } = data;
  return (
    <View className={styles['floor-item']} style={{ left: `${point[0] - 15}px`, top: `${point[1] - 15}px` }} onClick={onItemClick}>
      <Image className={styles['floor-item-img']} src={itemUrl ?? avatar} />
      <View className={styles['floor-item-name']}>{name}</View>
    </View>
  );
};

export default FacilityItem;
