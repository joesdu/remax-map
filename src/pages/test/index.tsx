import { Image, View } from 'remax/wechat';

import React from 'react';
import ResultItem from '@/components/resultItem';
import styles from './index.module.less';

export default () => {
  // 用于测试
  const onclick = () => {
    console.log('点击了!');
  };

  return (
    <View className={styles.app}>
      <View className={styles.header}>
        <Image src="https://gw.alipayobjects.com/mdn/rms_b5fcc5/afts/img/A*OGyZSI087zkAAAAAAAAAAABkARQnAQ" className={styles.logo} />
      </View>
      <ResultItem title="TEST" subTitle="Test" onClick={onclick}></ResultItem>
    </View>
  );
};
