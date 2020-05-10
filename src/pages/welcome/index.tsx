import { Button, Image, View, getUserInfo, login, redirectTo, vibrateShort } from 'remax/wechat';
import { Login, UpdatePhone, UpdateUserInfo } from '@/service';

import { AppContext } from '@/app';
import Config from '@/utils/config';
import { LogoIcon } from '@/assets/icons';
import React from 'react';
import styles from './index.less';

export interface WelcomeProps {
  location: any;
}
interface WelcomeState {
  fromData: string;
  fromShare: string;
}

class Welcome extends React.Component<WelcomeProps, WelcomeState> {
  static contextType = AppContext;
  context!: React.ContextType<typeof AppContext>;

  constructor(props: Readonly<WelcomeProps>) {
    super(props);
    this.state = {
      fromData: '',
      fromShare: 'mini'
    };
  }

  private onInto = () => {
    vibrateShort();
    login()
      .then((loginRes: WechatMiniprogram.LoginSuccessCallbackResult) => Login(loginRes.code))
      .then(() => redirectTo({ url: `../main/index?from=welcome&sharedata=${this.state.fromData}&fromshare=${this.state.fromShare}` }))
      .finally(() => {
        getUserInfo({ withCredentials: true }).then((res: WechatMiniprogram.GetUserInfoSuccessCallbackResult) => {
          const { encryptedData, iv } = res;
          const { nickName, avatarUrl, gender, country, province, city, language } = res.userInfo;
          UpdateUserInfo({ nickName, avatarUrl, gender, country, province, city, language }).catch((error: any) => console.warn(error));
          UpdatePhone({ encryptedData, iv }).catch((error) => console.warn(error));
        });
      });
  };

  onShow = () => {
    let query = this.props.location.query;
    if (query.from === 'share') this.setState({ fromData: JSON.stringify(query), fromShare: 'share' });
  };

  render() {
    return (
      <View className={styles.app}>
        <View className={styles.header}>
          <Image src={LogoIcon} className={styles.logo} />
          <View className={styles.text}>欢迎使用</View>
        </View>
        <View className={styles.into}>
          <Button className={styles.intoBtn} openType="getUserInfo" onClick={this.onInto}>
            进入小程序
          </Button>
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
