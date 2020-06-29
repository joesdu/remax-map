import { AppContext, ContextProps } from '@/app';
import { Button, View, getStorage, getUserInfo, login, redirectTo, setNavigationBarColor, vibrateShort } from 'remax/wechat';
import { Login, TokenLogin, UpdatePhone, UpdateUserInfo } from '@/service';

import React from 'react';
import styles from './index.less';

interface WelcomeProps {
  location: any;
}
interface WelcomeState {
  fromData: string;
  fromShare: string;
  btnShow: boolean;
}

class Welcome extends React.Component<WelcomeProps, WelcomeState> {
  static contextType: React.Context<Partial<ContextProps>> = AppContext;
  context!: React.ContextType<typeof AppContext>;

  constructor(props: Readonly<WelcomeProps>) {
    super(props);
    this.state = {
      fromData: '',
      fromShare: 'mini',
      btnShow: false
    };
  }

  private gotoMain = (): void => {
    const { fromData, fromShare } = this.state;
    this.context.setGlobal!({
      currentData: {
        from: 'welcome',
        current: fromData,
        isShare: fromShare === 'share'
      }
    });
    redirectTo({ url: '../main/index' });
  };

  private onInto = (): void => {
    vibrateShort();
    login()
      .then((loginRes: WechatMiniprogram.LoginSuccessCallbackResult) => Login(loginRes.code))
      .finally(() => {
        getUserInfo({ withCredentials: true })
          .then((res: WechatMiniprogram.GetUserInfoSuccessCallbackResult) => {
            const { encryptedData, iv } = res;
            const { nickName, avatarUrl, gender, country, province, city, language } = res.userInfo;
            UpdateUserInfo({ nickName, avatarUrl, gender, country, province, city, language }).catch((error: any) => console.warn(error));
            UpdatePhone({ encryptedData, iv }).catch((error) => console.warn(error));
          })
          .then(() => this.gotoMain());
      });
  };

  onShow = (): void => {
    setNavigationBarColor({ frontColor: '#ffffff', backgroundColor: '#9CB4E5' });
    let query: any = this.props.location.query;
    if (query.from === 'share') this.setState({ fromData: JSON.stringify(query), fromShare: 'share' });
    getStorage({ key: 'token' })
      .then((token: any) => {
        this.setState({ btnShow: false });
        getStorage({ key: 'projectId' })
          .then((projectId: any) => {
            this.context.setGlobal!({ needLogin: false });
            TokenLogin(token.data, { projectId: projectId.data })
              .then(() => setTimeout(() => this.gotoMain(), 1500))
              .catch((error: any) => {
                console.warn('TokenLogin is not available!', error);
                this.setState({ btnShow: true });
              });
          })
          .catch(() => {
            console.warn('ProjectId is not available!');
            this.context.setGlobal!({ needLogin: true });
            TokenLogin(token.data)
              .then(() => setTimeout(() => this.gotoMain(), 1500))
              .catch((error: any) => {
                console.warn('TokenLogin is not available!', error);
                this.setState({ btnShow: true });
              });
          });
      })
      .catch((error: any) => {
        console.warn('Token is not available!', error);
        this.setState({ btnShow: true });
      });
  };

  render(): JSX.Element {
    const { btnShow } = this.state;
    return (
      <View className={styles.app}>
        {btnShow ? (
          <View className={styles.into}>
            <Button className={styles.intoBtn} openType="getUserInfo" onClick={this.onInto}>
              进入小程序
            </Button>
          </View>
        ) : undefined}
        <View className={styles.viewFooter}>
          <View className={styles.footerLink}>Insider Preview 20200629.1810</View>
          <View className={styles.txtVersion}>Copyright © 2020 WinSide. All Rights Reserved.</View>
        </View>
      </View>
    );
  }
}

export default Welcome;
