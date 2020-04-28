import { Image, View, getSystemInfo, getUserInfo, login, redirectTo, showModal } from 'remax/wechat';
import { Login, UpdatePhone, UpdateUserInfo } from '@/service';

import { AppContext } from '@/app';
import Config from '@/utils/config';
import { LogoIcon } from '@/assets/icons';
import React from 'react';
import VantButton from '@vant/weapp/dist/button';
import styles from './index.module.less';

export interface WelcomeProps {
  location: any;
}
interface WelcomeState {
  fromData: string;
  fromShare: string;
}

class Welcome extends React.Component<WelcomeProps, WelcomeState> {
  static contextType = AppContext;

  constructor(props: Readonly<WelcomeProps>) {
    super(props);
    this.state = { fromData: '', fromShare: 'mini' };
  }

  onInto = () => {
    getUserInfo({ withCredentials: true }).then((res: any) => {
      login()
        .then((loginRes: any) => Login(loginRes.code))
        .then(() => redirectTo({ url: `../main/index?from=welcome&sharedata=${this.state.fromData}&fromshare=${this.state.fromShare}` }))
        .finally(() => {
          const { nickName, avatarUrl, gender, country, province, city, language, encryptedData, iv } = res.userInfo;
          UpdateUserInfo({ nickName, avatarUrl, gender, country, province, city, language }).catch((error) => console.warn(error));
          UpdatePhone({ encryptedData, iv }).catch((error) => console.warn(error));
        });
    });
  };

  onShow = () => {
    let query = this.props.location.query;
    if (query.from === 'share') this.setState({ fromData: JSON.stringify(query), fromShare: 'share' });
    getSystemInfo()
      .then((res: any) => {
        this.context.setGlobal({ systemInfo: res });
        const { locationAuthorized, bluetoothEnabled, locationEnabled } = res;
        if (!locationAuthorized || !bluetoothEnabled || !locationEnabled) {
          showModal({ title: '权限不足', content: '请到系统应用设置打开微信相关权限:允许微信使用定位的开关,以及打开操作系统的蓝牙的开关和地理位置的开关', showCancel: false });
        } else if (!this.context.global.bluetooth) this.context.SearchIBeacon();
      })
      .catch((error: any) => console.error(error));
  };

  render() {
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
          <View className={styles.footerLink}>{Config.Version}</View>
          <View className={styles.txtVersion}>{Config.Copyright}</View>
        </View>
      </View>
    );
  }
}

export default Welcome;
