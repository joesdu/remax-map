import { AppContext, ContextProps } from '@/app';
import { Button, View, getStorage, getUserInfo, login, redirectTo, setNavigationBarColor, vibrateShort, showModal } from 'remax/wechat';
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

  /**
   * 点击进入按钮,执行登录等操作
   */
  private onInto = (): void => {
    vibrateShort();
    login({
      success: (loginRes: WechatMiniprogram.LoginSuccessCallbackResult) => {
        Login(loginRes.code)
          .then(() => {
            getUserInfo({
              withCredentials: true,
              success: (res: WechatMiniprogram.GetUserInfoSuccessCallbackResult) => {
                const { encryptedData, iv } = res;
                const { nickName, avatarUrl, gender, country, province, city, language } = res.userInfo;
                UpdateUserInfo({ nickName, avatarUrl, gender, country, province, city, language }).catch((error: any) => console.warn(error));
                UpdatePhone({ encryptedData, iv }).catch((error) => console.warn(error));
              }
            });
          })
          .then(() => this.gotoMain());
      },
      fail: (args: WechatMiniprogram.GeneralCallbackResult) => console.info('登录异常:', args)
    });
  };

  /**
   * 进入首页时判断数据来源.是否是分享来的.并将相应数据存入到data中.
   */
  onShow = (): void => {
    setNavigationBarColor({ frontColor: '#ffffff', backgroundColor: '#9CB4E5' });
    let query: any = this.props.location.query;
    if (query.from === 'share') this.setState({ fromData: JSON.stringify(query), fromShare: 'share' });
    getStorage({
      key: 'token',
      success: (token: any) => {
        this.setState({ btnShow: false });
        getStorage({
          key: 'projectId',
          success: (projectId: any) => {
            this.context.setGlobal!({ needLogin: false });
            TokenLogin(token.data, { projectId: projectId.data })
              .then(() => setTimeout(() => this.gotoMain(), 1500))
              .catch((error: any) => {
                console.warn('TokenLogin is not available!', error);
                this.setState({ btnShow: true });
              });
          },
          fail: () => {
            console.warn('ProjectId is not available!');
            this.context.setGlobal!({ needLogin: true });
            TokenLogin(token.data)
              .then(() => setTimeout(() => this.gotoMain(), 1500))
              .catch((error: any) => {
                console.warn('TokenLogin is not available!', error);
                this.setState({ btnShow: true });
              });
          }
        });
      },
      fail: (error: any) => {
        console.warn('Token is not available!', error);
        this.setState({ btnShow: true });
      }
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
          <View className={styles.footerLink}>Insider Preview 20200729 扫描版1.6</View>
          <View className={styles.txtVersion}>Copyright © 2020 WinSide. All Rights Reserved.</View>
        </View>
      </View>
    );
  }
}

export default Welcome;
