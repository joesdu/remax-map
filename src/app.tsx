import './app.less';

import React from 'react';

class App extends React.Component {
  // did mount 的触发时机是在 onLaunch 的时候
  componentDidMount() {
    console.log('App launch');
  }
  onShow(options: any) {
    console.log('onShow', options);
  }
  render() {
    return this.props.children;
  }
}

export default App;
