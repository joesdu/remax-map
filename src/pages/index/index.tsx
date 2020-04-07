import * as React from 'react';

import { Image, Text, View } from 'remax/wechat';

import styles from './index.module.less';

import FacilityItem from '@/components/facilityItem';

export default () => {
  return (
    <View className={styles.app}>
      <View className={styles.header}>
        <Image src="https://gw.alipayobjects.com/mdn/rms_b5fcc5/afts/img/A*OGyZSI087zkAAAAAAAAAAABkARQnAQ" className={styles.logo} />
        <View className={styles.text}>
          编辑 <Text className={styles.path}>src/pages/index/index.tsx</Text> 开始
        </View>
        <FacilityItem itemUrl="https://gw.alipayobjects.com/mdn/rms_b5fcc5/afts/img/A*OGyZSI087zkAAAAAAAAAAABkARQnAQ" itemPoint={[0, 0]}></FacilityItem>
      </View>
    </View>
  );
};
