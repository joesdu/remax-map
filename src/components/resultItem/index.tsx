import { Image, View } from 'remax/wechat';

import React from 'react';
import goto from '@/assets/goto.svg';
import mark from '@/assets/mark.svg';
import styles from './index.module.less';

export interface ResultItemProps {
  title: string;
  subTitle: string;
  onClick: any;
  isDel?: boolean;
}
const ResultItem: React.FC<ResultItemProps> = ({ title = '测试标题', subTitle = '测试子标题', onClick, isDel = false }) => {
  const renderItem = () => {
    if (isDel) {
      return <View className={styles['item-right-del']}>删除</View>;
    } else {
      return (
        <View>
          <Image className={styles['item-right-top']} mode="aspectFill" src={goto} />
          <View className={styles['item-right-bottom']}>查看</View>
        </View>
      );
    }
  };

  return (
    <View className={styles.item}>
      <View className={styles['item-left']}>
        <Image className={styles['item-left-left']} mode="aspectFill" src={mark} />
        <View className={styles['item-left-right']}>
          <View className={styles['item-left-right-top']}>{title}</View>
          <View className={styles['item-left-right-bottom']}>{subTitle}</View>
        </View>
      </View>
      <View className={styles['item-right']} onClick={onClick}>
        {renderItem()}
      </View>
    </View>
  );
};

export default ResultItem;
