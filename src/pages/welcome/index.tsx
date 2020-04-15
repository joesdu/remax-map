import { Copyright, Token, Version } from '@/configs/config';
import { Image, View, authorize, getSystemInfo, getUserInfo } from 'remax/wechat';
import { Login, TokenLogin } from '@/models/model';

import Dialog from '@vant/weapp/dist/dialog/dialog';
import React from 'react';
import VantButton from '@vant/weapp/dist/button';
import VantDialog from '@vant/weapp/dist/dialog';
import { getCode } from '@/utils/utils';
import logo from '@/assets/logo.svg';
import styles from './index.module.less';

class Welcome extends React.Component {
  //TODO 欢迎页面预留,可以用于校验微信是否开启相关权限,获取基础数据等操作.
  // did mount 的触发时机是在 onLaunch 的时候
  componentDidMount() {
    setTimeout(() => {
      getSystemInfo()
        .then((res: any) => {
          console.log(res);
          const { locationAuthorized, bluetoothEnabled, locationEnabled } = res;
          if (!locationAuthorized || !bluetoothEnabled || !locationEnabled) {
            Dialog.alert({
              title: '权限不足',
              message: '请到系统应用设置打开微信相关权限:允许微信使用定位的开关,以及打开操作系统的蓝牙的开关和地理位置的开关'
            });
          }
        })
        .catch((error: any) => console.error(error));
    }, 1300);
    authorize({ scope: 'scope.userInfo' })
      .then((res: any) => console.log(`authorize:${res}`))
      .catch((error: any) => console.error(error));
  }

  onInto = () => {
    authorize({ scope: 'scope.userInfo' })
      .then(() => {
        console.log('authorize:true');
        getUserInfo({ withCredentials: true }).then((res: any) => {
          console.log(res.userInfo);
          if (Token) TokenLogin();
          else getCode().then((res: any) => Login(res.code));
        });
      })
      .catch((error: any) => console.error(error));
  };

  render() {
    return (
      <View className={styles.app}>
        <View className={styles.header}>
          <Image src={logo} className={styles.logo} />
          <View className={styles.text}>欢迎使用</View>
        </View>
        <View className={styles.into}>
          <VantButton custom-style={'width:250px'} color="#1B73FA" round open-type="getUserInfo" bindclick={this.onInto}>
            进入小程序
          </VantButton>
        </View>
        <View className={styles.viewFooter}>
          <View className={styles.footerLink}>{Version}</View>
          <View className={styles.txtVersion}>{Copyright}</View>
        </View>
        <VantDialog id="van-dialog"></VantDialog>
      </View>
    );
  }
}

export default Welcome;
