import './app.less';

import React from 'react';
import { View } from 'remax/wechat';

class App extends React.Component {
  onShow(options: any) {
    console.log('onShow', options);
  }

  render() {
    return <View>{this.props.children}</View>;
  }
}

export default App;
