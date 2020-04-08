import React from 'react';

import FacilityItem, { FacilityItemData } from '@/components/facilityItem';
import { Image, Text, View } from 'remax/wechat';

import styles from './index.module.less';

export default () => {
  const item: FacilityItemData = {
    facilityId: '1',
    avatar: 'https://gw.alipayobjects.com/mdn/rms_b5fcc5/afts/img/A*OGyZSI087zkAAAAAAAAAAABkARQnAQ',
    point: [0, 0],
    name: '测试',
    address: '测试地址-3#-4L',
    isFavorite: true,
    shareData: ''
  };

  return (
    <View className={styles.app}>
      <View className={styles.header}>
        <Image src="https://gw.alipayobjects.com/mdn/rms_b5fcc5/afts/img/A*OGyZSI087zkAAAAAAAAAAABkARQnAQ" className={styles.logo} />
        <View className={styles.text}>
          编辑 <Text className={styles.path}>src/pages/index/index.tsx</Text> 开始
        </View>
        <FacilityItem data={item}></FacilityItem>
      </View>
    </View>
  );
};
