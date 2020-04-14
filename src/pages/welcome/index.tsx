import { Image, View } from 'remax/wechat';

import React from 'react';
import styles from './index.module.less';

class Welcome extends React.Component {
  //TODO 欢迎页面预留,可以用于校验微信是否开启相关权限,获取基础数据等操作.

  render() {
    return (
      <View className={styles.app}>
        <View className={styles.header}>
          <Image src="https://gw.alipayobjects.com/mdn/rms_b5fcc5/afts/img/A*OGyZSI087zkAAAAAAAAAAABkARQnAQ" className={styles.logo} />
          <View className={styles.text}>欢迎使用XXX</View>
        </View>
      </View>
    );
  }
}

export default Welcome;
