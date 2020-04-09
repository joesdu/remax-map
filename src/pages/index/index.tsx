import TestItem, { TestItemData } from '@/components/test';
import { Image, Text, View } from 'remax/wechat';

import CircleButton from '@/components/circleButton';
import React from 'react';
import location from '@/assets/location.svg';
import styles from './index.module.less';

export default () => {
  const item: TestItemData = {
    facilityId: '1',
    avatar: 'https://gw.alipayobjects.com/mdn/rms_b5fcc5/afts/img/A*OGyZSI087zkAAAAAAAAAAABkARQnAQ',
    point: [0, 0],
    name: '测试',
    address: '测试地址-3#-4L',
    isFavorite: true,
    shareData: ''
  };

  const click = () => {
    console.log('输出');
  };

  return (
    <View className={styles.app}>
      <View className={styles.header}>
        <Image src="https://gw.alipayobjects.com/mdn/rms_b5fcc5/afts/img/A*OGyZSI087zkAAAAAAAAAAABkARQnAQ" className={styles.logo} />
        <View className={styles.text}>
          编辑 <Text className={styles.path}>src/pages/index/index.tsx</Text> 开始
        </View>
        <TestItem data={item}></TestItem>
        <CircleButton icon={location} onClick={click}></CircleButton>
      </View>
    </View>
  );
};
