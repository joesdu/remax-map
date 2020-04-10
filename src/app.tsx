import './app.less';

import React from 'react';
import { View } from 'remax/wechat';

class App extends React.Component {
  // did mount 的触发时机是在 onLaunch 的时候
  componentDidMount() {
    console.log('App launch');
  }
  onShow(options: any) {
    console.log('onShow', options);
  }

  render() {
    return <View>{this.props.children}</View>;
  }
}

export default App;
