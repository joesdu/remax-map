import { Image, Text, View } from 'remax/wechat';

import CircleButton from '@/components/circleButton';
import React from 'react';
import location from '@/assets/location.svg';
import styles from './index.module.less';

export default () => {
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
        <CircleButton icon={location} onClick={click}></CircleButton>
      </View>
    </View>
  );
};
