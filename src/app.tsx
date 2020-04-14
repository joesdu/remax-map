import './app.less';

import { Login, TokenLogin } from '@/models/model';
import { View, authorize, getSetting, getUserInfo } from 'remax/wechat';

import React from 'react';
import { Token } from '@/configs/config';
import { getCode } from '@/utils/utils';

class App extends React.Component {
  // did mount 的触发时机是在 onLaunch 的时候
  componentDidMount() {
    // 查看是否授权
    getSetting().then((res: any) => {
      if (res.authSetting['scope.userInfo']) {
        console.log('scope.userInfo');
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称
        getUserInfo().then((res: any) => {
          console.log(res.userInfo);
        });
      } else {
        console.log('scope.userInfo1');
        authorize({ scope: 'scope.userInfo' })
          .then(() => {
            console.log('scope.userInfo2');
            getUserInfo().then((res: any) => {
              console.log(res.userInfo);
            });
          })
          .catch((error: any) => {
            console.log('error', error);
          });
      }
    });
    if (Token) TokenLogin();
    else getCode().then((res: any) => Login(res.code));
  }

  onShow(options: any) {
    console.log('onShow', options);
  }

  render() {
    return <View>{this.props.children}</View>;
  }
}

export default App;
