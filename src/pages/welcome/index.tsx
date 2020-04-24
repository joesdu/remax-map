import { Image, View, getSystemInfo, getUserInfo, login, redirectTo } from 'remax/wechat';
import { Login, UpdatePhone, UpdateUserInfo } from '@/service';

import { AppContext } from '@/app';
import Dialog from '@vant/weapp/dist/dialog/dialog';
import { LogoIcon } from '@/assets/icons';
import React from 'react';
import VantButton from '@vant/weapp/dist/button';
import VantDialog from '@vant/weapp/dist/dialog';
import styles from './index.module.less';

export interface WelcomeProps {
  location: any;
}
interface WelcomeState {
  version: string;
  copyright: string;
}

class Welcome extends React.Component<WelcomeProps, WelcomeState> {
  static contextType = AppContext;

  constructor(props: Readonly<WelcomeProps>) {
    super(props);
    this.state = {
      version: 'Insider Preview 20200424-1120',
      copyright: 'Copyright © 2020'
    };
  }

  onInto = () => {
    getUserInfo({ withCredentials: true }).then((res: any) => {
      let userInfo = res.userInfo;
      login()
        .then((res: any) => Login(res.code))
        .then(() => redirectTo({ url: '../main/index?from=welcome' }))
        .finally(() => {
          const { nickName, avatarUrl, gender, country, province, city, language, encryptedData, iv } = userInfo;
          UpdateUserInfo({ nickName, avatarUrl, gender, country, province, city, language });
          UpdatePhone({ encryptedData, iv });
        });
    });
  };

  onShow = () => {
    getSystemInfo()
      .then((res: any) => {
        const { locationAuthorized, bluetoothEnabled, locationEnabled } = res;
        if (!locationAuthorized || !bluetoothEnabled || !locationEnabled) {
          Dialog.alert!({
            title: '权限不足',
            message: '请到系统应用设置打开微信相关权限:允许微信使用定位的开关,以及打开操作系统的蓝牙的开关和地理位置的开关'
          });
        } else {
          this.context.SearchIBeacon();
        }
      })
      .catch((error: any) => console.error(error));
  };

  render() {
    const { version, copyright } = this.state;

    return (
      <View className={styles.app}>
        <View className={styles.header}>
          <Image src={LogoIcon} className={styles.logo} />
          <View className={styles.text}>欢迎使用</View>
        </View>
        <View className={styles.into}>
          <VantButton custom-style={'width:250px'} color="#1B73FA" round open-type="getUserInfo" bindclick={this.onInto}>
            进入小程序
          </VantButton>
        </View>
        <View className={styles.viewFooter}>
          <View className={styles.footerLink}>{version}</View>
          <View className={styles.txtVersion}>{copyright}</View>
        </View>
        <VantDialog id="van-dialog" />
      </View>
    );
  }
}

export default Welcome;
