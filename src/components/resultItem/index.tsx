import { GotoIcon, MarkIcon } from '@/assets';
import { Image, View, vibrateShort } from 'remax/wechat';

import React from 'react';
import styles from './index.less';

export interface ResultItemProps {
  title: string;
  subTitle: string;
  onClick: any;
  isDel?: boolean;
}
const ResultItem: React.FC<ResultItemProps> = ({ title = '测试标题', subTitle = '测试子标题', onClick, isDel = false }) => {
  const renderItem = (): JSX.Element => {
    if (isDel) {
      return <View className={styles['item-right-del']}>删除</View>;
    } else {
      return (
        <View>
          <Image className={styles['item-right-top']} mode="aspectFill" src={GotoIcon} />
          <View className={styles['item-right-bottom']}>查看</View>
        </View>
      );
    }
  };
  const myClick = () => {
    if (!isDel) {
      vibrateShort();
      onClick();
    }
  };

  const deleteClick = () => {
    if (isDel) {
      vibrateShort();
      onClick();
    }
  };

  return (
    <View className={styles.item} onClick={myClick}>
      <View className={styles['item-left']}>
        <Image className={styles['item-left-left']} mode="aspectFill" src={MarkIcon} />
        <View className={styles['item-left-right']}>
          <View className={styles['item-left-right-top']}>{title}</View>
          <View className={styles['item-left-right-bottom']}>{subTitle}</View>
        </View>
      </View>
      <View className={styles['item-right']} onClick={deleteClick}>
        {renderItem()}
      </View>
    </View>
  );
};

export default ResultItem;
