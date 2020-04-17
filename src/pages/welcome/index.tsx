import { Copyright, Token, Version } from '@/configs/config';
import { Image, View, authorize, checkSession, getSystemInfo, getUserInfo, redirectTo } from 'remax/wechat';
import { Login, TokenLogin, UpdatePhone, UpdateUserInfo } from '@/service/service';

import { AppContext } from '@/app';
import Dialog from '@vant/weapp/dist/dialog/dialog';
import React from 'react';
import VantButton from '@vant/weapp/dist/button';
import VantDialog from '@vant/weapp/dist/dialog';
import { getCode } from '@/utils/utils';
import logo from '@/assets/logo.svg';
import styles from './index.module.less';

class Welcome extends React.Component {
  static contextType = AppContext;
  // did mount 的触发时机是在 onLaunch 的时候
  componentDidMount() {
    setTimeout(() => {
      getSystemInfo()
        .then((res: any) => {
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
  }

  onTest = () => {
    // 用于测试Context
    console.log(this.context.global.test);
    this.context.setGlobal({ test: 'ces' });
    console.log(this.context.global.test);
  };

  onInto = () => {
    authorize({ scope: 'scope.userInfo' })
      .then(() => {
        getUserInfo({ withCredentials: true }).then((res: any) => {
          let userInfo = res.userInfo;
          let reLogin: boolean = false;
          // 暂时注释API请求部分内容
          if (Token) {
            checkSession()
              .then(() => {
                reLogin = false;
                TokenLogin();
              })
              .catch(() => (reLogin = true));
          } else reLogin = true;
          if (reLogin) {
            getCode()
              .then((res: any) => {
                console.log(res);
                Login(res.code);
              })
              .then(() => {
                const { nickName, avatarUrl, gender, country, province, city, language, encryptedData, iv } = userInfo;
                UpdateUserInfo({ nickName, avatarUrl, gender, country, province, city, language });
                UpdatePhone({ encryptedData, iv });
              });
          }
          redirectTo({ url: '../main/index?from=welcome' });
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
