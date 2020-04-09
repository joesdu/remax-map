import { Image, Text, View } from 'remax/wechat';

import React from 'react';
import styles from '../index.module.less';

export interface FacilityItemData {
  facilityId: string;
  avatar: string;
  point: [number, number];
  name: string;
  address: string;
  isFavorite: boolean;
  shareData: any;
}
export interface FacilityItemProps {
  itemUrl?: string;
  data: any;
  key?: any;
  onItemClick: any;
}

const FacilityItem: React.FC<FacilityItemProps> = ({ itemUrl, data, key, onItemClick }) => {
  const {
    data: { point, avatar, name }
  } = data;
  return (
    <View key={key || data.id}>
      <View className={styles['floor-item']} style={{ left: `${point[0] - 15}px`, top: `${point[1] - 15}px` }} onClick={onItemClick}>
        <Image className={styles['floor-item-img']} src={itemUrl ? itemUrl : avatar} />
        <Text className={styles['floor-item-name']}>{name}</Text>
      </View>
    </View>
  );
};

export default FacilityItem;
